var request = require("request");
var fs=require('fs');
var beautify=require('json-beautify');
var dateTime = require('node-datetime');
const promise=require('es6-promise');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

function refreshAccessToken()
{ return new promise(resolve=>
  {
      var options = { method: 'POST',
        url: 'https://accounts.zoho.com/oauth/v2/token',
        qs:
         { refresh_token: '1000.22bc8f3d291467ec93ace7cbee87f549.e8aa0d4fcc92447ebaa3b4bf0a8f56f7',
           client_id: '1000.PQXB4S3PELGM90257EY9FH7IEDECF3',
           client_secret: '68e8bb317676b56a004cd40a759fe131ea866c00c5',
           grant_type: 'refresh_token' },
         };

        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
        var jbody=JSON.parse(body);
        if(jbody.access_token!=null)
        {
          fs.writeFile('access_token.json',body, function (err)
          {   if (err) throw err;
              resolve('Saved!');
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
              resolve('Error!  code=> '+jbody.error.message);
          });
        }
      });
  });
}

module.exports.AccessToken=refreshAccessToken;
