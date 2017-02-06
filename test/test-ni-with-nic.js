'use strict';
var should = require('should');
var niWithNic = require('./libs/NiWithNic');

describe('Ni With Nic', () => {

    it('Years 10 returns AA000010D', () => {
        should(niWithNic(10)).equal('AA000010D');
    });

    it('Years 11 returns AA000011D', () => {
        should(niWithNic(11)).equal('AA000011D');
    });

    it('Years 21 returns AA000021D', () => {
        should(niWithNic(21)).equal('AA000021D');
    });
});
