'use strict';

var should = require('should');
var AwardCalculator = require('../../libs/domain-services/AwardCalculator');
var InprocClaimService = require('../../libs/infrastructure/inproc/InprocClaimService');
var TestClaimBuilder = require('../libs/TestClaimBuilder');
var HmrcApiTestDouble = require('../libs/HmrcApiTestDouble');

describe('InprocClaimService', () => {

    var service;
    var awardCalculator;
    var hmrcApiTestDouble;

    beforeEach(() => {
        hmrcApiTestDouble = new HmrcApiTestDouble();
        awardCalculator = new AwardCalculator(); 

        service = new InprocClaimService(awardCalculator, hmrcApiTestDouble);
    });


    it('Raises an exception when created without awardCalcaultor', () => {
        should(() => {
            new InprocClaimService(); 
        }).throw('required awardCalculator not supplied');
    });

    it('Raises an exception when created without hmrcApi', () => {
        should(() => {
            new InprocClaimService({},undefined); 
        }).throw('required hmrcApi not supplied');
    });

    it('Puts a new claim', (done) => {
        service.put({}, (err, persisted) => {
            should(persisted).equal(true);
            done();
        });
    });

    it('Gets a claim', (done) => {
        var expectedId = '1';

        service.put({id:expectedId}, (err, persisted) => {
            should(persisted).equal(true);

            service.get(expectedId, (err, claim) => {
                should.not.exist(err);
                should(claim.id).equal(expectedId);
                done();
            });
        });
    });

    it('Get payments for a claim', (done) => {

        //We have no separate claim persistence so we have to create a claim in order for payments to be made.
        //i.e. We are not able to test in isolation! TODO: Refactor

        var age = 51;
        var years = 21;
        var expectedPaymentAmount = awardCalculator.calculate(age,years);


        var claim = new TestClaimBuilder().withAge(age).build();
        claim.id = '1234';

        hmrcApiTestDouble.forNino(claim.nino).returnResult({
            years: years
        });

        service.put(claim, () => {
            service.getPayments(claim.id, (err, payments) => {
                should(payments.length).equal(1);
                should(payments[0].amount).equal(expectedPaymentAmount); 
                done();
            });
        });
    });
});
