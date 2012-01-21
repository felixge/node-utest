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
  this._runForNextTick       = false;
}

Collection.prototype.add = function(testCase, object, eventName) {
  var self = this;
  if (testCase.hasSelectedTests())
    this._onlyRunSelectedTests = true;
  // if we waiting for an event then test case run themself on a event
  if (object && object.on && object.on instanceof Function && eventName) {
    object.on (eventName, function () {
      self._runTestCase (testCase);
    });
    return;
  }
  // every time sync task added we add handler for a next tick
  this._testCases.push(testCase);
  this._runForNextTick = true;
  process.nextTick(this.run.bind(this));
};

Collection.prototype.run = function() {
  // this tick no more running tests
  this._runForNextTick = false;
  this._start = this._start || Date.now();
  for (var i = 0; i < this._testCases.length; i++) {
    var testCase = this._testCases[i];
	// add test cases runtime
    if (!testCase.completed)
	  this._runTestCase(testCase);
  }
};

Collection.prototype._runTestCase = function(testCase) {
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
