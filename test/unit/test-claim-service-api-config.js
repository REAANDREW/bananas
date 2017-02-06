'use strict';

var should = require('should');
var ClaimServiceApiConfig = require('../../libs/apis/ClaimServiceApiConfig');

describe('Claim Service API Configuration', () => {

    it('url returns default http://localhost:8000/fubar for path /fubar', () => {
        var config = new ClaimServiceApiConfig();

        should(config.url('/fubar')).equal('http://localhost:8000/fubar');
    });

});
