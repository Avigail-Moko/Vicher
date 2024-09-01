const mongoose = require("mongoose");
const Lesson = require("../models/lessons");
const Notification = require("../models/notification");
const { createNote } = require("./notification");
const Agenda = require("agenda");
const lessons = require("../models/lessons");

// socket
let io;

const setIo = (socketIo) => {
  io = socketIo;
};
// agenda
const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.5rd1vlt.mongodb.net/?retryWrites=true&w=majority`;

const agenda = new Agenda({
  db: { address: mongoUri, collection: "notificationJobs" },
});
agenda.start();


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
      lesson_title
    } = req.body;
    const startDate = new Date(myDate);
    const endDate = new Date(startDate.getTime() + length * 60000);

    const lesson = new Lesson({
      _id: new mongoose.Types.ObjectId(),
      length,
      myDate,
      endDate,
      teacher_id,
      student_id,
      teacher_name,
      student_name,
      product_id,
      lesson_title
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
    
          // בדיקה אם קיים כבר שיעור עבור המורה באותו תאריך וזמן
          const existingLesson = await Lesson.findOne({
            teacher_id,
            myDate: {
                $lte: endDate, // בדיקה אם תחילת השיעור החדש חופפת לשיעור קיים
            },
            endDate: {
                $gte: startDate, // בדיקה אם סיום השיעור החדש חופפת לשיעור קיים
            },
        }).exec();

        if (existingLesson) {
            // אם נמצא שיעור מתנגש, מחזירים הודעת שגיאה
            return res.status(400).json({
                message: `A lesson already exists for this teacher on the selected date and time.`,
            });
        }


      await lesson.save({ session });
const lesson_id= lesson._id
      await createNote(
        myDate,
        endDate,
        teacher_id,
        student_id,
        lesson_id,
        teacher_name,
        student_name,
        session
    )

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Lesson and note created successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

 if (error.message.includes("Lesson")) {
        res.status(500).json({
          message: "Error creating lesson",
          error,
        });
      }else {
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
        const uniqueLessons = Array.from(new Set(lessons.map(item => item._id)))
                                   .map(id => lessons.find(item => item._id === id));

        return res.status(200).json({ lessons: uniqueLessons });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Error retrieving lessons",
        });
    }
}
,
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
        { $set: { deleteLesson: "true",teacherStatus:"unread",studentStatus:"unread" } },
        { new: true } 
      ).exec()
        .then((result) => {
          io.emit("notification", {
            type: "deleteLesson",
            deleteLesson: "true",
            note: result,
          });
          agenda.cancel({ 'data.notificationId': result._id }, (err, numRemoved) => {
            if (err) {
              console.error("Failed to delete job:", err);
            } else {
              console.log(`${numRemoved} job(s) canceled.`);
            }
          });
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
