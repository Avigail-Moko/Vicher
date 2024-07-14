const mongoose = require("mongoose");
const BusyEvent = require("../models/busyEvents");

module.exports = {
  createBusyEvent: (req, res) => {
    const { teacher_id,nameEvent, startDate, endDate } = req.body;

    const busyEvent = new BusyEvent({
      _id: new mongoose.Types.ObjectId(),
      nameEvent,
      startDate,
      endDate,
      teacher_id,
    });
    busyEvent
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          message: "busyEvent created",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          message: "busyEvent not saved",
        });
      });
  },
  getAllTeacherBusyEvents: (req, res) => {
    const teacher_id = req.query.teacher_id;
    BusyEvent.find({ teacher_id })
      .exec()
      .then((busyEvent) => {
        return res.status(200).json({ busyEvent });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({
          message: "Error retrieving busyEvent",
        });
      });
  },
  deleteBusyEvent: (req, res) => {
    const _id = req.query._id;

    BusyEvent.deleteOne({ _id: _id })
      .then(() => {
        res.status(200).json({
          message: "busyEvent deleted",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  },
};
