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

  getLesson: (req, res) => {
    const teacher_id = req.query.teacher_id;
    const _id = req.query._id;

    let query = {};

    if (teacher_id) {
      query.teacher_id = teacher_id;
    } else if (_id) {
      query._id = _id;
    } else {
      return res.status(400).json({
        message: "Either teacherId or id must be provided",
      });
    }

    Lesson.find(query)
      .exec()
      .then((lesson) => {
        return res.status(200).json({ lesson });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          message: "Error retrieving lessons",
        });
      });
  },
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
