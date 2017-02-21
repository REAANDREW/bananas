'use strict';

var should = require('should');
var rest = require('restler');

var ClaimServiceApiConfig = require('../../libs/apis/ClaimServiceApiConfig');
var TestClaimBuilder = require('../libs/TestClaimBuilder');
var HmrcApiProxy = require('../../libs/infrastructure/http/HmrcApiProxy');
var HmrcApiStubService = require('../libs/HmrcApiStubService');
var ClaimServiceApiFactory = require('../../libs/apis/ClaimServiceApiFactory');

var testCases =  [
        {age: 50, nino: 'AA000011D', expected: 0},
        {age: 51, nino: 'AA000011D', expected: 50},
        {age: 51, nino: 'AA000021D', expected: 100},
        {age: 61, nino: 'AA000011D', expected: 75},
        {age: 61, nino: 'AA000021D', expected: 150},
        {age: 71, nino: 'AA000011D', expected: 150},
        {age: 71, nino: 'AA000021D', expected: 300},
];

describe('Claim Service', () => {

    var claimServiceApi;
    var claimServiceApiConfig;
    var hmrcApiProxy;
    var hmrcApiStubConfig = {
        port : 40001,
        data: {
            'AA000011D':{ expectedYears: 11},
            'AA000021D':{ expectedYears: 21},
        }
    };
    var stub;

    before((done) => {
        var hmrcApiConfig = {
            nicEndpoint : `http://localhost:${hmrcApiStubConfig.port}/nic`,
        };

        hmrcApiProxy = new HmrcApiProxy(hmrcApiConfig);

        claimServiceApiConfig = new ClaimServiceApiConfig();

        var claimServiceApiFactory = new ClaimServiceApiFactory(claimServiceApiConfig,hmrcApiProxy);
        claimServiceApi = claimServiceApiFactory.create();

        stub = new HmrcApiStubService(hmrcApiStubConfig);
        stub.start(() => {
            claimServiceApi.start(done);
        });
    });

    after((done) => {
        stub.stop(() => {
            claimServiceApi.stop(done);
        });
    });

    describe('the health check', () => {

        it('returns OK', (done) => {
            var path = claimServiceApiConfig.url('/meta/health');
            rest.get(path)
                    .on('complete',function(data, response) {
                        should(response.statusCode).equal(200);
                        done();
                    });
        });
    });

    describe('Submit a new claim makes the correct payment', () => {
        testCases.forEach((testCase) => {
            describe(`for an age of ${testCase.age} and nino of ${testCase.nino}`, () => {
                var claimPaymentsUrl;

                before( (done) => {
                    var claim = new TestClaimBuilder().withAge(testCase.age).build();    
                    claim.nino = testCase.nino;
                    
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
