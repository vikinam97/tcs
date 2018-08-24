const oracledb=require('oracledb');
var update="update taskdet set STATUS= :STATUS,CMPPRNT= :CMPPRNT,WRKHOUR= :WRKHOUR,WRKMINS= :WRKMINS,CMPLDTM= :CMPLDTM where TASKID= :TASKID ";
oracledb.getConnection({
  user: "trandata",
  password: "centra123",
  connectString: "172.16.0.36:1521/tcstest"
},(err,connection)=>{
  if(err) throw err;
  var upobj={"tasks":[]};
  var obj={
          'STATUS':'1',
          'CMPPRNT':'1',
          'TASKID' :'1'
        };
        //var wrk=tasks.tasks[i].work;
        //var wrkarr=wrk.split(":");
        // console.log(wrkarr[0]);
        obj['WRKHOUR']='1';
        obj['WRKMINS']='1';
        if(1)
        {
          obj['CMPLDTM']='1';
        }
        else{
          obj['CMPLDTM']='';
        }
        upobj['tasks'].push(obj);
        console.log(upobj.tasks[0])
  connection.execute(update,upobj.tasks[0],(err,result)=>{
    if(err) throw err;
    console.log(result);
  });
//console.log("successfully connected");
});
