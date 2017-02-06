'use strict';

function InprocClaimService(){
    var claims = {};
    var self = {};

    self.put = (claim, callback) => {   
        claims[claim.id] = claim;
        callback(undefined, true);
    };

    self.get = (id, callback) => {
        callback(undefined, claims[id]);
    };

    return self;
}

module.exports = InprocClaimService;

