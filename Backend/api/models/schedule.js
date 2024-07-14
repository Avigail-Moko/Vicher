const mongoose = require('mongoose');


const scheduleSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId, 
    teacher_id:String, 
    objectsArray:Array
})


module.exports=mongoose.model('Schedule', scheduleSchema);