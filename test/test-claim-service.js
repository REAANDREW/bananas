'use strict';

var should = require('should');
var rest = require('restler');

var ClaimServiceApi = require('../libs/apis/ClaimServiceApi');
var ClaimServiceApiConfig = require('../libs/apis/ClaimServiceApiConfig');
var InprocClaimService = require('../libs/infrastructure/inproc/InprocClaimService');
var TestClaimBuilder = require('./libs/TestClaimBuilder');

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

    describe('Submit a new claim makes the correct payment', () => {

        describe('for Age 51 and NIC years 11' , () => {

            var claimPaymentsUrl;

            before( (done) => {

                var claim = new TestClaimBuilder().withAge(51).withNic(11).build();    
                
                var path = claimServiceApiConfig.url('/claims');

                rest.postJson(path, claim)
                        .on('complete',function(data) {
                            claimPaymentsUrl = data.actions.payments.url;
                            should(claimPaymentsUrl).containEql('payments')
                            done();
                        });
            });


            it('pays £50', (done) => {
                rest.get(claimPaymentsUrl).on('complete', function(data,response) {
                    should(response.statusCode).equal(200); 
                    should(data.length).equal(1);
                    should.exist(data[0].amount);
                    should(data[0].amount).equal(50);
                    done();
                });
            });

        });

        describe('for age 51 and nic years 21' , () => {

            it.skip('pays £100', () => {

            });

        });

        describe('for age 61 and nic years 11' , () => {

            it.skip('pays £75', () => {

            });

        });

        describe('for age 61 and nic years 21' , () => {

            it.skip('pays £150', () => {

            });

        });

        describe('for age 71 and nic years 11' , () => {

            it.skip('pays £150', () => {

            });

        });

        describe('for age 71 and nic years 21' , () => {

            it.skip('pays £300', () => {

            });

        });
    });

    describe ('Submit a new claim and completes all necessary processing steps', () =>{

        var claimResponseObj;

        before( (done) => {
            var claim = new TestClaimBuilder().build();    

            var path = claimServiceApiConfig.url('/claims');

            rest.postJson(path, claim)
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
