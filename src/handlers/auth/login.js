const jwt = require('jsonwebtoken');
const moment = require('moment');
const { to } = require('await-to-js');

const Joi = require('../../utils/validator2');

const { User, UserSession } = require('../../../models');
const { UserScheme } = require('../../schemes');

const {
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_ENCRYPTION,
} = require('../../constants');

const {
  success,
  unauthorized,
  unprocessableEntry,
  internalServerError,
} = require('../../utils/reponse');

module.exports.loginHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const [errors, request] = Joi.validateRequestAndSelect(event.body, UserScheme, ['email', 'password']);
  if (Joi.hasPlainError(errors)) { return unprocessableEntry(errors); }

  const { email, password } = request;

  // Check if user exists
  const [errFindUser, user] = await to(User.findOne({ where: { email } }));

  if (errFindUser || !user) {
    console.error(errFindUser);
    return unprocessableEntry('Can not login with provided credentials');
  }

  // Check if password is correct
  const [errPasswordCheck, passwordCorrect] = await to(user.comparePassword(password));

  if (errPasswordCheck || !passwordCorrect) {
    return unprocessableEntry('Can not login with provided credentials');
  }

  // Create user session in session db, create access and refresh token, return it to frontend
  const access_token = user.getJwt();
  const refresh_token = user.getJwt(true);

  const [errCreateSession, userSession] = await to(UserSession.create({
    user_id: user.id,
    token: refresh_token,
    ip: event.sourceIp || 'x.x.x.x',
    started_at: new Date(),
    expires_at: moment().add(JWT_REFRESH_EXPIRATION, 'seconds').toDate(),
  }));

  if (errCreateSession || !userSession) {
    console.error(errCreateSession);
    return internalServerError('Can not start session');
  }

  return success({
    access_token,
    refresh_token,
  });
};

module.exports.refreshHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { refresh_token } = JSON.parse(event.body);

  // Check if refresh_token is provided
  if (!refresh_token) {
    return unauthorized('Invalid Refresh Token');
  }

  // Find session with token
  const [errFindSession, session] = await to(UserSession.findOne({ where: { token: refresh_token } }));
  if (errFindSession || !session) {
    console.error(errFindSession);
    return unauthorized('Invalid Refresh Token');
  }

  // Check if refresh_token is valid
  const tokenSplits = refresh_token.split(' ');
  if (tokenSplits.length < 2 || tokenSplits[0] !== 'Bearer') {
    await to(session.destroy());
    throw unauthorized('Invalid Refresh Token');
  }

  let userId = null;

  try {
    const decoded = jwt.verify(tokenSplits[1], JWT_REFRESH_ENCRYPTION);
    userId = decoded.userId;

  } catch (e) {
    console.error(e);
    await to(session.destroy());

    if (e instanceof jwt.TokenExpiredError) {
      throw unauthorized('Refresh Token Expired');
    }

    return unauthorized('Invalid Refresh Token');
  }

  // Find user with id
  const [errFindUser, user] = await to(User.findOne({ where: { id: userId } }));
  if (errFindUser || !user) {
    console.error(errFindSession);
    await to(session.destroy());
    return unprocessableEntry('Invalid User Information');
  }

  // Generate new refresh_token and access_token for user
  const new_access_token = user.getJwt();
  const new_refresh_token = user.getJwt(true);

  const [errUpdateSession, updateResult] = await to(session.update({
    token: new_refresh_token,
    expires_at: moment().add(JWT_REFRESH_EXPIRATION, 'seconds').toDate(),
  }));
  if (errUpdateSession) {
    console.error(errUpdateSession);
    return internalServerError('Can not update refresh_token');
  }

  return success({
    access_token: new_access_token,
    refresh_token: new_refresh_token,
  });
};
