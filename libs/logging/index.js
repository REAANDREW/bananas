'use strict';

var winston = require('winston');
var expressWinston = require('express-winston');

const consoleLogger = new winston.transports.Console({
    json: true,
    stringify: true
});

const requestLogger = expressWinston.logger({
  transports: [consoleLogger],
  expressFormat: false,
  meta: true
});

const errorLogger = expressWinston.errorLogger({
  transports: [consoleLogger],
});

module.exports = {
    requestLogger : requestLogger,
    errorLogger : errorLogger,
    logger : new winston.Logger({
        transports: [consoleLogger],
    })
};
