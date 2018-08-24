var fs=require('fs');
var express=require('express');
var oracledb=require('oracledb');
var blob=require('blobutil');
var dbp={'photo':[]};
// oracledb.getConnection({
//      user: "trandata",
//      password: "centra123",
//      connectString: "172.16.0.36:1521/tcstest"
// },(error,connection)=>{
//   if(error) throw error;
//   connection.execute("select empphot,empsrno from employee_personal where rownum<=5",(error,result)=>
//   { if(error) throw error;
//     for(var i=0;i<result.rows.length;i++)
//     {
//       dbp.photo.push(result.rows[0][0]);
//       //console.log(JSON.stringify(result.rows[0][0]).toString('base64'));
//       fs.writeFile('dbpics.json',JSON.stringify(dbp),(err)=>{
//         console.log("written to file");
//       });
//     }
//   });
// });
var app=express();
app.get('/pic',(req,res)=>{
  oracledb.getConnection({
       user: "trandata",
       password: "centra123",
       connectString: "172.16.0.36:1521/tcstest"
  },(error,connection)=>{
    if(error) throw error;
    connection.execute("select empphot from employee_personal where rownum<=5",(error,result)=>
    { if(error) throw error;
      res.contentType('image/jpeg');
      blob.blobToBinaryString(result.rows[0]).then(function (binaryString)
      {
        res.send(binaryString);
        res.end();
      }).catch((e)=>{
        console.log("error"+e);
      });
      // res.sendFile(JSON.stringify(result.rows[0]).toString('base64'));
      // res.end();
    });
  });
});
app.listen(3000,(err)=>{
  if(err) throw err;
  console.log("started");
});
