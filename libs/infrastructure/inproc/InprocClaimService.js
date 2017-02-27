'use strict';

var moment = require('moment');
var CodeContracts = require('../../utils/CodeContracts');

function InprocClaimService(awardCalculator, hmrcApi){

    CodeContracts.exists(awardCalculator, 'required awardCalculator not supplied');
    CodeContracts.notEmptyObject(awardCalculator);

    CodeContracts.exists(hmrcApi,'required hmrcApi not supplied');
    CodeContracts.notEmptyObject(hmrcApi);

    var claims = {};
    var payments = {};

    var self = {};

    self.put = (claim, callback) => {   
        claims[claim.id] = claim;

        //TODO: need ageCalculator.caculate(...);
        var age = moment().diff(moment(claim.dob, 'DD/MM/YYYY'), 'years');

        hmrcApi.getNic(claim.nino, (err, result) => {
            var calculationResult = awardCalculator.calculate(age, result.years);

            payments[claim.id] = [{amount : calculationResult.award}];

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

