'use strict'

function AwardCalculator(){
    
    var self = {};

    self.calculate = (age, nic) => {

        var value;

        if (age > 70) {
            value = 300;
        } else if (age > 60 ) {
            value = 150
        } else if (age > 50) {
            value = 100
        } else{
            value = 0;
        }

        if (nic <= 20) {
            value = value * 0.5; 
        }
        return value;
    };

    return self;
}

module.exports = AwardCalculator;
