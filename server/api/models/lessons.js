// const { DateTimeProvider } = require('angular-oauth2-oidc');
const mongoose = require('mongoose');


const lessonSchema= mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    length:Number,
    myDate:Date,
    teacher_id:String, 
    student_id:String,
    product_id:String
})


module.exports=mongoose.model('Lesson', lessonSchema);