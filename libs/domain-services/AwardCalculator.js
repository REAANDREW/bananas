'use strict';

var logger = require('../logging').logger;

function AwardCalculator(){
    
    var self = {};

    var addDiscount = (nic, value) => {
        if (nic <= 20) {
            value = value * 0.5; 
        }
        return value;
    };

    self.calculate = (age, nic) => {

        var value = 0;

        if (age > 70) {
            value = 300;
        } else if (age > 60 ) {
            value = 150;
        } else if (age > 50) {
            value = 100;
        } 

        var valueAfterDiscount = addDiscount(nic, value);

        logger.log('info', 'Award Calculated', {
            age: age,
            nic: nic,
            value : value,
            discount: valueAfterDiscount < value,
            award: valueAfterDiscount 
        });

        return valueAfterDiscount;
    };

    return self;
}

module.exports = AwardCalculator;
