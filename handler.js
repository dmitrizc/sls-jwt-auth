'use strict';

const { authorizeHandler } = require('./src/handlers/authorize');
const { loginHandler, refreshHandler } = require('./src/handlers/auth/login');
const { registerHandler } = require('./src/handlers/auth/register');

const { publicHandler } = require('./src/handlers/public-handler');
const { protectedHandler } = require('./src/handlers/protected-handler');

module.exports = {
  authorizeHandler,
  loginHandler,
  refreshHandler,
  registerHandler,
  publicHandler,
  protectedHandler,
};
