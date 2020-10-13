const mongoose=require('mongoose');

const adminSchema=mongoose.Schema({
  
  eid: String,
  pass: String,
   
});

module.exports=mongoose.model('admin',adminSchema);