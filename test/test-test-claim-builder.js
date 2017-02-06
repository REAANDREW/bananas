'use strict';

var should = require('should');
var moment = require('moment');
var TestClaimBuilder = require('./libs/TestClaimBuilder');
var niWithNic = require('./libs/NiWithNic');
var TestData = require('./libs/TestData');

describe('Test Claim Builder', () => {

    describe('.withAge(51)', () => {
        it('returns claim with age 51', () => {
            var age = 51;

            var expectedDate = moment().subtract(age, 'years').format('DD/MM/YYYY');            

            var claim = new TestClaimBuilder().withAge(age).build();

            should(claim.dob).equal(expectedDate); 
        });
    });


    describe('.withNic', () => {
        it('10 returns claim with nino of niWithNic(1O)', () => {
            var years = 10;

            var claim = new TestClaimBuilder().withNic(years).build();

            should(claim.nino).equal(niWithNic(10)); 
        });
        it('11 returns claim with nino of niWithNic(11)', () => {
            var years = 11;

            var claim = new TestClaimBuilder().withNic(years).build();

            should(claim.nino).equal(niWithNic(11)); 
        });
        it('21 returns claim with nino of niWithNic(21)', () => {
            var years = 21;

            var claim = new TestClaimBuilder().withNic(years).build();

            should(claim.nino).equal(niWithNic(21)); 
        });
    });

    describe('.withAge(51).withNic(11)', () => {
        it('returns claim with DOB for a 51 year old and nino of niWithNic(11)', () => {
            
            var age = 51;
            var years = 11;
            var expectedDate = moment().subtract(age, 'years').format('DD/MM/YYYY');            

            var claim = new TestClaimBuilder().withAge(age).withNic(years).build();

            should(claim.nino).equal(niWithNic(years));
            should(claim.dob).equal(expectedDate); 

        });
        
    });

    describe('with no methods', () => {

        it('returns claim with default information', () => {

            var expectedClaim = TestData.defaultClaim;
            var claim = new TestClaimBuilder().build();
            
            should(claim).equal(expectedClaim);
        });

    });

});
