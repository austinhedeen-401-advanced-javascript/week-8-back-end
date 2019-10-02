'use strict';
/**
 * @module
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const SECRET = process.env.SECRET || 'foobar';

const user = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['admin', 'editor', 'user'] },
});

const capabilities = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

/**
 * This hook triggers before a User is saved to hash the plaintext password for storage.
 */
user.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

/**
 * Authenticates a user using a bearer token.
 * @param token
 * @returns {Query} - The User, if authentication successful
 */
user.statics.authenticateToken = function(token) {
  try {
    let parsedToken = jwt.verify(token, SECRET);
    let query = { _id: parsedToken.id };
    return this.findOne(query);
  } catch (e) {
    throw new Error('Invalid Token');
  }
};

/**
 * Authenticates a user using a username and password.
 * @param auth - An object containing a username and password
 * @returns {Promise} - A user, if authentication successful
 */
user.statics.authenticateBasic = function(auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password));
};

/**
 * Compares a password to the hashed password stored with this User, and if so,
 * returns the user.
 * @param password
 * @returns {Promise} - The user, if the password matches
 */
user.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

/**
 * Generates a token for this user.
 * @returns {string} - The generated token
 */
user.methods.generateToken = function() {
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
  };

  return jwt.sign(token, SECRET);
};

/**
 * Returns true if this user has the given capability.
 * @param capability
 * @returns {boolean}
 */
user.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

module.exports = mongoose.model('User', user);
