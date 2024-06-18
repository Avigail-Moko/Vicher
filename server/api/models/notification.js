// models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    myDate:Date,
    endDate:Date,
    teacher_id:String, 
    student_id:String,
    product_id:String,  
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
