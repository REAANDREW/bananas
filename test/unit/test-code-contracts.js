'use strict';

var should = require('should');
var CodeContracts = require('../../libs/utils/CodeContracts');

describe('Code Contracts', () => {

    it('throws exception on null', ()=> {
        var func = (a) => {
            CodeContracts.exists(a);
        };

        should( ()=>{
            func(null);
        }).throw('argument is null');
    });

    it('throws exceptions on undefined', () => {
        var func = (a) => {
            CodeContracts.exists(a);
        };

        should( ()=>{
            func(undefined);
        }).throw('argument is undefined');
    });

    it('throws exception on null with specified message', () => {
        var message = 'talula';
        var func = (a) => {
            CodeContracts.exists(a, message);
        };

        should( ()=>{
            func(null);
        }).throw(message);
    });

    it('throws exception on undefined with specified message', () => {
        var message = 'talula';
        var func = (a) => {
            CodeContracts.exists(a, message);
        };

        should( ()=>{
            func(undefined);
        }).throw(message);
    });

});
