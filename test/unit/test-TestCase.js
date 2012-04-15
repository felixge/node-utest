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

    after: function() {
      assert.deepEqual(this, {foo: false});
    },

    a: function() {
      assert.deepEqual(this, {foo: 'bar'});
      this.foo = false;
      aCalled = true;
    },
  }});

  test.run();

  assert.ok(aCalled);
})();

(function testErrorInOneTestDoesNotAffectOthers() {
  var test = new TestCase({tests: {
    a: function() {
      assert.equal(2, 1);
    },
    b: function() {
      assert.equal(1, 1);
    },
  }});

  var fail = [];
  var pass = [];

  test
    .on('pass', function(name) {
      pass.push(name);
    })
    .on('fail', function(name, err) {
      fail.push(name);
    });


  test.run();

  assert.deepEqual(pass, ['b']);
  assert.deepEqual(fail, ['a']);
})();

(function testErrorInTestStillCallsAfter() {
  var called = false;
  var test = new TestCase({tests: {
    after: function () {
      called = true;
    },
    a: function() {
      throw new Error();
    }
  }});

  test.run();

  assert(called);
})();

(function testErrorInAfterFailsTest() {
  var test = new TestCase({tests: {
    after: function () {
      throw new Error();
    },
    a: function() {},
    b: function() {}
  }});

  var fail = [];
  var pass = [];

  test
    .on('pass', function(name) {
      pass.push(name);
    })
    .on('fail', function(name, err) {
      fail.push(name);
    });


  test.run();

  assert.deepEqual(pass, []);
  assert.deepEqual(fail, ['a', 'b']);
})();

(function testErrorInAfterDoesNotHideTestError() {
  var test = new TestCase({tests: {
    after: function () {
      throw new Error('after');
    },
    a: function() {
      throw new Error('test');
    }
  }});

  var err;

  test.on('fail', function(name, _err) {
    err = _err;
  });

  test.run();

  assert.equal(err.message, 'test');
})();
