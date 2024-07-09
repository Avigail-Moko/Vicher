const mongoose = require('mongoose');


const busyEventSchema= mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    startDate:Date,
    endDate:Date,
    teacher_id:String, 
})

busyEventSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports=mongoose.model('BusyEvent', busyEventSchema);