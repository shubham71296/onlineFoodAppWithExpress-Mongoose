const mongoose=require('mongoose');

const signupSchema=mongoose.Schema({
  
  username:String,
  useremail: String,
  userpassword: String,
   
});

module.exports=mongoose.model('usersignup',signupSchema);