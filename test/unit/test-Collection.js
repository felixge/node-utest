var assert = require('assert');
var Collection = require('../../lib/Collection');
var TestCase = require('../../lib/TestCase');

(function testRunningTwoTestCases() {
  var caseA = new TestCase({
    name: 'a',
    tests: {
      '1': function() {},
      '2': function() {},
    },
  });
  var caseB = new TestCase({
    name: 'b',
    tests: {
      '3': function() {},
      '4': function() {},
    },
  });

  var collection = new Collection();

  var pass = [];
  collection.on('pass', function(testCase, name) {
    pass.push(testCase.name + ':' + name);
  });

  collection.add(caseA);
  collection.add(caseB);

  assert.deepEqual(pass, ['a:1', 'a:2', 'b:3', 'b:4']);

  var stats = collection.stats();
  assert.equal(stats.pass, 4);
})();

(function testFailingTestCase() {
  var testCase = new TestCase({
    tests: {
      'good test': function() {
      },
      'bad test': function() {
        throw new Error('failure');
      }
    },
  });

  var collection = new Collection();

  var fail = [];
  collection.on('fail', function(testCase, name, error) {
    fail.push({testCase: testCase, name: name, error: error});
  });

  collection.add(testCase);

  assert.equal(fail.length, 1);
  assert.equal(fail[0].testCase, testCase);
  assert.equal(fail[0].name, 'bad test');
  assert.equal(fail[0].error.message, 'failure');

  var stats = collection.stats();
  assert.equal(stats.pass, 1);
  assert.equal(stats.fail, 1);
  assert.ok(stats.duration >= 0);
})();
