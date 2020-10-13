const express =require('express');
const Food=require('./model/food');
const Admin=require('./model/admin');
const Signup=require('./model/usersignup');
const Cart=require('./model/cart');
const session=require('express-session');
const app=express();

app.listen(3000,()=>{
  console.log("server started....");
});


app.use(express.static('public'));
var path=require('path');
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');


app.use(session({secret:"aakjskj"}))

//var hbs=require('express-handlebars');
//app.engine('hbs',hbs({
	//extname: 'hbs',
	//defaultLayout:'mainLayout',
	//layoutsDir:__dirname + '/views/layouts/'
//}) );

//app.set('view engine','hbs');

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended:true
}));

const upload=require('express-fileupload');
app.use(upload());

const URL="mongodb://localhost:27017/fooddb";
const mongoose=require('mongoose');
mongoose.connect(URL);

//console.log('server started');

app.get('/',(req,res)=>{
    res.render('welcomefood');
});

app.get('/usersignup',(req,res)=>{
    res.render('signupuser');
});

app.post('/signupsuccess',(req,res)=>{
    var signup=new Signup({
     username:req.body.uname,       
     useremail:req.body.uemail ,
     userpassword:req.body.upass
    });
    signup.save().then(data=>{
       //res.send('data inserted');
       res.render('welcomefood',{msg:'user account created'});
    });

});

app.get('/userlogin',(req,res)=>{
    res.render('loginuser1');
});

app.get('/addtocartabc',(req,res)=>{
 
  Food.findOne({_id:req.query.id},(err,result)=>{
    if(err) throw err;
     else
     {
         var cart1=new Cart({
     email:req.session.userid,       
     itemid:req.query.id,
     name:result.name,
     quantity:1

  });
         cart1.save().then(data=>{
           
           Food.find((err,result)=>{
            if(err) throw err;
             else
                  res.render('welcom1',{msg:"food added to cart",dataa:result});
           });


         });
     }
  })
});

app.post('/loginuser',(req,res)=>{
    Signup.findOne({useremail:req.body.uemail,userpassword:req.body.upass},(err,result)=>{
      if(err) throw err;
       else if (result!=null) 
       { 
        req.session.userid=req.body.uemail;
         Food.find((err,result)=>{

            if(err) throw err;
             else
                  //console.log(result);
                  res.render('welcom1',{msg:"welcome"+req.session.userid,dataa:result});
           });
      
       }
       else
        res.render('loginuser1',{msg:'login failed'});

    });
});


app.get('/viewfooddetail',(req,res)=>{
  Food.findOne({_id:req.query.id},(err,result)=>{
    if(err) throw err;
     else
      res.render('fooddetail',{dataa:result});
  });
});

app.post('/fooddetailtocart',(req,res)=>{
 
     var uemail=req.session.userid;
     var addcart=new Cart({
     email:uemail,       
     itemid:req.body.id,
     name:req.body.dname,
     //image:req.body.dpic,
     quantity:req.body.fquantity
     
    });


    addcart.save().then(data=>{
      // res.send('data inserted');

        
         Food.find((err,result)=>{
             if(err) throw err;
            else
                  res.render('welcom1',{msg:"food added to cart",dataa:result});
          });


    });

});
    

app.get('/viewtocart',(req,res)=>{

      Cart.aggregate([
          {
          "$lookup":{
              from : "foods",
              localField:"itemid",
              foreignField:"_id",
              as:"data"
            },
          }
          ],(err,result)=>{
            if(err) throw err;
            
             res.render('viewcart',{data:result})
          })
    // Cart.find((err,result)=>{
    //   if(err) throw err;
    //    else
    //     res.render('viewcart',{data:result})
    // });
   
});

app.get('/homepage',(req,res)=>{
  res.render('welcomefood');
});

app.get('/logadmin',(req,res)=>{
    res.render('login');
});

app.post('/adminLog',(req,res)=>{
	//var newadmin = new admin({
    //   eid:req.body.email,
    //   pass:req.body.pass
	//});

	//newadmin.save().then(data=>{
    //   console.log("data inserted");
    //  res.send("data inserted");
	//});

      Admin.findOne({eid:req.body.email,pass:req.body.pass},(err,result)=>{
		if(err) throw err;
		 else if(result!=null)
	   {    
	   	     Food.find((err,result)=>{
	   	     	if(err) throw err;
	   	     	 else
                  res.render('welcome',{msg:"login success",dataa:result});
	   	     });
		 	
		 }
		 else
		 	res.render('login',{msg:"login failed"});
	});
});

app.get('/addfood',(req,res)=>{
   res.render('insertfood',{msg:"plzz insert food price and description!!!!"});
});
 
 app.post('/foodsubmit',(req,res)=>{
   var imgdata=req.files.fpic;
   var imgname=Math.random().toString(36).slice(-8)+imgdata.name;
        
        imgdata.mv('./public/upload/'+imgname,(err)=>{
  if(err) throw err;
    else{
    	var newFood= new Food({
     	 name: req.body.fname,
         image: imgname,
         price: req.body.fprice,
         description: req.body.fdesc
     });
    	 newFood.save().then(data=>{
     	//console.log('data inserted');
     	//res.send('data inserted');
     	Food.find((err,result)=>{
     		if(err) throw err;
     		 else
     	
          res.render('welcome',{dataa:result});
     });
 

      });
     } 
 
 });

 });     
 
 app.get('/deleteFood',(req,res)=>{
 	Food.deleteOne({_id:req.query.id},(err)=>{
 		if(err) throw err;
 		 else{
 		 	Food.find((err,result)=>{
               if(err) throw err;
                else
                	res.render('welcome',{dataa:result});
 		 	});
 		 }
 	});
 });

 app.get('/update',(req,res)=>{
    Food.findOne({_id:req.query.id},(err,result)=>{
      if(err) throw err;
       else
        res.render('update',{data:result});
    })
 });

 app.post('/updateFood',(req,res)=>{
  //console.log(req.files);
  //console.log(req.body);
  
   if(req.files){
   var imgdata=req.files.ufpic;
   var imgname=Math.random().toString(36).slice(-8)+imgdata.name;

          imgdata.mv('./public/upload/'+imgname,(err)=>{
  if(err) throw err;
    else{

    Food.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.ufname,
                                                    image:imgname,
                                                    price:req.body.ufprice,
                                                    description:req.body.ufdesc}},(err)=>{
      if(err) throw err;
       else
        {     
              Food.find((err,result)=>{
                if(err) throw err;
                  else
                res.render('welcome',{msg:"data updated",dataa:result});
              });
             
          }
      });
   }
   
  });
}

});

 app.get('/logout',(req,res)=>{
  res.render('welcomefood');
 });