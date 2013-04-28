module.exports        = utest;
utest.Collection      = require('./lib/Collection');
utest.TestCase        = require('./lib/TestCase');
utest.BashReporter    = require('./lib/reporter/BashReporter');
utest.ConsoleReporter = require('./lib/reporter/ConsoleReporter');
utest.Reporter        = utest.BashReporter;

var collection;
var reporter;
function utest(name, tests) {
  if (!collection) {
    collection = new utest.Collection();
    reporter   = new utest.Reporter({collection: collection});

    process.nextTick(collection.run.bind(collection));
    collection.on('complete', function(stats) {
      process.exit(stats.fail ? 1 : 0);
    });
  }

  var testCase = new utest.TestCase({name: name, tests: tests});
  collection.add(testCase);
};
