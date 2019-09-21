const Joi = require('../utils/validator2');

module.exports = {
  name: Joi.string().label('Name').min(3).max(255).required(),
  email: Joi.string().label('Email').email().required(),
  password: Joi.string().label('Password').min(6).max(255).required(),
  role: Joi.string().label('Role').required(),
};
