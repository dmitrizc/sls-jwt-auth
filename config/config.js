require('dotenv').config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_DIALECT,
} = require('../src/constants');

module.exports = {
  'development': {
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
