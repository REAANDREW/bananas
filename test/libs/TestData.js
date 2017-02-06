var niWithNic = require('./NiWithNic');

module.exports = {
    defaultClaim : {
        firstName : 'John',
        middleName : 'Joe',
        lastName : 'Doe',
        dob : '01/01/1964',
        gender : 'male',
        title : 'Dr',
        nino : niWithNic(11),
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
    }
};
