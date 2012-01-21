module.exports     = utest;
utest.Collection   = require('./lib/Collection');
utest.TestCase     = require('./lib/TestCase');
utest.BashReporter = require('./lib/reporter/BashReporter');

var collection;
var reporter;
function utest(name, tests) {
  var object, eventName;
  if (arguments.length == 4 && tests.on && tests.on instanceof Function) {
    object    = tests;
	eventName = arguments[2];
	tests     = arguments[3];
  }
  if (!collection) {
    collection = new utest.Collection();
    reporter   = new utest.BashReporter({collection: collection});

    // process.nextTick(collection.run.bind(collection));
  }

  var testCase = new utest.TestCase({name: name, tests: tests});
  collection.add(testCase, object, eventName);
  
  return testCase;
};
