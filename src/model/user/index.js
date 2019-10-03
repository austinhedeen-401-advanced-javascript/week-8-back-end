'use strict';

const schema = require('./schema');
const Model = require('../mongoose-model');

class User extends Model {}

module.exports = new User(schema);
