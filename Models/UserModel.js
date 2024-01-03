const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    Username : {type : String, required : [true, "Please Enter Your Username"], trim : true, unique : [true, "Username Already In use"]},
    Email : {type : String, required : [true, "Please Enter Your Email Address"], trim : true, unique : [true, "Email Already In use"]},
    Password : {type : String, required : [true, "Please Enter Your Password"], trim : true},
    Image : {type : String, required : [false, "Please Enter Your Profile Image"], trim : true}
}, {timestamps : true})

const UserModel =  mongoose.model("Users", UserSchema);
module.exports = { UserModel };