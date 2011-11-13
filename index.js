module.exports     = utest;
utest.Collection   = require('./lib/Collection');
utest.TestCase     = require('./lib/TestCase');
utest.BashReporter = require('./lib/reporter/BashReporter');

var collection;
var reporter;
function utest(name, tests) {
  if (!collection) {
    collection = new utest.Collection();
    reporter   = new utest.BashReporter({collection: collection});
  }

  var testCase = new utest.TestCase({name: name, tests: tests});
  collection.add(testCase);
};
