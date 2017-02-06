'use strict';

function exists(arg, msg){
    if (arg === null) {
        throwError(msg, 'argument is null');
    }
    if (arg === undefined){
        throwError(msg, 'argument is undefined');
    }
}

function throwError(msg, defaultMsg){
    exists(defaultMsg);

    if(msg === undefined){
        msg = defaultMsg;
    }
    throw new Error(msg);
}


module.exports = {
    exists : exists
};
