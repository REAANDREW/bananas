'use strict';

function ClaimServiceApiConfig(){
    var self = {};
    self.port = 8000;
    self.scheme = 'http';
    self.hostname = 'localhost';

    self.url = function(path) {
       return self.scheme + '://' + self.hostname + ':' + self.port + path;
    };

    self.withPort = (port) => {
        self.port = port;
        return self;
    };

    self.withHostname = (hostname) => {
        self.hostname = hostname;
        return self;
    };

    return self;
}

module.exports = ClaimServiceApiConfig;
