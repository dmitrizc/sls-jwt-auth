'use strict';

module.exports.protectedHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Protected Endpoint, Only Authorized can access this.',
        input: event,
      },
      null,
      2,
    ),
  };
};
