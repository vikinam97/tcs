var request=require('request');
var express=require('express');
console.log("hi this is viki");

var app= express();

app.get('/',(req,res)=>{
  res.end('done checking');
  console.log("hi");
});
app.listen(5000,(err)=>{
	if(err){
console.log("error");}
  console.log("server stated");
});
