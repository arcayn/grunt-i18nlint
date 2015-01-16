/*
 * grunt-hslint
 * https://github.com/jwarby/grunt-hslint
 *
 * Copyright (c) 2015 James Warwood
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/**/*.js',
        'lib/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    hslint: {
      default_options: {
        src: 'test/fixtures/testing.html',
      },
      custom_options: {
        src: 'test/fixtures/testing.html',
        options: {
          attributes: []
        }
      },
      clean_file: {
        src: 'test/fixtures/clean.hbs',
        options: {
          templateDelimiters: ['{{', '}}']
        }
      },
      forced: {
        src: 'test/fixtures/testing.html',
        options: {
          force: true
        }
      },
      reporting_output: {
        options: {
          templateDelimiters: ['{{', '}}']
        },
        src: [
          'test/fixtures/clean.hbs',
          'test/fixtures/testing.hbs'
        ]
      },
      highlighting: {
        src: 'test/fixtures/highlighting.html'
      },
      reporter_function: {
        src: 'test/fixtures/*.html',
        options: {
          reporter: function(errors) {
            process.stdout.write('My Special Reporter\n');
          }
        }
      },
      reporter_from_file: {
        src: 'test/fixtures/testing.html',
        options: {
          reporter: process.cwd() + '/test/fixtures/fake_reporter.js'
        }
      },
      reporter_built_in: {
        src: 'test/fixtures/testing.html',
        options: {
          reporter: 'simple'
        }
      },
      reporter_non_existent: {
        src: 'test/fixtures/testing.html',
        options: {
          reporter: 'idontexist'
        }
      },
      reporter_invalid: {
        src: 'test/fixtures/testing.html',
        options: {
          reporter: 2
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
      options: {
        reporter: 'nested'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
