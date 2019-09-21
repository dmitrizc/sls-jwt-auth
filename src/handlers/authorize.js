const jwt = require('jsonwebtoken');

const {
  JWT_ACCESS_ENCRYPTION,
  JWT_REFRESH_ENCRYPTION,
} = require('../constants');

const {
  unauthorized,
} = require('../utils/reponse');

const buildIAMPolicy = (userId, effect, resource, context) => {
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }],
    },
    context,
  };

  return policy;
};

module.exports.authorizeHandler = async (event, context) => {
  const headers = Object.keys(event.headers || {}).reduce(
    (acc, c) => ({ ...acc, [c.toLowerCase()]: event.headers[c] }),
    {},
  );

  const tokenString = event.authorizationToken || headers.authorization;

  if (!tokenString) {
    throw unauthorized('Invalid Access Token');
  }

  const tokenSplits = tokenString.split(' ');
  if (tokenSplits.length < 2 || tokenSplits[0] !== 'Bearer') {
    throw unauthorized('Invalid Access Token');
  }

  try {
    const decoded = jwt.verify(tokenSplits[1], JWT_ACCESS_ENCRYPTION);
    const userId = decoded.userId;

    return buildIAMPolicy(userId, 'Allow', event.methodArn, { user: JSON.stringify({ id: userId }) });
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      throw unauthorized('Token Expired');
    }
    throw unauthorized('Invalid Access Token');
  }
};
