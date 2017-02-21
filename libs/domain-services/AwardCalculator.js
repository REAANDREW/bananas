'use strict';

var logger = require('../logging').logger;
var CodeContracts = require('../utils/CodeContracts');


function AwardCalculator(){
    
    var self = {};

    var applyDiscount = (nic, value) => {
        var discount = {
            value : value,
            applied: false
        };
        if (nic <= 20) {
            discount.value = value * 0.5; 
            discount.applied = true;
        }
        return discount;
    };

    self.calculate = (age, nic) => {
        CodeContracts.exists(age);
        CodeContracts.exists(nic);

        var value = 0;

        if (age > 70) {
            value = 300;
        } else if (age > 60 ) {
            value = 150;
        } else if (age > 50) {
            value = 100;
        } 

        var discount = applyDiscount(nic, value);

        var result = {
            age: age,
            nic: nic,
            value : value,
            discount: discount.applied,
            award: discount.value 
        };

        logger.log('info', 'Award Calculated', result);

        return result;
    };

    return self;
}

module.exports = AwardCalculator;
