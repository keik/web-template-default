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
      docs: 'docs/',
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
      options: {
        layout: 'byComponent',
        install: true,
        cleanup: true
      },
      dev: {
        options: {
          targetDir: '<%= dir.src %>vendor/',
          production: false
        }
      },
      dist: {
        options: {
          targetDir: '<%= dir.dist %>vendor/',
          bowerOptions: {
            production: true
          }
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        base: ['src']
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

    modernizr: {

      dev: {
        devFile: 'node_modules/grunt-modernizr/lib/modernizr-dev.js',
        outputFile: '<%= bower.dev.options.targetDir %>modernizr/modernizr.js',
        extra : {
          shiv : true,
          printshiv : false,
          load : true,
          mq : true,
          cssclasses : true
        },
        uglify : false,
        tests : ['touch'],
        parseFiles : true,
        files : {
          src: ['<%= dir.src %>**/*.js', '<%= dir.src %>**/*.css']
        }
      },

      dist: {
        devFile: 'node_modules/grunt-modernizr/lib/modernizr-dev.js',
        outputFile: '<%= bower.dist.options.targetDir %>modernizr/modernizr.js',
        extra : {
          shiv : true,
          printshiv : false,
          load : true,
          mq : true,
          cssclasses : true
        },
        uglify : true,
        tests : ['touch'],
        parseFiles : true,
        files : {
          src: ['<%= dir.dist %>**/*.js', '<%= dir.dist %>**/*.css']
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
        files: [
          {
            '<%= dir.src %><%= dir.assets %>css/style.css': [
              '<%= dir.src %><%= dir.assets %>less/main.less',
              '<%= dir.src %><%= dir.assets %>less/icomoon.less'
            ]
          }
        ]
      }
    },


    // dist

    clean: {
      dev: ['<%= dir.src %><%= dir.assets %>css/', '<%= dir.src %><%= dir.assets %>vendor/'],
      dist: ['<%= dir.dist %>'],
      docs: ['<%= dir.docs %>']
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: false
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
        cwd: '<%= dir.dist %><%= dir.assets %>',
        src: ['**/*.js'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: '<%= dir.src %><%= dir.assets %>',
        src: ['img/**', 'fonts/**', 'js/**', 'json/**'],
        dest: '<%= dir.dist %><%= dir.assets %>'
      }
    },

    jsdoc: {
      dist: {
        src: ['<%= dir.src %><%= dir.assets %>js/**/*.js'],
        dest: '<%= dir.docs %>js'
      }
    }

  });

  grunt.registerTask('default', ['connect:dev', 'watch']);
  grunt.registerTask('install', ['bower:dev', 'recess', 'modernizr:dev', 'jsdoc']);
  grunt.registerTask('build', ['clean', 'bower:dist', 'recess', 'modernizr:dist', 'copy', 'htmlmin', 'cssmin', 'uglify', 'jsdoc']);

};
