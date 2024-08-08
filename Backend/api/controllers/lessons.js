const mongoose = require("mongoose");
const Lesson = require("../models/lessons");
const { createNote } = require("./notification");

module.exports = {
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
      product_id,
      lesson_title
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
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
//   deleteLesson: (req, res) => {
//     const _id = req.query._id;

//     Lesson.deleteOne({ _id: _id })
//       .then(() => {
//         res.status(200).json({
//           message: "lesson deleted",
//         });
//       })
//       .catch((error) => {
//         res.status(500).json({
//           error,
//         });
//       });
//   },
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
