'use strict';
/**
 * @module
 */

const express = require('express');

const cors = require('cors');
const morgan = require('morgan');

const notFound = require('./middleware/404');
const errorHandler = require('./middleware/500');

const apiRouter = require('./route/api');
const authRouter = require('./route/auth');
const imageRouter = require('./route/cloudinary');

const app = express();

// Application-Level Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Static Routes
app.use('/docs', express.static('docs'));

// Routes
app.use(apiRouter);
app.use(authRouter);
app.use(imageRouter);

app.get('/', (request, response) => {
  response.send('Week 8 Project API Server');
});

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  /**
   * Start server on the specified port.
   * @param {number} port
   */
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  },
};
