'use strict';

const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

router.post('/cloudinary', (request, response) => {
  const imageData = request.body.data;
});

module.exports = router;
