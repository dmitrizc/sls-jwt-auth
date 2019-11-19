if (!process.env.IS_SERVERLESS) {
  require('dotenv-flow').config();
}

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_DIALECT,
} = require('../src/constants');

module.exports = {
  'local': {
    'username': DB_USERNAME,
    'password': DB_PASSWORD,
    'database': DB_NAME,
    'host': DB_HOST,
    'dialect': DB_DIALECT,
    logging: false,
    underscored: true,
    pool: {
      max: 5,
      min: 1,
      idle: 100,
    },
  },
  'dev': {
    'username': DB_USERNAME,
    'password': DB_PASSWORD,
    'database': DB_NAME,
    'host': DB_HOST,
    'dialect': DB_DIALECT,
    logging: false,
    underscored: true,
    pool: {
      max: 5,
      min: 1,
      idle: 100,
    },
  },
  'prod': {
    'username': DB_USERNAME,
    'password': DB_PASSWORD,
    'database': DB_NAME,
    'host': DB_HOST,
    'dialect': DB_DIALECT,
    logging: false,
    underscored: true,
    pool: {
      max: 5,
      min: 1,
      idle: 100,
    },
  },
};
