var request = require("request");
var promise=require('es6-promise');
var fs=require('fs');
var afs=require('await-fs');
var flatten=require('array-flatten');
const refresh=require("./refresh_token");
const config=require("./config");
const oracledb=require('oracledb');



var stop='false';
var filebody={'users':[]};
var access_token='';



function json_dump(ind,rng){
    return new promise((resolve)=>
    {
      var options = { method: 'GET',
        url: 'https://projectsapi.zoho.com/restapi/portal/475030530/users/',
        qs: { usertype: 'all', index: ind, range: rng },
        headers:
         { 'postman-token': '09de9bb1-061a-20b6-0327-334f93e8a3ab',
           'cache-control': 'no-cache',
           authorization: 'Zoho-oauthtoken '+access_token } };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
        if(body!='')
        {

          var jbody=JSON.parse(body);
          filebody.users.push(jbody.users);
          filebody.users=flatten.depth(filebody.users,2);
          console.log("-------------completed------------");
          var flen=Object.keys(filebody.users).length;
          console.log("users found  => "+flen);

          flen=Object.keys(jbody.users).length;
          //console.log("url body => "+flen);
          resolve();
        }
        else
        {
          stop='true';
          resolve();
        }
        //file_write();
      });
    });
}
function file_write()
{ return new promise((resolve)=>
  {
    fs.writeFile('users.json',JSON.stringify(filebody),(err)=>{
      if (err) throw err;
      console.log("==============File written successfully=====================");
      resolve();
    });
  });
}

function iterator()
{ return new promise(async (resolve)=>
  { var i=1;
    var j=100;
    while(stop!='true')
    {
      //console.log('-----------');
      //console.log(i);
      //console.log(j);
      await json_dump(i,j);
      i=j+1;
      j=j+100;
      // if(i>=1000)
      // {
      //   stop='true';
      // }
    }
    await file_write();
    resolve();
  });
}
async function write_db()
{
    var conn=await oracledb.getConnection(config.db);
    //console.log(conn);
    var flen=Object.keys(filebody.users).length;
    //console.log(flen);
    result = await conn.execute("select usrid from zoho_user where rownum<=643 ");
    result.rows=flatten.depth(result.rows,2);
    var db_user={'user':[]};
    for(var i=0;i<flen;i++)
    { if(!result.rows.includes(filebody.users[i].id))
      {    var temp={
            'userid' : filebody.users[i].id,
            'email' : filebody.users[i].email,
            'name' : filebody.users[i].name,
            'empsrno' : 0
          };
          db_user.user.push(temp);
      }
    }
    console.log("new records " +Object.keys(db_user.user).length);
    var query="insert into zoho_user values(:userid,:email,:name,:empsrno)";
    if(Object.keys(db_user.user).length>0)
    {
      result = await conn.executeMany(query,db_user.user, {autoCommit: true});
      console.log(result);
    }

}

async function main()
{ console.log("===================Refreshing the Access Token =============== ");
  console.log(await refresh.AccessToken());
  data= await afs.readFile('access_token.json');
  body=JSON.parse(data);
  access_token=body.access_token;
  console.log("===================     fetching the users     =============== ");
  await iterator();
      write_db();
}
main();
