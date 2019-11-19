'use strict';

module.exports.publicHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const inspect = {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_DIALECT: process.env.DB_DIALECT,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Public Endpoint, Anyone can access this.',
        input: event,
        inspect,
      },
      null,
      2,
    ),
  };
};
