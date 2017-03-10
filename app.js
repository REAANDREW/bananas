'use strict';
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var HmrcApiProxy = require('./libs/infrastructure/http/HmrcApiProxy');
var ClaimServiceApiConfig = require('./libs/apis/ClaimServiceApiConfig');
var ClaimServiceApiFactory = require('./libs/apis/ClaimServiceApiFactory');

if(argv.c === undefined){
    console.error('config (-c) required');
}

var contents = fs.readFileSync(argv.c);
var config = JSON.parse(contents);

var hmrcApiProxy = new HmrcApiProxy(config.hmrcApiConfig);
var claimServiceApiConfig = new ClaimServiceApiConfig()
    .withSocket(config.socket);

var claimServiceApiFactory = new ClaimServiceApiFactory(claimServiceApiConfig,hmrcApiProxy);
var claimServiceApi = claimServiceApiFactory.create();

claimServiceApi.start(() => {
    console.log(`Claim Service is listening on ${config.socket}`);
});
