'use strict';

var should = require('should');
var moment = require('moment');
var TestClaimBuilder = require('./libs/TestClaimBuilder');
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


    describe('with no methods', () => {

        it('returns claim with default information', () => {

            var expectedClaim = TestData.defaultClaim;
            var claim = new TestClaimBuilder().build();
            
            should(claim).equal(expectedClaim);
        });

    });

});
