const tasks = require('../db_apis/tasks.js');
const ignorecase=require('ignore-case');
const promise=require('es6-promise');
const fs=require('fs');
const webServerConfig = require('../config/web-server.js');
const equals=require('array-equal');
const jwt=require('jsonwebtoken');

var strpass;
var pass='';
var k=50;
var len;
var tarr=[];

async function get(req, res, next)
{
  token=req.params.token;
  verify_token(token).then(async (username)=>
  {
      console.log(username);
      try{
            var context ={
              'TASKID' : req.params.id
            };
            url=req.url;
            var from=url.split('/');

            if(ignorecase.equals(from[1],'taskid'))
            {
                const rows=await tasks.get(context);

                if(Object.keys(rows).length !=0)
                {
                    res.status(200).send(rows[0]);
                    next();
                }
                else{
                  res.send({
                    'error':"RESOURCE NOT FOUND"
                  });
                  next();
                }
            }
            else if (ignorecase.equals(from[1],'approve'))
            {
                if(req.query.status!=null&&req.query.rating!=null&&req.query.date)
                {
                  context['STATUS']=req.query.status;
                  context['RATING']=req.query.rating;
                  context['DATE1']=req.query.date;
                  const result=await tasks.approve(context);
                  console.log(result);
                  res.status(200).send(result);
                  next();
                }
                else {
                  res.send({
                    'error':"INSUFFIENT DATA"
                  });
                  next();
                }

            }
      }
      catch(e){
          console.log(e);
      }
      next();
  }).catch((error)=>{
    res.send({
      'error':"INVAILD TOKEN"
    });
  });
  //console.log(token);

}
async function multi(req, res, next)
{
  token=req.params.token;
  verify_token(token).then(async (username)=>
  {
      try{
        var context = "";
        context=await getbody(req);
        //console.log(context);
        const result=await tasks.multi(context);
        console.log(result);
        res.status(200).send(result);
        next();
      }
      catch(e){
          console.log(e);
          next();
      }
  }).catch((error)=>{
    res.send({
      'error':"INVAILD TOKEN"
    });
  });

}

async function getempTask(req, res, next)
{
  token=req.params.token;
  verify_token(token).then(async (username)=>
  {
          var context ={
            'name' : req.params.name
          };
      	console.log(req.params.approvedStatus);
      	if(req.params.approvedStatus!='-1' && req.params.approvedStatus!='0')
      		context['approvedStatus']= req.params.approvedStatus;
          const result=await tasks.getempTask(context,req.params.approvedStatus);
          if(result.rows!=null)
          {
            console.log(result);
            res.status(200).send(result.rows);
          }
          else {
              res.status(200).send({
                'error':"RESOURCE NOT FOUND"
              });
          }
          next();
    }).catch((error)=>{
      res.send({
        'error':"INVAILD TOKEN"
      });
    });
}
async function getprojects(req, res, next)
{
  token=req.params.token;
  verify_token(token).then(async (username)=>
  {
    	 var context ={
          'name' : req.params.name
        };
    	const result=await tasks.getprojects(context);

    	if(result.rows!=null)
        {
          console.log(result);
          res.status(200).send(result.rows);
        }
        else {
            res.status(200).send({
              'error':"RESOURCE NOT FOUND"
            });
        }

        next();
  }).catch((error)=>{
    res.send({
      'error':"INVAILD TOKEN"
    });
  });
}

async function getprojecttasks(req, res, next)
{
  token=req.params.token;
  verify_token(token).then(async (username)=>
  {
          var context ={
            'name' : req.params.name,
      	  'projectid': req.params.projectid
          };
      	console.log(req.params.approvedStatus);

      	if(req.params.approvedStatus!='-1' && req.params.approvedStatus!='0')
      		context['approvedStatus']= req.params.approvedStatus;
          const result=await tasks.getprojecttasks(context,req.params.approvedStatus);
          if(result.rows!=null)
          {
            console.log(result);
            res.status(200).send(result.rows);
          }
          else {
              res.status(200).send({
                'error':"RESOURCE NOT FOUND"
              });
          }

          next();
  }).catch((error)=>{
    res.send({
      'error':"INVAILD TOKEN"
    });
  });
}

async function login(req, res, next)
{
    var context ={
      'USRCODE' : req.params.usercode
    };
    var token={
    };

	strpass= req.params.userpass.split('');
	len = strpass.length;
	for (var i = 0; i < len; i++) {
		await getpass(i);
	}
	console.log(pass.split(''));

    const result=await tasks.login(context,tarr);
    if(result.rows!=null)
    {
      token['token']=await generate_token(context);
      //console.log(token);
      res.status(200).send(token);
    }
    else {
        res.status(200).send({
          'error':"USER NOT FOUND"
        });
    }
    tarr=[];k=50;
    next();
}

function getpass(i)
{	return new promise(resolve=>{
			var j =strpass[i].charCodeAt();
			j = j+k;
			if(j>=255) {j=j-200;}

      tarr.push(j);
			//pass=pass+String.fromCharCode(j);
      k=k+15;
			resolve();
	});

}

function getbody(req)
{ return new promise((resolve)=>
  {     var body='';
        req.on('data', function (chunk)
        {
          body += chunk;
        });t
        req.on('end', function ()
        {
          var jbody = JSON.parse(body);
          resolve(jbody);
        })
  });
}


function generate_token(context)
{ return new promise((resolve)=>
  {
        resolve( jwt.sign(context,webServerConfig.clientsecret,{algorithm : 'HS512', expiresIn: 60*60}));
  }).catch((err)=>{
    console.log(err);
  });
}

function verify_token(token)
{
  return new promise((resolve,reject)=>
  {
    var ver=jwt.verify(token,webServerConfig.clientsecret,(err,decoded)=>
    {
      if (err){
          console.log("invalid token");
          reject("invalid token");
      }
      else{
        resolve(decoded.USRCODE);
      }
    });
  });
}
module.exports.multi = multi;
module.exports.get = get;
module.exports.getempTask = getempTask;
module.exports.getprojects = getprojects;
module.exports.getprojecttasks = getprojecttasks;
module.exports.login = login;
module.exports.verify=verify_token;
