var assert = require('assert');
var test = require('../..');

var tests = [];

var test1 = test('1', {
  '!a': function() {tests.push('a');},
  'b': function() {tests.push('b');},
});

process.nextTick (function () {
  test('2', {
    '!c': function() {tests.push('c');},
    'd': function() {tests.push('d');},
  });
});

test('3', test1, 'pass', {
  '!e': function() {tests.push('e');},
  'f': function() {tests.push('f');},
});


process.on('exit', function() {
  assert.deepEqual(tests.sort(), ['a', 'c', 'e']);
});
