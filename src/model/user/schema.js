'use strict';
/**
 * @module
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');


const SINGLE_USE_TOKENS = process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '30m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();

// TODO - After MVP, update schema to fit expected user roles
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
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
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

/**
 * Given an email, returns a user, creating one if needed.
 * @param email
 * @returns {Promise<User>}
 */
userSchema.statics.createFromOauth = function(email) {
  if (!email) {
    return Promise.reject('Validation Error');
  }

  return this.findOne({ email })
    .then(user => {
      if (!user) {
        throw new Error('User Not Found');
      }
      return user;
    })
    .catch(error => {
      let username = email;
      // TODO - This seems like a bad idea
      let password = 'none';
      return this.create({ username, password, email });
    });
};

/**
 * Authenticates a user using a bearer token.
 * @param token
 * @returns {Query} - The User, if authentication successful
 */
userSchema.statics.authenticateToken = function(token) {
  if (usedTokens.has(token)) {
    return Promise.reject('Invalid Token');
  }

  try {
    let parsedToken = jwt.verify(token, SECRET);

    if (SINGLE_USE_TOKENS && parsedToken.type !== 'key') {
      usedTokens.add(token);
    }

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
userSchema.statics.authenticateBasic = function(auth) {
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
userSchema.methods.comparePassword = function(password) {
  return compare(password, this.password)
    .then(valid => valid ? this : null);
};

/**
 * Generates a token for this user.
 * @returns {string} - The generated token
 */
userSchema.methods.generateToken = function(type) {
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };

  let options = {};
  if (type !== 'key' && TOKEN_EXPIRE) {
    options = { expiresIn: TOKEN_EXPIRE };
  }

  return jwt.sign(token, SECRET, options);
};

/**
 * Returns true if this user has the given capability.
 * @param capability
 * @returns {boolean}
 */
userSchema.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

/**
 * Generates a token key.
 * @returns {string} Key
 */
userSchema.methods.generateKey = function() {
  return this.generateToken('key');
};


module.exports = mongoose.model('User', userSchema);
