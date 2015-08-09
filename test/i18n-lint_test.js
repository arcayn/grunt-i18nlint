/**
 * grunt-i18nlint tests
 *
 * Copyright (c) 2015 James Warwood
 * Licensed under the MIT license.
 */
'use strict';

// Dependencies
var exec = require('child_process').exec;
var format = require('util').format;
var path = require('path');

// "Constants"
var MESSAGES = {
  text: 'Hardcoded <.*?> tag',
  attr: 'Hardcoded \'%s\' attribute',
  ok: 'No hardcoded strings'
};

// Variables
var execOptions = {
  cwd: path.join(__dirname, '..')
};

// Helpers
/**
 * Run the `i18n-lint` task via exec, with the given target.
 *
 * @param {String} target      The target to run, e.g. 'default_options'
 * @param {Function} callback  The callback function to the exec call
 */
var runTask = function(target, callback) {
  exec('grunt i18nlint:' + target, execOptions, callback);
};

/**
 * Count the occurrences of a particular substring in a string.
 *
 * @param {String} context  The context in which to search for the substring
 * @param {String} substring  The substring to count occurrences of
 *
 * @return {Number} the number of occurrences of substring in context
 */
var substringCount = function(context, substring) {
  var matches = context.match(new RegExp(substring, 'g'));

  return (matches || []).length;
};

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.I18nLint = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(3);

    runTask('default_options', function(err, stdout) {
      test.notEqual(err && err.code || 0, 0);
      test.equal(substringCount(stdout, MESSAGES.text), 9);
      test.equal(substringCount(stdout, format(MESSAGES.attr, 'alt')), 1);

      test.done();
    });
  },
  custom_options: function(test) {
    test.expect(2);

    runTask('custom_options', function(err, stdout) {
      test.notEqual(err && err.code || 0, 0);
      test.equal(substringCount(stdout, format(MESSAGES.attr, 'alt')), 0);

      test.done();
    });
  },
  clean_file: function(test) {
    test.expect(2);

    runTask('clean_file', function(err, stdout) {
      test.equal(err, null);
      test.notEqual(stdout.indexOf('No hardcoded strings'), -1);
      test.done();
    });
  },
  forced: function(test) {
    test.expect(1);

    runTask('forced', function(err, stdout) {
      test.equal(err, null);

      test.done();
    });
  },
  reporting_output: function(test) {
    test.expect(1);

    runTask('reporting_output', function(err, stdout) {
      test.notEqual(
         stdout.indexOf('Found hardcoded strings in 1 of 2 files'), -1);

      test.done();
    });
  },
  highlighting: function(test) {
    test.expect(1);

    runTask('highlighting', function(err, stdout) {
      test.equal(stdout.indexOf('^'), 198);

      test.done();
    });
  },
  reporter_function: function(test) {
    test.expect(1);

    runTask('reporter_function', function(err, stdout) {
      test.notEqual(stdout.indexOf('My Special Reporter'), -1);

      test.done();
    });
  },
  reporter_from_file: function(test) {
    test.expect(1);

    runTask('reporter_from_file', function(err, stdout) {
      test.notEqual(stdout.indexOf('Found 10 errors'), -1);

      test.done();
    });
  },
  reporter_built_in: function(test) {
    test.expect(1);

    runTask('reporter_built_in', function(err, stdout) {
      test.equal(
        stdout.match(/(.*?\.html:\d+:\d+ Hardcoded.*?)/g).length,
        10
      );

      test.done();
    });
  },
  reporter_non_existent: function(test) {
    test.expect(2);

    runTask('reporter_non_existent', function(err, stdout) {
      test.notEqual(err, null);
      test.notEqual(stdout.indexOf('No such reporter \'idontexist\''), -1);

      test.done();
    });
  },
  reporter_invalid: function(test) {
    test.expect(2);

    runTask('reporter_invalid', function(err, stdout) {
      test.notEqual(err, null);
      test.notEqual(stdout.indexOf('Invalid reporter'), -1);

      test.done();
    });
  }
};
