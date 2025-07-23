const mongoose = require("mongoose");
const Lesson = require("../models/lessons");
const Notification = require("../models/notification");
const MonthlyRoomUsage = require("../models/monthlyRoomUsage ");
const { createNote } = require("./notification");
const Agenda = require("agenda");

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// socket
let io;

const setIo = (socketIo) => {
  io = socketIo;
};
// agenda
const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER_URL}/?retryWrites=true&w=majority`;

const agenda = new Agenda({
  db: { address: mongoUri, collection: "notificationJobs" },
});
agenda.start();



async function sendUsageWarningEmail() {
  try {
    await resend.emails.send({
      from: "Vicher App <noreply@vicherapp.com>",
      to: "vicher062023@gmail.com", 
      subject: "⚠️ חריגה מ-400 שעות חודשיות ב daily.co",
      html: `
        <p>שימו לב,</p>
        <p>עברתם את הסף של 400 שעות חודשיות (שהם 200 שיעורים זוגיים של שעה)</p>
        <p>(המערכת שלנו מגבילה סה"כ עד 1000 שעות חודשיות (שהם סה"כ 500 שיעורים זוגיים של שעה </p>
      `,
    });

    console.log("Warning email sent successfully");
  } catch (err) {
    console.error("Failed to send warning email:", err);
  }
}

module.exports = {
  setIo,

  createLesson: async (req, res) => {
    const {
      myDate,
      teacher_id,
      student_id,
      product_id,
      length,
      teacher_name,
      student_name,
      student_mail,
      lesson_title,
    } = req.body;

    const startDate = new Date(myDate);
    const endDate = new Date(startDate.getTime() + length * 60000);
    const durationSeconds = length * 60;

    try {
      // בדיקת שיעור מתנגש
      const existingLesson = await Lesson.findOne({
        teacher_id,
        myDate: { $lte: endDate },
        endDate: { $gte: startDate },
      }).exec();

      if (existingLesson) {
        return res.status(400).json({
          message: `A lesson already exists for this teacher on the selected date and time.`,
        });
      }

      // בדיקת שימוש חודשי
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      let usage = await MonthlyRoomUsage.findOne({ year, month });
      if (!usage) {
        usage = await MonthlyRoomUsage.create({ year, month, totalSeconds: 0 });
      }

      const maxMonthlySeconds = 500 * 60 * 60;
      if (usage.totalSeconds + durationSeconds > maxMonthlySeconds) {
        return res
          .status(403)
          .json({ error: "Monthly room time limit (500 hours) exceeded." });
      }

      // פתיחת טרנזקציה רק לאחר בדיקות מוקדמות
      const session = await mongoose.startSession();
      session.startTransaction();

      usage.totalSeconds += durationSeconds;

      // שליחת מייל אזהרה במידה ועברנו את המכסה של 200 שעות
      const warningThresholdSeconds = 200 * 60 * 60; 
      if (usage.totalSeconds > warningThresholdSeconds && !usage.warningSent) {
        await sendUsageWarningEmail();
        usage.warningSent = true;
      }

      await usage.save({ session });

      const lesson = new Lesson({
        _id: new mongoose.Types.ObjectId(),
        length,
        myDate,
        endDate,
        teacher_id,
        student_id,
        teacher_name,
        student_name,
        student_mail,
        product_id,
        lesson_title,
      });

      await lesson.save({ session });
      const lesson_id = lesson._id;

      await createNote(
        myDate,
        endDate,
        teacher_id,
        student_id,
        lesson_id,
        teacher_name,
        student_name,
        session
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Lesson and note created successfully",
      });
    } catch (error) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }

      if (error.message.includes("Lesson")) {
        res.status(500).json({
          message: "Error creating lesson",
          error,
        });
      } else {
        res.status(500).json({
          message: "Error creating note",
          error,
        });
      }
    }
  },

  getLesson: async (req, res) => {
    const teacher_id = req.query.teacher_id;
    const _id = req.query._id;
    const student_id = req.query.student_id;

    if (!teacher_id && !student_id && !_id) {
      return res.status(400).json({
        message: "Either teacherId, studentId, or id must be provided",
      });
    }

    let lessons = [];

    try {
      if (teacher_id) {
        const teacherLessons = await Lesson.find({ teacher_id }).exec();
        lessons = lessons.concat(teacherLessons);
      }

      if (student_id) {
        const studentLessons = await Lesson.find({ student_id }).exec();
        lessons = lessons.concat(studentLessons);
      }

      if (_id) {
        const idLessons = await Lesson.find({ _id }).exec();
        lessons = lessons.concat(idLessons);
      }

      // מסננים כפילויות לפי _id
      const uniqueLessons = Array.from(
        new Set(lessons.map((item) => item._id))
      ).map((id) => lessons.find((item) => item._id === id));

      return res.status(200).json({ lessons: uniqueLessons });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        message: "Error retrieving lessons",
      });
    }
  },
  deleteLesson: (req, res) => {
    const _id = req.query._id;

    Lesson.deleteOne({ _id: _id })
      .then(() => {
        res.status(200).json({
          message: "lesson deleted",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });

    Notification.findOneAndUpdate(
      { lesson_id: _id },
      {
        $set: {
          deleteLesson: "true",
          teacherStatus: "unread",
          studentStatus: "unread",
        },
      },
      { new: true }
    )
      .exec()
      .then((result) => {
        io.emit("notification", {
          type: "deleteLesson",
          deleteLesson: "true",
          note: result,
        });
        agenda.cancel(
          { "data.notificationId": result._id },
          (err, numRemoved) => {
            if (err) {
              console.error("Failed to delete job:", err);
            } else {
              console.log(`${numRemoved} job(s) canceled.`);
            }
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
  },

  //   updateLesson: (req, res) => {
  //     const _id = req.query._id;
  //     const updateFields = req.body; // אובייקט שיכיל את כל השדות שברצונך לעדכן

  //     Lesson.updateOne({ _id: _id }, { $set: updateFields })
  //       .exec()
  //       .then((result) => {
  //         res.status(200).json({
  //           message: "Lesson updated successfully",
  //           result: result,
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         res.status(500).json({
  //           error: error,
  //         });
  //       });
  //   },


};
