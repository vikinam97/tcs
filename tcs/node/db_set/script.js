const oracledb=require('oracledb');
const fs=require('await-fs');
var flatten = require('array-flatten');
const promise=require('es6-promise');
var select="select taskid from taskdet";
let taskid;
var len;
function unique(prjctid,prjctname)
{ console.log("Getting Database Connection");
  return new promise(async resolve=>{
  try
  {
    conn=await oracledb.getConnection(
      {
           user: "trandata",
           password: "centra123",
           connectString: "172.16.0.36:1521/tcstest"
      });
      taskid=await conn.execute(select);
      //console.log(taskid.rows[0]);
      result=await fs.readFile('tasks.json');
      tasks=JSON.parse(result);
      var uniqueId={"tasks":[]};
      taskid.rows=flatten.depth(taskid.rows,2);
      flen=Object.keys(tasks.tasks).length;
      dblen=Object.keys(taskid.rows).length;
      console.log("current entries => "+flen);
      console.log("IN db => "+dblen);
      var inobj={"tasks":[]};
      var upobj={"tasks":[]};
      //console.log("Initializing Data Updation");
      for(var i=0;i<flen;i++)
      {
        if(!taskid.rows.includes(tasks.tasks[i].id_string))
        {
            var obj={
              'TASKID' :tasks.tasks[i].id_string,
              'TASKNAM':tasks.tasks[i].name,
              'PRJCTID':prjctid,
              'PRJTNAM':prjctname,
              'MILSTID':tasks.tasks[i].milestone_id,
              'TSKLTID':tasks.tasks[i].tasklist.id,
              'TSKLTNM':tasks.tasks[i].tasklist.name,
              'PRIORITY':tasks.tasks[i].priority,
              'STRTDTM':tasks.tasks[i].start_date_format,
              'ENDDTM':tasks.tasks[i].end_date_format,
              //'CMPLDTM':tsklist[0].id_string,
              'OWNNAME':tasks.tasks[i].details.owners[0].name,
              'OWNUSID':tasks.tasks[i].details.owners[0].id,
              'STATUS':tasks.tasks[i].status.name,
              'CMPPRNT':tasks.tasks[i].percent_complete,
              //'WRKHOUR':tsklist[0].id_string,
              'CERTDTM':tasks.tasks[i].created_time_format,
              //'WRKMINS':tsklist[0].id_string,
              'APPSTAT':'',
              'APPRTNG':'',
              'APPDTM':''
            };
            if(tasks.tasks[i].completed!=null)
            {
              obj['CMPLDTM']=tasks.tasks[i].completed_time_format;
            }
            else{
              obj['CMPLDTM']='';
            }
            var wrk=tasks.tasks[i].work;
            var wrkarr=wrk.split(":");
            // console.log(wrkarr[0]);
            obj['WRKHOUR']=wrkarr[0];
            obj['WRKMINS']=wrkarr[1];
            // console.log(obj['WRKHOUR'].length);
            inobj['tasks'].push(obj);
        }else {
              var obj={
                 'STATUS':tasks.tasks[i].status.name,
                 'CMPPRNT':tasks.tasks[i].percent_complete,
                 'TASKID' :tasks.tasks[i].id_string
               };
               var wrk=tasks.tasks[i].work;
               var wrkarr=wrk.split(":");
               obj['WRKHOUR']=wrkarr[0];
               obj['WRKMINS']=wrkarr[1];
               if(tasks.tasks[i].completed!=null)
               {
                 obj['CMPLDTM']=tasks.tasks[i].completed_time_format;
               }
               else{
                 obj['CMPLDTM']='';
               }
               upobj['tasks'].push(obj);
        }
      }
      console.log("New Records => "+Object.keys(inobj.tasks).length);
      console.log("Records To Update => "+Object.keys(upobj.tasks).length);

      //console.log();
      //console.log();


      if(Object.keys(inobj.tasks).length>0)
      {
        var query="insert into taskdet values(:TASKID,:TASKNAM,:PRJCTID,:PRJTNAM,:MILSTID,:TSKLTID,:TSKLTNM,"+
        ":PRIORITY,:STRTDTM,:ENDDTM,:CMPLDTM,:OWNNAME,:OWNUSID,:STATUS,:CMPPRNT,:CERTDTM,:WRKHOUR,:WRKMINS,:APPSTAT,:APPRTNG,:APPDTM)";
        run(query,inobj);
      }
      if(Object.keys(upobj.tasks).length>0)
      {
        var uquery="update taskdet set STATUS= :STATUS,CMPPRNT= :CMPPRNT,WRKHOUR= :WRKHOUR,WRKMINS= :WRKMINS,CMPLDTM= :CMPLDTM where TASKID= :TASKID ";
        run(uquery,upobj);
      }
      fs.writeFile('tasks.json',JSON.stringify({"tasks":[]}), function (err)
         {   if (err) throw err;
            console.log('Saved!');
         });
      resolve("=====================Data Updation Successfull==================================");

  }
  catch(e)
  {   resolve(
      {
          "error":e
      });
  }
  });

}





async function run(query, inobj) {
  let conn;
  let result;

  try {
    conn = await oracledb.getConnection({
     user: "trandata",
     password: "centra123",
     connectString: "172.16.0.36:1521/tcstest"
});
    result = await conn.executeMany(query, inobj.tasks, {autoCommit: true});
    console.log("Result is:", result);
    conn.commit
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

function doRelease(connection) {
     connection.release(
          function(err) {
               if (err) {console.error(err.message);}
          }
     );
}

module.exports.unique=unique;
