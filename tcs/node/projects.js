var request = require("request");
var fs=require('fs');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
function getProjects()
{
  fs.readFile('access_token.json', function(err, data)
  {   body=JSON.parse(data);
      console.log(body.access_token);
      //accessing the projects from the access token
      if(body.access_token!=null)
      {
        var options =
        { method: 'GET',
          url: 'https://projectsapi.zoho.com/restapi/portal/475030530/projects/',
          headers:
           { authorization: 'Zoho-oauthtoken '+body.access_token}
        };
        request(options, function (error, response, body)
        {
          if (error) throw new Error(error);
          jbody=JSON.parse(body);
          if(jbody.projects!=null)
          {
            fs.writeFile('projects.json',body, function (err)
               {   if (err) throw err;
                  console.log('Saved!');
               });
            //console.log(jbody);
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
module.exports.getProjects=getProjects();
