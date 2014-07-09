'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    // env

    dir: {
      src: 'src/',
      dist: 'dist/',
      assets: ''
    },

    watch: {
      options: {
        livereload: true,
        spawn: true
      },

      'jshint-gruntfile': {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },

      'jshint-js': {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js']
      },

      less: {
        files: ['<%= dir.src %><%= dir.assets %>less/**/*.less'],
        tasks: ['recess:lint', 'recess:compile']
      }

    },

    bower: {
      install: {
        options: {
          targetDir: '<%= dir.src %>vendor',
          layout: 'byComponent',
          install: true,
          cleanup: true
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        base: ['.']
      },
      dev: {
        options: {
          middleware: function (connect, options) {

            var middlewares = [];

            if (!Array.isArray(options.base))
              options.base = [options.base];

            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });

            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        }
      }
    },


    // js

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: ['Gruntfile.js' ]
      },
      js: {
        src: ['<%= dir.src %><%= dir.assets %>js/**/*.js']
      }
    },


    // css

    recess: {
      options: {
        noOverqualifying: false
      },

      lint: {
        src: ['<%= dir.src %><%= dir.assets %>less/main.less']
      },

      compile: {
        options: {
          compile: true
        },
        src: ['<%= dir.src %><%= dir.assets %>less/main.less',
              '<%= dir.src %><%= dir.assets %>less/icomoon.less'],
        dest: '<%= dir.src %><%= dir.assets %>css/style.css'
      }
    },


    // dist

    clean: {
      dist: ['<%= dir.dist %>']
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: '<%= dir.src %>',
        src: ['**/*.html'],
        dest: '<%= dir.dist %>'
      }
    },

    cssmin: {
      dist: {
        expand: true,
        cwd: '<%= dir.src %><%= dir.assets %>',
        src: ['**/*.css'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        expand: true,
        cwd: '<%= dir.src %><%= dir.assets %>',
        src: ['**/*.js'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    },

    copy: {
      img: {
        expand: true,
        cwd: '<%= dir.src %><%= dir.assets %>',
        src: ['img/**', 'fonts/**'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    }

  });

  grunt.registerTask('default', ['connect:dev', 'watch']);
  grunt.registerTask('build', ['bower', 'clean', 'recess', 'copy', 'htmlmin', 'cssmin', 'uglify']);

};
