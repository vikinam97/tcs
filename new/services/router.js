const express = require('express');
const router = new express.Router();
const tasks = require('../controllers/tasks.js');

router.route('/taskid/:id?/:token?')
      .get(tasks.get);

router.route('/approve/:id?/:token?')
      .post(tasks.get);

router.route('/getempTask/:name?/:approvedStatus?/:token?')
      .get(tasks.getempTask);

router.route('/approvemulti/:token?')
      .post(tasks.multi);

router.route('/projects/:name?/:token?')
      .get(tasks.getprojects);

router.route('/projecttasks/:projectid?/:name?/:approvedStatus?/:token?')
  .get(tasks.getprojecttasks);

 router.route('/login/:usercode?/:userpass?')
  .get(tasks.login);

module.exports = router;
