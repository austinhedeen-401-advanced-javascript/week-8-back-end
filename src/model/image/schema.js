'use strict';

const mongoose = require('mongoose');

const image = mongoose.Schema({
  data: { type: Buffer, required: true },
  title: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('Image', image);
