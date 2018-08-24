var request = require("request");
var fs=require('fs');
var beautify=require('json-beautify');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

var options =
{ method: 'POST',
  url: 'https://accounts.zoho.com/oauth/v2/token',
  qs:
   { 'code': '1000.ead04ca65ba7a851c38f23cf566621d0.97339728e626512c09f916277288bd40',
     'redirect_uri': 'http://portal.thechennaisilks.com/zoho_response.php',
     'client_id': '1000.PQXB4S3PELGM90257EY9FH7IEDECF3',
     'client_secret': '68e8bb317676b56a004cd40a759fe131ea866c00c5',
     'grant_type': 'authorization_code' },
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  //console.log(body);
  var jbody=JSON.parse(body);
  if(jbody.access_token!=null)
  {
    fs.writeFile('access_token.json',body, function (err)
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
