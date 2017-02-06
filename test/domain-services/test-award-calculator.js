'use strict';

var should = require('should');
var AwardCalculator = require('../../libs/domain-services/AwardCalculator');
var TestData = require('../libs/TestData');
var testCases = TestData.paymentTestCases;

describe('Award Calculator', () => {

    var calculator = new AwardCalculator();

    testCases.forEach((testCase) => {
        describe(`for an age of ${testCase.age} and nic of ${testCase.nic}`, () => {

            var age = testCase.age;
            var nic = testCase.nic;
            it(`calculates ${testCase.expected}`, () => {
                should(calculator.calculate(age, nic)).equal(testCase.expected);
            });
        });
    });

});
