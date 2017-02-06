'use strict';

var moment = require('moment');

function InprocClaimService(awardCalculator, hmrcApi){

    if (awardCalculator === null || awardCalculator === undefined){
        throw new Error('required awardCalculator not supplied');
    }

    if (hmrcApi === null || hmrcApi === undefined){
        throw new Error('required hmrcApi not supplied');
    }

    var claims = {};
    var payments = {};

    var self = {};

    self.put = (claim, callback) => {   
        claims[claim.id] = claim;

        //TODO: need ageCalculator.caculate(...);
        var age = moment().diff(moment(claim.dob, 'DD/MM/YYYY'), 'years');

        hmrcApi.getNic(claim.nino, (err, result) => {
            var award = awardCalculator.calculate(age, result.years);

            payments[claim.id] = [{amount : award}];

            callback(undefined, true);
        });
    };

    self.get = (id, callback) => {
        callback(undefined, claims[id]);
    };

    self.getPayments = (id, callback) => {
        callback(undefined, payments[id]); 
    };

    return self;
}

module.exports = InprocClaimService;

