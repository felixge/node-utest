var Util = require('util');

module.exports = BashReporter;
function BashReporter(options) {
  this._process    = options.process || process;
  this._collection = options.collection;

  this._collection.on('fail', this._handleFail.bind(this));
  this._collection.on('complete', this._handleComplete.bind(this));
}

BashReporter.prototype._handleFail = function(testCase, test, error) {
  this._process.stdout.write('Failed: ' + testCase.name + ' ' + test + '\n\n');
  var stack = (error.stack)
    ? error.stack
    : 'Exception without stack: ' + Util.inspect(error);

  stack = stack.replace(/^/gm, '  ');
  this._process.stdout.write(stack + '\n\n');
};

BashReporter.prototype._handleComplete = function(stats) {
  var output =
    stats.fail + ' fail | ' +
    stats.pass + ' pass | ' +
    stats.duration + ' ms ' +
    '\n';

  if (stats.skip) {
    output = stats.skip + ' SKIPPED | ' + output;
  }

  this._process.stdout.write(output);
};
