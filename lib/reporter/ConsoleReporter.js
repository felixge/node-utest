var Util = require('util');

module.exports = ConsoleReporter;
function ConsoleReporter(options) {
  this._collection = options.collection;

  this._collection.on('run', this._handleRun.bind(this));
  this._collection.on('fail', this._handleFail.bind(this));
  this._collection.on('complete', this._handleComplete.bind(this));
}

ConsoleReporter.prototype._handleRun = function(testCase) {
  console.log('Running: ' + testCase.name);
};

ConsoleReporter.prototype._handleFail = function(testCase, test, error) {
  var msg   = 'Failed: ' + testCase.name + ' ' + test;
  var stack = (error.stack)
    ? error.stack
    : 'Exception without stack: ' + Util.inspect(error);

  stack = stack.replace(/^/gm, '  ');
  console.error(msg + '\n\n' + stack + '\n');
};

ConsoleReporter.prototype._handleComplete = function(stats) {
  if (stats.skip) {
    console.warn(stats.skip + ' SKIPPED');
  }
  console.info(stats.fail + ' fail | ' +
    stats.pass  + ' pass | ' +
    stats.duration + ' ms');

};
