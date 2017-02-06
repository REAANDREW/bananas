var http = require('http');

function ClaimServiceApi(config, claimService){
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    app.use(bodyParser.json())

    //Add a handler for /claims POST
    app.post('/claims', function(req,res) {
        console.log('request received...');

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
        }

        claimService.put(claimObj, function(err, ok){
            res.status(201).json({
                actions : {
                    info : {
                        url : 'http://localhost:8000/claims/1'
                    }
                }
            });
        });
    });

    app.get('/claims/:id', function(req,res) {
        claimService.get (req.params.id,function(err,claim) {
            res.status(200).json(claim);
        });
    });

    app.server = http.createServer(app);

    var self = {};
    self.start = (callback) => {
        app.server.listen(config.port, callback);
    }
    self.stop = (callback) => {
        app.server.close(callback);
    }

    return self;
}

module.exports = ClaimServiceApi;
