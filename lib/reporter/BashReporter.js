module.exports = BashReporter;
function BashReporter(options) {
  this._process    = options.process || process;
  this._collection = options.collection;

  this._collection.on('fail', this.handleFail.bind(this));
  this._process.on('exit', this.handleExit.bind(this));
}

BashReporter.prototype.handleFail = function(testCase, test, error) {
  this._process.stdout.write('Fail: ' + testCase.name + ': ' + test + '\n');
  this._process.stdout.write(error.stack + '\n\n');

};

BashReporter.prototype.handleExit = function() {
  var stats = this._collection.stats();
  this._process.stdout.write(
    stats.fail + ' fail | ' +
    stats.pass + ' pass | ' +
    stats.duration + ' ms ' +
    '\n'
  );

  if (stats.fail) this._process.reallyExit(1);
};
