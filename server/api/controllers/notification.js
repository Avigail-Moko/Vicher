const mongoose = require("mongoose");
const Notification = require("../models/notification");

module.exports = {
  createNote: (myDate, endDate, teacher_id, student_id, product_id) => {
    const note = new Notification({
      myDate,
      endDate,
      teacher_id,
      student_id,
      product_id,
      read: false,
    });
    note
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: "note created",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          message: "note not saved",
        });
      });
  },

  getNote: (req, res) => {
    const userId = req.query.userId; 

    Notification.find({$or: [
        { student_id: userId },
        { teacher_id: userId }
      ] } )
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
  }
};
