const mongodb=require('mongodb');
var URL="mongodb://localhost:27017/EMSDB";
mongodb.connect(URL,(err,con)=>{
	if(err)throw err;
	else console.log("MongoDB Connected..");
	var dbo=con.db();

//	var newObj=[{eid:103,ename:'pavan',salary:2000},
//	{eid:104,ename:'bharat',salary:2000},
	//{eid:105,ename:'kajal',salary:2000}];

	//dbo.collection('employee').insertMany(newObj,(err)=>{
	//	if(err)throw err;
	//	else 
	//		console.log("Document inserted..");
	//});

	dbo.collection('employee').find().toArray((err,result)=>{
		if(err)throw err;
		else 
			console.log(result);
	});
});
module.exports=mongodb;