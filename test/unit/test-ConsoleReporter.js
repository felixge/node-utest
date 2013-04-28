var assert          = require('assert');
var ConsoleReporter = require('../../lib/reporter/ConsoleReporter');
var EventEmitter    = require('events').EventEmitter;

(function testOutputOfFailedTests() {
  var collection = new EventEmitter();
  var reporter   = new ConsoleReporter({collection: collection});

  var out;
  console.error = function (str) {
    out = str;
  };

  var testCase = {name: 'MyTestCase'};
  var test     = 'is awesome';
  var error    = {stack: 'Something went wrong:\nLine2\nLine3'};

  collection.emit('fail', testCase, test, error);

  assert.equal(
    out,
    'Failed: MyTestCase is awesome\n' +
    '\n' +
    '  Something went wrong:\n' +
    '  Line2\n' +
    '  Line3\n'
  );
})();

(function testOutputOfCompleteTests() {
  var collection = new EventEmitter();
  var reporter   = new ConsoleReporter({collection: collection});

  var out;
  console.info = function (str) {
    out = str;
  };

  var stats = {fail:2, pass:1, duration:42};

  collection.emit('complete', stats);

  assert.equal(out, '2 fail | 1 pass | 42 ms');
})();

(function testOutputOfCompleteWithSkippedTests() {
  var collection = new EventEmitter();
  var reporter   = new ConsoleReporter({collection: collection});

  var out;
  console.warn = function (str) {
    out = str;
  };

  var stats = {skip:11, fail:2, pass:1, duration:42};

  collection.emit('complete', stats);

  assert.equal(out, '11 SKIPPED');
})();

(function testOutputOfRunningTests() {
  var collection = new EventEmitter();
  var reporter   = new ConsoleReporter({collection: collection});

  var out;
  console.log = function (str) {
    out = str;
  };

  collection.emit('run', {name: 'MyTest'});

  assert.equal(out, 'Running: MyTest');
})();
