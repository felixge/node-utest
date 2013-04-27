var assert = require('assert');
var test = require('../..');

var infoCalls = 0;
var warnCalls = 0;
var errorCalls = 0;

console.info = function() {
  infoCalls++;
};
console.warn = function() {
  warnCalls++;
};
console.error = function() {
  errorCalls++;
};

test.Reporter = test.ConsoleReporter;

test('console', {
  'skipped': function() {},
  '!fails': function() { throw new Error(); },
  '!fails again': function() { throw new Error(); }
});

process.on('exit', function() {
  assert.equal(infoCalls, 1);
  assert.equal(warnCalls, 1);
  assert.equal(errorCalls, 2);

  // Override return code or 'make' will always fail
  process.reallyExit(0);
});
