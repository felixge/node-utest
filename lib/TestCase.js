var util         = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = TestCase;
util.inherits(TestCase, EventEmitter);
function TestCase(properties) {
  this.name   = properties.name;
  this._tests = properties.tests;
}

TestCase.prototype.run = function() {
  var noop   = function() {};
  var before = this._tests.before || noop;
  var after  = this._tests.after || noop;

  for (var test in this._tests) {
    if (test === 'before' || test === 'after') continue;

    var fn      = this._tests[test];
    var context = {};

    try {
      before.call(context);
      fn.call(context);
      after.call(context);
    } catch (_err) {
      var err = _err;
    }

    if (!err) {
      this.emit('pass', test);
    } else {
      this.emit('fail', test, err);
    }
  }
};
