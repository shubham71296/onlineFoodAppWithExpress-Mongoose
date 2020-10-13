const mongoose=require('mongoose');
const foodSchema=mongoose.Schema({
  
  name: String,
  image: String,
  price: Number,
  description: String
   
});

module.exports=mongoose.model('food',foodSchema);
	