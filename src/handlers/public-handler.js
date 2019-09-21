'use strict';

module.exports.publicHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Public Endpoint, Anyone can access this.',
        input: event,
      },
      null,
      2,
    ),
  };
};
