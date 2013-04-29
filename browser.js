if (!Function.prototype.bind) {
  Function.prototype.bind = function (scope) {
    var fn = this;
    return function () {
      return fn.apply(scope, arguments);
    };
  };
}

// Not shimed by Browserify:
process.exit = function () {};

var test = require('./index');
test.Reporter = test.ConsoleReporter;

module.exports = function (name, tests) {
  process.nextTick(function () {
    test(name, tests);
  });
};
