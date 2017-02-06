'use strict';

var should = require('should');
var rest = require('restler');

var AwardCalculator = require('../libs/domain-services/AwardCalculator');
var ClaimServiceApi = require('../libs/apis/ClaimServiceApi');
var ClaimServiceApiConfig = require('../libs/apis/ClaimServiceApiConfig');
var InprocClaimService = require('../libs/infrastructure/inproc/InprocClaimService');
var TestClaimBuilder = require('./libs/TestClaimBuilder');
var HmrcApiTestDouble = require('./libs/HmrcApiTestDouble');
var TestData = require('./libs/TestData');

describe ('Claim Service', () => {

    var claimServiceApi;
    var claimServiceApiConfig;
    var awardCalculator;
    var hmrcApiTestDouble;

    before((done) => {
        hmrcApiTestDouble = new HmrcApiTestDouble();

        awardCalculator = new AwardCalculator(); 

        var claimService = new InprocClaimService(awardCalculator, hmrcApiTestDouble);

        claimServiceApiConfig = new ClaimServiceApiConfig();
        
        claimServiceApi = new ClaimServiceApi(claimServiceApiConfig, claimService);

        claimServiceApi.start(done);
    });

    after((done) => {
        claimServiceApi.stop(done);
    });

    describe('Submit a new claim makes the correct payment', () => {
        TestData.paymentTestCases.forEach((testCase) => {
            describe(`for an age of ${testCase.age} and nic of ${testCase.nic}`, () => {
                var claimPaymentsUrl;

                before( (done) => {
                    var claim = new TestClaimBuilder().withAge(testCase.age).build();    

                    hmrcApiTestDouble.forNino(claim.nino).returnResult({
                        years: testCase.nic
                    });
                    
                    var path = claimServiceApiConfig.url('/claims');

                    rest.postJson(path, claim)
                            .on('complete',function(data) {
                                claimPaymentsUrl = data.actions.payments.url;
                                should(claimPaymentsUrl).containEql('payments');
                                done();
                            });
                });

                it(`pays £${testCase.expected}`, (done) => {
                    rest.get(claimPaymentsUrl).on('complete', function(data,response) {
                        should(response.statusCode).equal(200); 
                        should(data.length).equal(1);
                        should.exist(data[0].amount);
                        should(data[0].amount).equal(testCase.expected);
                        done();
                    });
                });
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
