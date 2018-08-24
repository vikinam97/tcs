var request = require("request");
var fs=require('fs');
var dateTime = require('node-datetime');
const promise=require('es6-promise');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

var stop='false';
var projectTaskCount=0;

function getTasks()
{
  fs.readFile('access_token.json', function(err, data)
  {   if (err) throw err;
      body=JSON.parse(data);
      //console.log(body.access_token);
      //accessing the projects from the access token
      if(body.access_token!=null)
      {
          var options = { method: 'GET',
            url: 'https://projectsapi.zoho.com/restapi/portal/475030530/projects/923846000003727415/tasks/',
            qs: { time: 'all' },
            headers:
             { authorization: 'Zoho-oauthtoken '+body.access_token }
           };
          request(options, function (error, response, body)
          {
            if (error) throw new Error(error);
            jbody=JSON.parse(body);
            if(jbody.tasks!=null && Object.keys(jbody.tasks).length!=0)
            {
              fs.writeFile('tasks.json',body, function (err)
                 {   if (err) throw err;
                    console.log('Saved!');
                 });
              console.log(jbody);
            }
            else
            { var error_data=
              { time:formatted,
                body:body
              };

              fs.appendFile('error_log.json',JSON.stringify(error_data), function (err)
              {   if (err) throw err;
                  console.log('Error!  code=> '+jbody.error);
              });
            }
          });
        }
  });
}
function getTasksbyPrjct(prjctid,ind,rng)
{
  return new promise(resolve=>{
    fs.readFile('access_token.json', function(err, data)
    {   if (err) throw err;
        body=JSON.parse(data);
        //console.log(body.access_token);
        //accessing the projects from the access token
        if(body.access_token!=null)
        {
            var options = { method: 'GET',
              url: "https://projectsapi.zoho.com/restapi/portal/475030530/projects/"+prjctid+"/tasks/?index="+ind+"&range="+rng,
              qs: { time: 'all' },
              headers:
               { authorization: 'Zoho-oauthtoken '+body.access_token }
             };
            request(options, function (error, response, body)
            {
              if(body!='')
              {
                if (error) throw new Error(error);
                jbody=JSON.parse(body);
                projectTaskCount=Object.keys(jbody.tasks).length;
                console.log(projectTaskCount);
                if(jbody.tasks!=null)
                {
                  fs.writeFile('tasks.json',body, function (err)
                     {   if (err) throw err;
                        resolve('Saved!');
                     });
                  //console.log(jbody);
                  //var len=Object.keys(jbody.tasks).length;
                  //console.log(len);
                }
                else
                { var error_data=
                  { time:formatted,
                    body:body
                  };
                  fs.appendFile('error_log.json',JSON.stringify(error_data), function (err)
                  {   if (err) throw err;
                      resolve('Error!  code=> '+jbody.error);
                  });
                }
              }
              else
              {
                stop='true';
                resolve(stop);
              }
            });
          }
    });
  });
}

module.exports.getTasksbyPrjct=getTasksbyPrjct;
module.exports.getTasks=getTasks;
//module.exports.stop=stop;
