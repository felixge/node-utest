module.exports = BashReporter;
function BashReporter(options) {
  this._process    = options.process || process;
  this._collection = options.collection;

  this._collection.on('fail', this._handleFail.bind(this));
  this._process.on('exit', this._handleExit.bind(this));
}

BashReporter.prototype._handleFail = function(testCase, test, error) {
  this._process.stdout.write('Failed: ' + testCase.name + ' ' + test + '\n\n');
  var stack = error.stack.replace(/^/gm, '  ');
  this._process.stdout.write(stack + '\n\n');
};

BashReporter.prototype._handleExit = function() {
  var stats = this._collection.stats();
  this._process.stdout.write(
    stats.fail + ' fail | ' +
    stats.pass + ' pass | ' +
    stats.duration + ' ms ' +
    '\n'
  );

  if (stats.fail) this._process.reallyExit(1);
};
