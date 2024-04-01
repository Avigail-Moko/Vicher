const mongoose = require('mongoose');


const productSchema= mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
lesson_title:String,
category: String,
price: Number,
length: Number,
description: String,
userId: String,
userProfileName:String,
userProfileImage:String,
// image: {type: String}
image: {
    filename: String,
    path: String,
    src: String
    // ייתכן שתרצי להוסיף גם את שאר המידע שמחזיק multer על הקובץ, כמו size וכו'
}
})

module.exports=mongoose.model('Product', productSchema);