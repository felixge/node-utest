# utest

The minimal unit testing library.

## Why yet another test library?

I wanted something simple, that just does unit tests (no async) and nothing
else. And each test is supposed to be a standalone UNIX program. Now it exists.

## Install

```
npm install utest
```

## Usage

Running a test with utest is very simple:

```js
var test   = require('utest');
var assert = require('assert');

test('Number#toFixed', {
  'returns a string': function() {
    assert.equal(typeof (5).toFixed(), 'string');
  },

  'takes number of decimal places': function() {
    assert.equal((5).toFixed(1), '5.0');
  },

  'does not round': function() {
    assert.equal((5.55).toFixed(1), '5.5');
  },
});
```

The only additional feature is running a before/after method:

```js
var test   = require('utest');
var assert = require('assert');

test('Date', {
  before: function() {
    this.date = new Date;
  },

  after: function() {
    this.date = null;
  },

  'lets you manipulate the year': function() {
    this.date.setYear(2012);
    assert.equal(this.date.getFullYear(), 2012);
  },

  'can be coerced into a number': function() {
    assert.equal(typeof +this.date, 'number');
  },
});
```

## Future Features

I want to keep this library as minimal as possible, but I do consider the
addition of the following features:

* TAP output (if TAP=1 in the environment, switch to TapReporter class)
* Leak detection (automatically add a final test that fails if there are global
  leaks).

## License

This module is licensed under the MIT license.
