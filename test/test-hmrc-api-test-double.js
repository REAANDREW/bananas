'use strict';

var should = require('should');
var HmrcApiTestDouble = require('./libs/HmrcApiTestDouble');

describe('HMRC Test Double', () => {
    
    it('returns the specified result', () => {
        var nino = "AA123456D";
        var expectedYears = 11;
        var hmrcApiTestDouble = new HmrcApiTestDouble();

        hmrcApiTestDouble.forNino(nino).returnResult({
            years : expectedYears
        });

        hmrcApiTestDouble.getNic(nino, (error, result) => {
            should.exist(result);
            should.exist(result.years);
            should(result.years).equal(expectedYears);
        });
    });

    it('returns a default result', () => {
        
        var hmrcApiTestDouble = new HmrcApiTestDouble();

        hmrcApiTestDouble.getNic("AA012345D", (error, result) => {
            should.exist(result);
            should.exist(result.years);
            should(result.years).equal(1);
        });
    });
});
