'use strict';

const schema = require('./schema');
const Model = require('../mongoose-model');

class Todo extends Model {}

module.exports = new Todo(schema);
