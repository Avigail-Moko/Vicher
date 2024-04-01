const mongoose = require('mongoose');

const articaleSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true }, // add here all your validation
    description:String,
    content:String,
    categoryId: {type: mongoose.Types.ObjectId,required:true,ref:"Category"},
    image: {type: String}
})

module.exports=mongoose.model('Articale', articaleSchema);