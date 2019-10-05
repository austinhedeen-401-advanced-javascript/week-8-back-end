'use strict';

/**
 * Middleware function to inject a model into the request object.
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
  const modelName = req.params.model;
  req.model = require(`../model/${modelName}`);
  next();
};
