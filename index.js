'use strict';

require('dotenv');

// Connect to database
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start API server
require('./src/app').start(process.env.PORT);
