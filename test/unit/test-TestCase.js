var assert = require('assert');
var TestCase = require('../../lib/TestCase');

(function testRunEmitsPassAndFail() {
  var test = new TestCase({tests: {
    a: function() {
      assert.equal(1, 1);
    },
    b: function() {
      assert.equal(2, 1);
    },
  }});

  var fail = [];
  var pass = [];

  test
    .on('pass', function(name) {
      assert.equal(name, 'a');
      pass.push(name);
    })
    .on('fail', function(name, err) {
      assert.ok(err instanceof Error);
      assert.equal(name, 'b');
      fail.push(name);
    });


  test.run();

  assert.equal(pass.length, 1);
  assert.equal(fail.length, 1);
})();

(function testBeforeAndAfter() {
  var events = [];
  var test = new TestCase({tests: {
    before: function() {
      events.push('before');
    },
    after: function() {
      events.push('after');
    },

    a: function() {
      events.push('a');
    },
  }});

  test.run();

  assert.deepEqual(events, ['before', 'a', 'after']);
})();

(function testBeforeAndAfterContext() {
  var aCalled = false;
  var test = new TestCase({tests: {
    before: function() {
      this.foo = 'bar';
    },

    a: function() {
      assert.deepEqual(this, {foo: 'bar'});
      aCalled = true;
    },
  }});

  test.run();

  assert.ok(aCalled);
})();
