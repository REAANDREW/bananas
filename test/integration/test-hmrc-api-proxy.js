'use strict';

var should = require('should');

var HmrcApiProxy = require('../../libs/infrastructure/http/HmrcApiProxy');
var HmrcApiStubService = require('../libs/HmrcApiStubService');

describe('HMRC Api Proxy', () => {

    var servicePort = 40001;
    var notUsedPort = 40002;

    var config = {
        port : servicePort,
        data: {
            'AA000010D':{ expectedYears: 10},
            'AA000011D':{ expectedYears: 11},
            'AA000021D':{ expectedYears: 21},
        }
    };

    var stub;

    var hmrcApiConfig = {
        nicEndpoint : `http://localhost:${config.port}/nic`,
    };

    var hmrcApiProxy = new HmrcApiProxy(hmrcApiConfig);

    before( (done) => {
        stub = new HmrcApiStubService(config);
        stub.start(done);
    });

    after((done) => {
        stub.stop(done);
    });

    function testProxy(nino, testCase){
        it(`${nino} returns ${testCase.expectedYears} years of contribution`, (done) => {
            hmrcApiProxy.getNic(nino, (err, result) => {
                should.not.exist(err);
                should(result.years).equal(testCase.expectedYears);
                done();
            });
        });
    }

    for (var nino in config.data){
        var testCase = config.data[nino];
        testProxy(nino, testCase);
    }

    it('returns an error when the service is not listening', (done) => {
        var sampleNino = 'AA000010D';
        hmrcApiProxy = new HmrcApiProxy({
            nicEndpoint : `http://localhost:${notUsedPort}/nic`,
        });
        hmrcApiProxy.getNic(sampleNino, (err, result) => {
            should.not.exist(result);
            should.exist(err);
            should(err.message).equal('Error communicating with HMRC Service');
            done();
        });
    });
});
