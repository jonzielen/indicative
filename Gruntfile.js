module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none',
          compass: true
        },
        files: {
          'css/main.min.css': 'css/scss/*.scss'
        }
      }
    },
    uglify: {
      options: {
        compress: true
      },
      regularJS: {
        options: {
          mangle: true
        },
        files: {
          'js/main.min.js':'js/src/*.js'
        }
      },
      app: {
        options: {
          mangle: false
        },
        files: {
          'js/app/controllers/statsController.min.js':'js/app/controllers/statsController.src.js',
          'js/app/factory/statsFactory.min.js':'js/app/factory/statsFactory.src.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['js/src/*.js', 'js/app/**/*.src.js'],
        tasks: ['uglify'],
        options: {
          spawn: false
        },
      },
      sass: {
        files: ['css/scss/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'sass']);

};
