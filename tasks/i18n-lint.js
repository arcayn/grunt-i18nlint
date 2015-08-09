/*
 * grunt-i18nlint
 * https://github.com/jwarby/grunt-i18nlint
 *
 * Copyright (c) 2015 James Warwood
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Core dependencies
  var printf = require('util').format;

  // NPM dependencies
  var chalk = require('chalk');
  var I18nLint = require('i18n-lint');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
    'i18nlint',
    'Find hardcoded, untranslated strings in HTML and template source files',
    function () {

      // Extend options with defaults
      // @TODO move to lib/i18n-lint.js
      var options = this.options({
          force: false
        }),
        tasksFailed = 0,
        totalTasks = 0,
        reporter = options.reporter,
        done = this.async();

      switch (typeof options.reporter) {
        case 'string':

          // Check if it's a built-in reporter
          reporter = I18nLint.reporters[options.reporter];

          if (!reporter) {
            try {
              reporter = require(options.reporter).reporter;
            } catch(e) {
              grunt.fail.warn('No such reporter \'' + options.reporter +
                  '\'');
            }
          }
          break;
        case 'undefined':
          reporter = I18nLint.reporters.default;
          break;
        case 'function':
          break;
        default:
          grunt.fail.warn('Invalid reporter \'' + options.reporter + '\'');
      }

      // Iterate over all specified file groups.
      this.files.forEach(function(fileGroup) {
        totalTasks += fileGroup.src.length;

        fileGroup.src.forEach(function(srcFile) {

          var errors = I18nLint(srcFile, options);
          if (errors.length) {
            tasksFailed++;

            reporter(errors);
          }
        });
      });

      if (!tasksFailed) {
        grunt.log.writeln(chalk.bold.green('✔ No hardcoded strings found'));
      } else {
        grunt.log.warn(chalk.red(printf(
          'Found hardcoded strings in %d of %d files', tasksFailed, totalTasks
        )));
      }

      done(!(tasksFailed && !options.force));
    }
  );
};
