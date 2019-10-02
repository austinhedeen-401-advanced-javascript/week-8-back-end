'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const server = require('./src/app');

// Connect to database
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start API server
server.start(process.env.PORT);
