const { to } = require('await-to-js');
const Joi = require('../../utils/validator2');

const { success, unprocessableEntry } = require('../../utils/reponse');

const { User } = require('../../../models');
const { UserScheme } = require('../../schemes');

module.exports.registerHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const [errors, request] = Joi.validateRequestAndSelect(event.body, UserScheme, ['name', 'email', 'password']);
  if (Joi.hasPlainError(errors)) { return unprocessableEntry(errors); }

  const { name, email, password } = request;

  // Check email in use
  const [errFindDup, existingUser] = await to(User.findOne({ where: { email } }));
  if (errFindDup || existingUser) {
    console.error('Email already in use', errFindDup);
    return unprocessableEntry({ email: ['Email already in use'] });
  }

  const [errSignup, user] = await to(User.create({
    company_id: 0,
    role: 'user',
    email,
    name,
    password,
  }));
  if (errSignup || !user) {
    console.error('Can not create db entry', errSignup);
    return unprocessableEntry(errSignup);
  }

  return success({
    name,
    email,
  });
};
