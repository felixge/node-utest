var assert       = require('assert');
var BashReporter = require('../../lib/reporter/BashReporter');
var EventEmitter = require('events').EventEmitter;

(function testOutputOfFailedTests() {
  var process    = new EventEmitter();
  var collection = new EventEmitter();
  var reporter   = new BashReporter({process: process, collection: collection});

  var stdout = '';
  process.stdout = {
    write: function(chunk) {
      stdout += chunk;
    },
  };

  var testCase = {name: 'MyTestCase'};
  var test     = 'is awesome';
  var error    = {stack: 'Something went wrong:\nLine2\nLine3'};

  collection.emit('fail', testCase, test, error);

  assert.equal(
    stdout,
    'Failed: MyTestCase is awesome\n' +
    '\n' +
    '  Something went wrong:\n' +
    '  Line2\n' +
    '  Line3\n' +
    '\n'
  );
})();
