'use strict';

const express = require('express');

const modelFinder = require('../middleware/model-finder');

const apiRouter = express.Router();

apiRouter.param('model', modelFinder);

/**
 * Get a list of records for a given model
 * @route GET /api/v1/:model
 * @returns {object} 200 - Count of results with an array of results
 * @returns {Error}  500 - Server error
 */
apiRouter.get('/api/v1/:model', handleGetAll);
/**
 * Get a record matching the given id.
 * @route GET /api/v1/:model/:id
 * @returns {object} 200 - The model record
 * @returns {Error}  500 - Server error
 */
apiRouter.get('/api/v1/:model/:id', handleGetOne);
/**
 * Create a record.
 * @route POST /api/v1/:model
 * @param {model} model.path.required
 * @returns {object} 200 - The created record
 * @returns {Error}  500 - Unexpected error
 */
apiRouter.post('/api/v1/:model', handlePost);
/**
 * Update the record with the matching id.
 * @route PUT /api/v1/:model/:id
 * @returns {object} 200 - The updated record
 * @returns {Error}  500 - Server error
 */
apiRouter.put('/api/v1/:model/:id', handlePut);
/**
 * Delete the record matching the id.
 * @route DELETE /api/v1/:model/:id
 * @returns {object} 200 - The deleted record
 * @returns {Error}  500 - Server error
 */
apiRouter.delete('/api/v1/:model/:id', handleDelete);


// Route Handlers

function handleGetAll(request, response, next) {
  request.model.get()
    .then(results => response.json(results))
    .catch(next);
}

function handleGetOne(request, response, next) {
  const id = request.params.id;
  request.model.get(id)
    .then(results => response.json(results[0]))
    .catch(next);
}

function handlePost(request, response, next) {
  const data = request.body;
  request.model.create(data)
    .then(results => response.json(results))
    .catch(next);
}

function handlePut(request, response, next) {
  const id = request.params.id;
  const data = request.data;
  request.model.update(id, data)
    .then(results => response.json(results))
    .catch(next);
}

function handleDelete(request, response, next) {
  const id = request.params.id;
  request.model.delete(id)
    .then(results => response.json(results))
    .catch(next);
}

module.exports = apiRouter;
