'use strict';

const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

const Image = require('../model/image');

router.post('/cloudinary', (request, response, next) => {
  cloudinary.v2.uploader.upload(request.body.data,
    {tags: 'test'},
    (error, result) => {

      // Save image to database
      Image.create({ url: result.url })
        .then(results => response.json(results))
        .catch(next);
    }
  );
});

module.exports = router;
