var util         = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Collection;
util.inherits(Collection, EventEmitter);
function Collection(options) {
  this._pass                 = 0;
  this._fail                 = 0;
  this._skip                 = 0;
  this._testCases            = [];
  this._onlyRunSelectedTests = false;
}

Collection.prototype.add = function(testCase) {
  this._testCases.push(testCase);
  if (testCase.hasSelectedTests()) this._onlyRunSelectedTests = true;
};

Collection.prototype.run = function() {
  this._start = this._start || Date.now();
  for (var i = 0; i < this._testCases.length; i++) {
    var testCase = this._testCases[i];
    this._runTestCase(testCase);
  }
  this.emit('complete', this.stats());
};

Collection.prototype._runTestCase = function(testCase) {
  this.emit('run', testCase);
  var self = this;
  testCase
    .on('pass', function(name) {
      self._pass++;
      self.emit('pass', testCase, name);
    })
    .on('fail', function(name, err) {
      self._fail++;
      self.emit('fail', testCase, name, err);
    })
    .on('skip', function(name, err) {
      self._skip++;
      self.emit('skip', testCase, name);
    })
    .run(this._onlyRunSelectedTests);
};

Collection.prototype.stats = function() {
  return {
    pass     : this._pass,
    fail     : this._fail,
    skip     : this._skip,
    duration : Date.now() - this._start,
  };
};
