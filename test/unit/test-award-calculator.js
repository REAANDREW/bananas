'use strict';

var should = require('should');
var AwardCalculator = require('../../libs/domain-services/AwardCalculator');

var testCases = [
        {age: 50, nic: 11, expected: 0},
        {age: 51, nic: 10, expected: 50},
        {age: 51, nic: 11, expected: 50},
        {age: 51, nic: 21, expected: 100},
        {age: 51, nic: 20, expected: 50},
        {age: 60, nic: 11, expected: 50},
        {age: 60, nic: 21, expected: 100},
        {age: 61, nic: 11, expected: 75},
        {age: 61, nic: 21, expected: 150},
        {age: 70, nic: 11, expected: 75},
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
                var result = calculator.calculate(age, nic);
                should(result.award).equal(testCase.expected);
            });
        });
    });

    it('throw exception when age is null', () => {
        should( ()=>{
            calculator.calculate(null);
        }).throw('argument is null');
    });

    it('throw exception when age is undefined', () => {
        should( ()=>{
            calculator.calculate(undefined);
        }).throw('argument is undefined');
    });

    it('throw exception when nic is null', () => {
        should( ()=>{
            calculator.calculate(41, null);
        }).throw('argument is null');
    });

    it('throw exception when nic is undefined', () => {
        should( ()=>{
            calculator.calculate(41, undefined);
        }).throw('argument is undefined');
    });
});
