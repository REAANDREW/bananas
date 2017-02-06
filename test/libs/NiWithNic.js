'use strict';

//http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function niWithNic(years){
    return 'AA' + pad(years, 6) + 'D';
}

module.exports = niWithNic;
