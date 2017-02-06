//IMPLEMENT THIS!
//
'use strict';

function HmrcApiTestDouble(){
    var self ={};
    var dict = {};

    self.forNino = (nino) => {
        return {
            returnResult : (result) => {
                dict[nino] = result;   
            }
        }
    };

    self.getNic = (nino, callback) => {
        var value = dict[nino];
        if(value === undefined){
            callback(undefined, {years:1});
        }else{
            callback(undefined, dict[nino]); 
        }
    };

    return self;
}

module.exports = HmrcApiTestDouble;
