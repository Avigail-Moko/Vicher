const mongoose = require('mongoose');

const pendingUserSchema = mongoose.Schema({
 profileImage:String,
    email:{
        type: String,
         require: true,
          unique:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: {type: String, require: true},
    name:{type:String, require: true},
  createdAt: {type: Date,default: Date.now},
});

pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 330 });

module.exports = mongoose.model('PendingUser', pendingUserSchema);
