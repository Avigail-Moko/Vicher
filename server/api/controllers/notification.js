const mongoose = require('mongoose');
const Notification = require('../models/notification');

let io;

const setIo = (socketIo) => {
  io = socketIo;
};

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
        read: false,
      });

      await note.save({ session });
      io.emit('notification', { type: 'new', note });

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
    Notification.updateOne({_id:_id}, { $set: { read: true } })
        .exec()
        .then(result => {
          io.emit('notification', { type: 'update', _id, read: true });

          res.status(200).json({
              message: 'Note updated successfully',
              result: result
          });

      })
      .catch(error => {
          console.error('Error:', error);
          res.status(500).json({
              error: error
          });
      });
},

  deleteNote: (req, res) =>{
    const _id = req.query._id;

    Notification.deleteOne({ _id: _id })
      .then(() => {
        io.emit('notification', { type: 'delete', _id });

        res.status(200).json({
          message: "note deleted",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  }
};
