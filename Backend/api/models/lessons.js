// const { DateTimeProvider } = require('angular-oauth2-oidc');
const mongoose = require('mongoose');


const lessonSchema= mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    length:Number,
    myDate:Date,
    endDate:Date,
    teacher_id:String, 
    student_id:String,
    teacher_name:String,
    student_name:String,
    product_id:String,
    lesson_title:String
})

lessonSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports=mongoose.model('Lesson', lessonSchema);