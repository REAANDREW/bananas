'use strict';

var should = require('should');
var rest = require('restler');

var ClaimServiceApi = require('../libs/apis/ClaimServiceApi');
var ClaimServiceApiConfig = require('../libs/apis/ClaimServiceApiConfig');
var InprocClaimService = require('../libs/infrastructure/inproc/InprocClaimService');

describe ('Claim Service', () => {

    var claimServiceApi;
    var claimServiceApiConfig;

    before((done) => {

        var claimService = new InprocClaimService();
        claimServiceApiConfig = new ClaimServiceApiConfig();
        
        claimServiceApi = new ClaimServiceApi(claimServiceApiConfig, claimService);

        claimServiceApi.start(done);
    });

    after((done) => {
        claimServiceApi.stop(done);
    });

    describe ('Submit a new claim and completes all necessary processing steps', () =>{

        var claimResponseObj;

        before( (done) => {
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

            var path = claimServiceApiConfig.url('/claims');

            rest.postJson(path, payload)
                    .on('complete',function(data,response) {
                should.exist(response);
                should(response.statusCode).equal(201); 

                var claimURL = data.actions.info.url;

                rest.get(claimURL).on('complete', function(data,response) {
                    should(response.statusCode).equal(200); 
                    claimResponseObj = data;
                    done();
                });
            });
        });

        it('has status object', () => {
            should.exist(claimResponseObj.status);
        });

        it('has submitted status', () => {
            should.exist(claimResponseObj.status.submitted);
        });

        it('has registered status', () => {
            should.exist(claimResponseObj.status.registered);
        });

        it('has verified status', () => {
            should.exist(claimResponseObj.status.verified);
        });

        it('has eligibilityEvaluated status', () => {
            should.exist(claimResponseObj.status.eligibilityEvaluated);
        });

        it('has awardCalculated status', () => {
            should.exist(claimResponseObj.status.awardCalculated);
        });

        it('has paymentCalculated status', () => {
            should.exist(claimResponseObj.status.paymentCalculated);
        });

        it('has paymentMade status', () => {
            should.exist(claimResponseObj.status.paymentMade);
        });

        it('has statementGenerated status', () => {
            should.exist(claimResponseObj.status.statementGenerated);
        });

        it('has notificationSent status', () => {
            should.exist(claimResponseObj.status.notificationSent);
        });
    });
});
