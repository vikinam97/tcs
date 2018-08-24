var request = require("request");
var afs=require('await-fs');
var fs=require('fs');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var promise =require('es6-promise');
var flatten = require('array-flatten');
var formatted = dt.format('Y-m-d H:M:S');
async function getProjects()
{
  try
  {
    var body;
    body=await afs.readFile('access_token.json');
    body=JSON.parse(body);
    //console.log(body.access_token);
    var jbody={'projects':[]};
    var data1=await projfiler(0,100,body);
    jbody.projects.push(data1);
    var data2=await projfiler(101,200,body);
    jbody.projects.push(data2);
    jbody.projects=flatten.depth(jbody.projects,2);
    await filewriter(jbody);
    // body=await afs.readFile('projects.json');
    // body=JSON.parse(body);
    // //body.projects=flatten.depth(body.projects,2);
    // console.log(Object.keys(body.projects).length);
  }
  catch(e)
  {
    console.log(e);
  }
}
//prject filer========
function projfiler(ind,rng,body)
{   return new promise(async (resolve)=>
    {    console.log("===========fetching projects ============================")
        console.log(ind+" "+rng+" "+body.access_token);
        //accessing the projects from the access token
        if(body.access_token!=null)
        {
          var options =
          { method: 'GET',
            url: "https://projectsapi.zoho.com/restapi/portal/475030530/projects/?index="+ind+"&range="+rng,
            headers:
             { authorization: 'Zoho-oauthtoken '+body.access_token}
          };

          request(options, function (error, response, body)
          {
            if (error) throw new Error(error);
            let jbody=JSON.parse(body);
            //console.log(jbody);
            if(jbody.projects!=null)
            {
              resolve(jbody.projects);
              //console.log(jbody);
            }
            else
            {
              var error_data=
              { time:formatted,
                body:body
              };
              fs.appendFile('error_log.json',JSON.stringify(error_data), function (err)
              {   if (err) throw err;
                  resolve('Error!  code=> '+jbody.error);
              });
            }
          });
        }
    });
}
function filewriter(jbody)
{
  return new promise((resolve)=>{
    fs.writeFile('projects.json',JSON.stringify(jbody), function (err)
       {   if (err) throw err;
          console.log('Saved!');
       });
  });
}
function clearfile(){
  return new promise((resolve)=>{
    fs.writeFile('projects.json',' ',function (err)
       {   if (err) throw err;
          resolve('Saved!');
       });
  });
}
//clearfile();
//getProjects();
module.exports.clearfile=clearfile;
module.exports.getProjects=getProjects;
