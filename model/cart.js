const mongoose=require('mongoose');
const cartSchema=mongoose.Schema({
  
  email:String,
  itemid: {type: mongoose.Schema.ObjectId, required:true},
  name:String,
  quantity:Number
  
});

module.exports=mongoose.model('cart',cartSchema);
	