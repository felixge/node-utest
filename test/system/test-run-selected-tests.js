var assert = require('assert');
var test = require('../..');

var tests = [];

test('1', {
  '!a': function() {tests.push('a');},
  'b': function() {tests.push('b');},
});

test('2', {
  '!c': function() {tests.push('c');},
  'd': function() {tests.push('d');},
});

process.on('exit', function() {
  assert.deepEqual(tests, ['a', 'c']);
});
