'use strict';

const express = require('express');

const auth = require('../middleware/auth');
const User = require('../model/user/schema');

const router = express.Router();

/**
 * TODO - Document /signup route
 */
router.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then(user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

/**
 * TODO - Document /signin route
 */
router.post('/signin', auth(), (req, res, next) => {
  res.set('token', req.token);
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = router;
