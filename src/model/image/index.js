'use strict';

const schema = require('./schema');
const Model = require('../mongoose-model');

class Image extends Model {}

module.exports = new Image(schema);
