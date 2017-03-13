'use strict';

var should = require('should');
var ClaimServiceApiConfig = require('../../libs/apis/ClaimServiceApiConfig');

describe('Claim Service API Configuration', () => {

    it('url returns default http://localhost:8080/fubar for path /fubar', () => {
        var config = new ClaimServiceApiConfig();

        should(config.url('/fubar')).equal('http://localhost:80/fubar');
    });

    it('witPort configures the port', () => {
        var expectedPort = 35000;
        var config = new ClaimServiceApiConfig().withPort(expectedPort);
        should(config.port).equal(expectedPort);
    });

    it('witHostname configures the hostname', () => {
        var expectedHostname = 35000;
        var config = new ClaimServiceApiConfig().withHostname(expectedHostname);
        should(config.hostname).equal(expectedHostname);
    });
});
