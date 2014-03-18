module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
          options: {
            separator: ';'
          },
          dist: {
            src: ['src/**/*.js'],
            dest: 'dist/<%= pkg.name %>.js'
          }
        },
        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
            }
          }
        },
        qunit: {
          files: ['test/**/*.html']
        },
        jshint: {
          files: ['Gruntfile.js', 'dest/all.js', 'test/**/*.js'],
          options: {
            // options here to override JSHint defaults
            globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
            }
          }
        },
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'dist/<%= pkg.name %>.js',
                options: {
                    module: 'amd' //or commonjs
                }
            },
            test: {
                src: ['test/**/*.ts'],
                dest: 'test/<%= pkg.name %>-test.js',
                options: {
                    module: 'amd' //or commonjs
                }
            }
        },
        watch: {
          files: ['src/**/*.ts','test/**/*.ts'],
          tasks: ['typescript']
        },
        devserver: {options:{port:8889}, server: {}}
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('default', ['typescript']);

};