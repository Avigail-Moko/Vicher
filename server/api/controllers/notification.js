const mongoose = require("mongoose");
const Notification = require("../models/notification");
const Agenda = require("agenda");
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

agenda.define("update startLesson", async (job) => {
  const { notificationId } = job.attrs.data;
  await Notification.updateOne(
    { _id: notificationId },
    { $set: { startLesson: true } }
  );
  io.emit("notification", {
    type: "startLesson",
    _id: notificationId,
    startLesson: true,
  });
});

agenda.start();
module.exports = {
  setIo,

  createNote: async (
    myDate,
    endDate,
    teacher_id,
    student_id,
    product_id,
    teacher_name,
    student_name,
    session
  ) => {
    const note = new Notification({
      _id: new mongoose.Types.ObjectId(),
      myDate,
      endDate,
      teacher_id,
      student_id,
      product_id,
      teacher_name,
      student_name,
      studentStatus: "unread",
      teacherStatus: "unread",
      startLesson: false,
    });

    await note.save({ session });
    io.emit("notification", { type: "new", note });

    const scheduleTime = new Date(myDate).getTime() - 15 * 60 * 1000;
    agenda.schedule(new Date(scheduleTime), "update startLesson", {
      notificationId: note._id,
    });
  },
  getNote: (req, res) => {
    const userId = req.query.userId;

    Notification.find({ $or: [{ student_id: userId }, { teacher_id: userId }] })
      .exec()
      .then((notification) => {
        return res.status(200).json({ notification });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          message: "Error retrieving notifications",
        });
      });
  },

  markNotificationsAsRead: (req, res) => {
    const _id = req.query._id;
    const userId = req.body.userId;

    Notification.findOne({ _id: _id })
      .then((notification) => {
        if (!notification) {
          return res.status(404).json({
            message: "Notification not found",
          });
        }
        const studentId = notification.student_id;
        const teacherId = notification.teacher_id;

        if (userId === studentId) {
          // Update student status to true
          return Notification.updateOne(
            { _id: _id },
            { $set: {  studentStatus: 'read' } }
          ).exec().then(result => {
            io.emit("notification", { type: "studentReadStatus", _id, studentStatus: 'read' });
            return result;
          });
        } else if (userId === teacherId) {
          // Update only the notification status
          return Notification.updateOne(
            { _id: _id },
            { $set: { teacherStatus: 'read' } }
          ).exec().then(result => {
            io.emit("notification", { type: "teacherReadStatus", _id, teacherStatus: 'read' });
            return result;
          });
        }
      })
      .then((result) => {
        res.status(200).json({
          message: "Note updated successfully",
          result: result,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          error: error,
        });
      });
  },
  deleteNote: (req, res) => {
    const _id = req.query._id;
    const userId = req.body.userId;

    Notification.findOne({ _id: _id })
      .then((notification) => {
        if (!notification) {
          return res.status(404).json({
            message: "Notification not found",
          });
        }
        const studentId = notification.student_id;
        const teacherId = notification.teacher_id;

        if (userId === studentId) {
          // Update student status to true
          return Notification.updateOne(
            { _id: _id },
            { $set: {  studentStatus: 'delete' } }
          ).exec().then(result => {
            io.emit("notification", { type: "studentdeleteStatus", _id, studentStatus: 'delete' });
            return result;
          });
        } else if (userId === teacherId) {
          // Update only the notification status
          return Notification.updateOne(
            { _id: _id },
            { $set: { teacherStatus: 'delete' } }
          ).exec().then(result => {
            io.emit("notification", { type: "teacherdeleteStatus", _id, teacherStatus: 'delete' });
            return result;
          });
        }
      })
      .then((result) => {
        res.status(200).json({
          message: "Note updated successfully",
          result: result,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          error: error,
        });
      });
  },
  startLesson: (_id, res) => {
    Notification.updateOne({ _id: _id }, { $set: { startLesson: true } })
      .exec()
      .then((result) => {
        io.emit("notification", {
          type: "startLesson",
          _id,
          startLesson: true,
        });

        res.status(200).json({
          message: "startLesson successfully",
          result: result,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          error: error,
        });
      });
  },

};
