'use strict';

var AwardCalculator = require('../../libs/domain-services/AwardCalculator');
var ClaimServiceApi = require('../../libs/apis/ClaimServiceApi');
var InprocClaimService = require('../../libs/infrastructure/inproc/InprocClaimService');

function ClaimServiceApiFactory(config, hmrcApiProxy){
    
    var self = {};

    self.create = () => {
        var awardCalculator = new AwardCalculator(); 
        var claimService = new InprocClaimService(awardCalculator, hmrcApiProxy);
        var claimServiceApi = new ClaimServiceApi(config, claimService);

        return claimServiceApi;
    };

    return self;

}

module.exports = ClaimServiceApiFactory;
