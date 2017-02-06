
var should = require('should');
var InprocClaimService = require('../libs/infrastructure/inproc/InprocClaimService');

describe("InprocClaimService", () => {

    var service;

    beforeEach(() => {
        service = new InprocClaimService();
    });

    it("Puts a new claim", (done) => {
        service.put({}, (err, persisted) => {
            should(persisted).equal(true);
            done();
        });
    });

    it("Gets a claim", (done) => {
        var expectedId = '1';

        service.put({id:expectedId}, (err, persisted) => {
            should(persisted).equal(true);

            service.get(expectedId, (err, claim) => {
                should.not.exist(err);
                should(claim.id).equal(expectedId);
                done();
            })
        });
    });
});
