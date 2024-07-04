const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    profileImage:String,
    email:{
        type: String,
         require: true,
          unique:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: {type: String, require: true},
    name:{type:String, require: true},
    subject:{type:String, require: true},
    description: { type: String },
    ratings: [
        {
            rating: { type: Number, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    averageRating: { type: Number, default: 0 }

})

module.exports=mongoose.model('User', userSchema);
