var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var doNothing    = function() {};

module.exports = TestCase;
util.inherits(TestCase, EventEmitter);
function TestCase(properties) {
  this.name   = properties.name;
  this._tests = properties.tests;
}

TestCase.prototype.run = function(onlyRunSelectedTests) {
  var before = this._tests.before || doNothing;
  var after  = this._tests.after || doNothing;

  for (var test in this._tests) {
    if (test === 'before' || test === 'after') continue;

    if (onlyRunSelectedTests && !this._isSelected(test)) {
      this.emit('skip', test);
      continue;
    }

    var fn      = this._tests[test];
    var context = {};
    var err     = null;

    try {
      before.call(context);
      fn.call(context);
    } catch (_err) {
      err = _err;
    } finally {
      try {
        after.call(context);
      } catch (_err) {
        if (!err) {
          err = _err;
        }
      }
    }

    if (!err) {
      this.emit('pass', test);
    } else {
      this.emit('fail', test, err);
    }
  }
};

TestCase.prototype.hasSelectedTests = function() {
  for (var test in this._tests) {
    if (this._isSelected(test)) return true;
  }

  return false;
};

TestCase.prototype._isSelected = function(test) {
  return test.substr(0, 1) === '!';
};
