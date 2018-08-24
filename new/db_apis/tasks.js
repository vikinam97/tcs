const database = require('../services/database.js');



async function get(context)
{
  var query="select * from taskdet where taskid= :taskid";
  console.log(query);
  const result = await database.simpleExecute(query,context);
  //console.log(result);, APPRTNG= :RATING, APPRTNG= :RATING
  return result.rows;
}
async function approve(context)
{ console.log(context);
  var query="update taskdet set APPSTAT= :STATUS,APPRTNG= :RATING,APPDTM= :DATE1 WHERE TASKID= :TASKID";
  console.log(query);
  const result = await database.simpleExecute(query,context);
  return result;
}
async function multi(context)
 {
   try
   {
     console.log(context);
	 var date = new Date();
	 var timestamp = date.getTime();

     var query="update taskdet set APPSTAT= :STATUS,APPRTNG= :RATING,APPDTM= :DATE1 WHERE TASKID= :TASKID";
     console.log(query);
     //console.log()
     const result = await database.multiExecute(query,context);
     return result;
   }catch(e)
   {
      console.log(e);
   }

}

async function getempTask(context,approvedStatus)
{ console.log(context);
  var query=""
  if(approvedStatus=="-1")
	query="select * from taskdet where OWNNAME= :name order by taskid desc";
  else if(approvedStatus=="0")
	query="select * from taskdet where OWNNAME= :name AND APPSTAT is null order by taskid desc";
  else
	 query="select * from taskdet where OWNNAME= :name AND APPSTAT= :approvedStatus order by taskid desc";
  console.log(query);
  const result = await database.simpleExecute(query,context);
  return result;
}

async function getprojects(context)
{ console.log(context);
  var query="select Distinct PRJCTID,PRJTNAM from taskdet where OWNNAME= :name order by PRJCTID desc";
  console.log(query);
  const result = await database.simpleExecute(query,context);
  return result;
}

async function getprojecttasks(context,approvedStatus)
{ console.log(context);
  var query=""
  if(approvedStatus=="-1")
	query="select * from taskdet where PRJCTID=:projectid AND OWNNAME= :name order by taskid desc";
  else if(approvedStatus=="0")
	query="select * from taskdet where PRJCTID=:projectid AND OWNNAME= :name AND APPSTAT is null order by taskid desc";
  else
	 query="select * from taskdet where PRJCTID=:projectid AND OWNNAME= :name AND APPSTAT= :approvedStatus order by taskid desc";
  console.log(query);
  const result = await database.simpleExecute(query,context);
  return result;
}

async function login(context,ascArray)
{ console.log(context);
  var sqlString='';
  for(var i=0;i<ascArray.length;i++)
  {
    if(i!=0 && i!=(ascArray.length))
      sqlString = sqlString+'||';
      sqlString = sqlString + 'chr('+ascArray[i]+')';
  }
  var query="select USRCODE,USRNAME,USRPASS FROM USERID where USRCODE= :USRCODE AND USRPASS="+sqlString;
  //console.log(query);
  const result = await database.simpleExecute(query,context);
  return result;
}

module.exports.getempTask=getempTask;
module.exports.get = get;
module.exports.approve=approve;
module.exports.multi=multi;
module.exports.getprojects = getprojects;
module.exports.getprojecttasks = getprojecttasks;
module.exports.login = login;
