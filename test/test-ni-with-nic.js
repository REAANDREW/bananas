'use strict';
var should = require('should');
var NiWithNic = require('./libs/NiWithNic');

describe('Ni With Nic', () => {

    it('Years 10 returns AA000010D', () => {
        should(NiWithNic(10)).equal('AA000010D');
    })

    it('Years 11 returns AA000011D', () => {
        should(NiWithNic(11)).equal('AA000011D');
    })

    it('Years 21 returns AA000021D', () => {
        should(NiWithNic(21)).equal('AA000021D');
    })
});
