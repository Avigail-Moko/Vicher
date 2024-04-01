const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true }, // add here all your validation
    description:String,
    content:String,
})

module.exports=mongoose.model('Category', categorySchema);