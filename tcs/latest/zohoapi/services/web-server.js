const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');
const database = require('./database.js'); // Testing purpose added here

let server;


function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

      // Combines logging info from request and response
    //app.use(morgan('combined'));
    app.use(morgan('tiny'));
    app.use('/api', router);

     //Testing Purpose added here
     app.get('/', async (req, res) => {
      const result = await database.simpleExecute('select user, systimestamp from dual');

      const user = result.rows[0].USER;
      const date = result.rows[0].SYSTIMESTAMP;

      res.end(`DB user: ${user}\nDate: ${date}`);
    });

    server=app.listen(webServerConfig.port,(err)=>{
      if (err) {
          reject(err);
          return;
        }
        console.log(`Web server listening on localhost:${webServerConfig.port}`);
        resolve();
    });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

module.exports.close = close;
