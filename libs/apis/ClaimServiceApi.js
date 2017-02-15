'use strict';

var os = require('os');
var http = require('http');
var logging = require('../logging');


function ClaimServiceApi(config, claimService){
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());

    app.use(logging.requestLogger);

    app.get('/meta/health', function(req,res){
        res.setHeader('X-HOSTNAME',os.hostname());
        res.status(200).end();
    });

    app.post('/claims', function(req,res) {
        var claimObj = req.body;
        claimObj.id = '1';
        claimObj.status = {
            submitted : true,
            registered : true,
            verified : true,
            eligibilityEvaluated : true,
            awardCalculated : true,
            paymentCalculated : true,
            paymentMade : true,
            statementGenerated : true,
            notificationSent : true
        };

        claimService.put(claimObj, function(){
            res.status(201).json({
                actions : {
                    info : {
                        url : config.url(`/claims/${claimObj.id}`)
                    },
                    payments : {
                        url : config.url(`/claims/${claimObj.id}/payments`)
                    },
                }
            });
        });
    });

    app.get('/claims/:id/payments', function(req,res) {
        claimService.getPayments (req.params.id,function(err,payments) {
            res.status(200).json(payments);
        });
    });

    app.get('/claims/:id', function(req,res) {
        claimService.get (req.params.id,function(err,claim) {
            res.status(200).json(claim);
        });
    });

    app.use(logging.errorLogger);

    app.server = http.createServer(app);

    var self = {};
    self.start = (callback) => {
        app.server.listen(config.port, config.hostname, callback);
    };
    self.stop = (callback) => {
        app.server.close(callback);
    };

    return self;
}

module.exports = ClaimServiceApi;
