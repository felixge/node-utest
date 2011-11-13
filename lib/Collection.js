var util         = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Collection;
util.inherits(Collection, EventEmitter);
function Collection(options) {
  this._pass = 0;
  this._fail = 0;
}

Collection.prototype.add = function(testCase) {
  this._start = this._start || Date.now();

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
    .run();
};

Collection.prototype.stats = function() {
  return {
    pass     : this._pass,
    fail     : this._fail,
    duration : Date.now() - this._start,
  };
};
