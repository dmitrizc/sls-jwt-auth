'use strict';

const status = require('http-status');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true,
};

const success = (body) => ({
  statusCode: status.OK,
  headers,
  body: JSON.stringify({
    success: true,
    ...body,
  }),
});

const internalServerError = (error, body = {}) => ({
  statusCode: status.INTERNAL_SERVER_ERROR,
  headers,
  body: JSON.stringify({
    success: false,
    error,
    ...body,
  }),
});

const unprocessableEntry = (error, body = {}) => ({
  statusCode: status.UNPROCESSABLE_ENTITY,
  headers,
  body: JSON.stringify({
    success: false,
    error,
    ...body,
  }),
});

const notFound = (error, body = {}) => ({
  statusCode: status.NOT_FOUND,
  headers,
  body: JSON.stringify({
    success: false,
    error,
    ...body,
  }),
});

const unauthorized = (error, body = {}) => ({
  statusCode: status.UNAUTHORIZED,
  headers,
  body: JSON.stringify({
    success: false,
    error,
    ...body,
  }),
});

module.exports = {
  success,
  internalServerError,
  unprocessableEntry,
  notFound,
  unauthorized,
};
