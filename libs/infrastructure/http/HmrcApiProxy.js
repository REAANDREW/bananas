'use strict';

var rest = require('restler');

function HmrcApiProxy(config) {

    var self = {};

    self.getNic = function (nino, callback) {

        rest.postJson(config.nicEndpoint, { nino : nino})
                .on('complete',function(result) {
                    if (result instanceof Error) {
                        callback(new Error('Error communicating with HMRC Service'));
                    }else{
                        callback(undefined, result);
                    }
                });
    };

    return self;
}

module.exports = HmrcApiProxy;
