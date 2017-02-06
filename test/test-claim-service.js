
var should = require('should');
var rest = require('restler');

function InprocClaimService(){
    var claims = {};
    var self = {};

    self.put = (claim, callback) => {   
        claims[claim.id] = claim;
        callback(undefined, true);
    };

    self.get = (id, callback) => {
        callback(undefined, claims[id]);
    };

    return self;
}

describe("InprocClaimService", () => {

    var service;

    beforeEach(() => {
        service = new InprocClaimService();
    });

    it("Puts a new claim", (done) => {
        service.put({}, (err, persisted) => {
            should(persisted).equal(true);
            done();
        });
    });

    it("Gets a claim", (done) => {
        var expectedId = '1';

        service.put({id:expectedId}, (err, persisted) => {
            should(persisted).equal(true);

            service.get(expectedId, (err, claim) => {
                should.not.exist(err);
                should(claim.id).equal(expectedId);
                done();
            })
        });
    });
});

describe ('something', () => {
    it ('does something', (done) =>{
        should(1).equal(1);
        //Create a server

        var claimService = new InprocClaimService();
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
                submitted : true
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

        app.listen(8000, function(){
            //Create a JSON Payload with 
            // - firstname, middlename, lastname, dob, gender, title, nino, bank account, passport number
            //
            var payload = {
                firstName : 'John',
                middleName : 'Joe',
                lastName : 'Doe',
                dob : '01/01/1964',
                gender : 'male',
                title : 'Dr',
                nino : 'AB123456A',
                bankAccount : {
                    sortCode : '233512',
                    accountNumber : '12345678',
                    name : 'barclays'
                },
                address : {
                    line1 : 'Somehouse',
                    line2 : 'Someplace',
                    townCity : 'Somewhere',
                    postcode : 'XX1 1XX'
                },
                passportNumber : '123456789'
            };
            // POST the payload to /claims
            rest.postJson('http://localhost:8000/claims', payload).on('complete',function(data,response) {
                should.exist(response);
                should(response.statusCode).equal(201); 
                // Find the link to see your claim status
                var claimURL = data.actions.info.url;

                // GET the status of the claim /claims/:id
                //
                rest.get(claimURL).on('complete', function(data,response) {
                    should(response.statusCode).equal(200); 
                    // Assert on the following statuses being present
                    should.exist(data.status);
                    // 1. Submitted
                    should.exist(data.status.submitted);
                    // 2. Registered
                    // 3. Verified
                    // 4. EligibilityEvaluated
                    // 5. AwardCalculated
                    // 6. Payment Calculated
                    // 7. PaymentMade
                    // 8. StatementGenerated
                    // 9. NotificationSent
                    done();
                });
            });
        });
    });
});
