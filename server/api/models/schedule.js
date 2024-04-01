const mongoose = require('mongoose');


const scheduleSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId, 
    teacher_id:String, 
    startTime:Date,
    endTime:Date,
    dayOfEvent:Date
})


module.exports=mongoose.model('Schedule', scheduleSchema);