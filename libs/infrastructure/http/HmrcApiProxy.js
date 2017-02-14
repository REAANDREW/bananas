'use strict';

var rest = require('restler');

var logger = require('../../logging').logger;

function HmrcApiProxy(config) {

    var self = {};

    self.getNic = function (nino, callback) {
        logger.log('info', 'Requesting years of contribution', {
            endpoint: config.nicEndpoint
        });
        rest.postJson(config.nicEndpoint, { nino : nino})
                .on('complete',function(result) {
                    if (result instanceof Error) {
                        logger.log('error', 'Received years of contribution response error', {
                            result: result,
                        });
                        callback(new Error('Error communicating with HMRC Service'));
                    }else{
                        logger.log('info', 'Received years of contribution response', {
                            result: result,
                        });
                        callback(undefined, result);
                    }
                });
    };

    return self;
}

module.exports = HmrcApiProxy;
