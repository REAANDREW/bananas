'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');


function HmrcApiStubService(config){
    var app = express();

    function lookupYearsFor(nino){
        var item = config.data[nino];
        if(item === undefined){
            throw new Error('No test case covers this nino');
        }
        return item.expectedYears;
    }


    var self = {};

    self.start = (callback) => {
        app.use(bodyParser.json());
        app.post('/nic', (req,res) => {
            res.status(200).json({
                years : lookupYearsFor(req.body.nino)
            }).end();
        });
        app.server = http.createServer(app);
        app.server.listen(config.port, callback);
    };

    self.stop = (callback) => {
        app.server.close(callback);
    };

    return self;
}

module.exports = HmrcApiStubService;
