'use strict';

function InprocClaimService(){
    var claims = {};
    var payments = {};
    var self = {};

    self.put = (claim, callback) => {   
        claims[claim.id] = claim;
        payments[claim.id] = [{amount : 50}];
        callback(undefined, true);
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

