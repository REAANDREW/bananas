'use strict';

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

        return addDiscount(nic, value);
    };

    return self;
}

module.exports = AwardCalculator;
