// models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    myDate:{ type:Date, require: true},
    endDate:{ type:Date, require: true},
    teacher_id:{ type:String, require: true}, 
    student_id:{ type:String, require: true},
    product_id:{ type:String, require: true}, 
    teacher_name:{ type:String, require: true},
    student_name:{ type:String, require: true},
    read: { type: Boolean, default: false }
});
notificationSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
