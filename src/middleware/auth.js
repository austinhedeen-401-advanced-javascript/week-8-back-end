'use strict';
/**
 * @module
 */

const User = require('../model/user/schema');

/**
 * Returns a middleware function that authenticates a user if their role
 * includes the given capability.
 * @param capability
 * @returns {Function} The authentication middleware function
 */
module.exports = (capability) => {
  return (req, res, next) => {
    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      // TODO - Look into ESLint rules for switch/case indentation
      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }
    } catch(e) {
      _authError(e);
    }

    /**
     * Authenticates a user using a basic auth string.
     * @param authString
     * @returns {Promise}
     * @private
     */
    function _authBasic(authString) {
      const base64Buffer = Buffer.from(authString, 'base64');
      const bufferString = base64Buffer.toString();
      const [username, password] = bufferString.split(':');
      const auth = { username, password };

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     * Authenticates a user using a bearer auth string.
     * @param authString
     * @returns {Promise}
     * @private
     */
    function _authBearer(authString) {
      return User.authenticateToken(authString)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     * Injects the user and token into the request if they have the given capability.
     * @param user
     * @private
     */
    function _authenticate(user) {
      if (user && (!capability || user.can(capability))) {
        req.user = user;
        req.token = user.generateToken();
        next();
      } else {
        _authError();
      }
    }

    /**
     * Calls error middleware if authentication fails.
     * @param error
     * @private
     */
    function _authError(error) {
      // TODO - This may need to pass an error object
      next('Authentication Error');
    }
  };
};
