'use strict';

const mongoose = require('mongoose');

const todo = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Todo', todo);
