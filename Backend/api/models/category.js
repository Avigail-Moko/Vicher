const mongoose = require('mongoose');


const categorySchema= mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
category_name:String,
})

module.exports=mongoose.model('Category', categorySchema);