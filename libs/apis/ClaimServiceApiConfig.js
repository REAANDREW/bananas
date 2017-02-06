function ClaimServiceApiConfig(){
    var self = {};
    self.port = 8000;
    self.scheme = 'http'
    self.hostname = 'localhost'

    self.url = function(path) {
       return self.scheme + '://' + self.hostname + ':' + self.port + path;
    };
    return self;
}

module.exports = ClaimServiceApiConfig;
