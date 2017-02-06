'use strict';

module.exports = {
    defaultClaim : {
        firstName : 'John',
        middleName : 'Joe',
        lastName : 'Doe',
        dob : '01/01/1964',
        gender : 'male',
        title : 'Dr',
        nino : 'AA012345D',
        bankAccount : {
            sortCode : '233512',
            accountNumber : '12345678',
            name : 'barclays'
        },
        address : {
            line1 : 'Somehouse',
            line2 : 'Someplace',
            townCity : 'Somewhere',
            postcode : 'XX1 1XX'
        },
        passportNumber : '123456789'
    },
    paymentTestCases : [
        {age: 50, nic: 11, expected: 0},
        {age: 51, nic: 11, expected: 50},
        {age: 51, nic: 21, expected: 100},
        {age: 61, nic: 11, expected: 75},
        {age: 61, nic: 21, expected: 150},
        {age: 71, nic: 11, expected: 150},
        {age: 71, nic: 21, expected: 300},
    ]
};
