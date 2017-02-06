'use strict';

var moment = require('moment');
var TestData = require('./TestData');

function Person(me){
    this.name = me;
}

Person.prototype.sayHi = function(name){
    return this.me + ' says hi to ' + name;
};

function TestClaimBuilder(){
    var self = {};

    var claim = TestData.defaultClaim;

    self.withAge = (age) => {
        claim.dob =  moment().subtract(age, 'years').format('DD/MM/YYYY');
        return self;
    };

    self.build = () => {
        return claim;
    };

    return self;
}

module.exports = TestClaimBuilder;
