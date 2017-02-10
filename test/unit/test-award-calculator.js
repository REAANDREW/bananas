'use strict';

var should = require('should');
var AwardCalculator = require('../../libs/domain-services/AwardCalculator');

var testCases = [
        {age: 50, nic: 11, expected: 0},
        {age: 51, nic: 11, expected: 50},
        {age: 51, nic: 21, expected: 100},
        {age: 61, nic: 11, expected: 75},
        {age: 61, nic: 21, expected: 150},
        {age: 71, nic: 11, expected: 150},
        {age: 71, nic: 21, expected: 300},
];

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
