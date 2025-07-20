const mongoose = require("mongoose");

const roomUsageSchema = new mongoose.Schema({
  year: Number,
  month: Number,
  totalSeconds: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("MonthlyRoomUsage ", roomUsageSchema);
