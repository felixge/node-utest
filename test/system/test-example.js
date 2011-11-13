var assert = require('assert');
var test = require('../..');

var executed = 0;
test('Number#toFixed', {
  'returns a string': function() {
    assert.equal(typeof (5).toFixed(), 'string');
    executed++;
  },

  'takes number of decimal places': function() {
    assert.equal((5).toFixed(1), '5.0');
    executed++;
  },

  'does not round': function() {
    assert.equal((5.55).toFixed(1), '5.5');
    executed++;
  },
});

process.on('exit', function() {
  assert.equal(executed, 3);
});
