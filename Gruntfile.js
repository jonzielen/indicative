module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'css/main.min.css': 'css/scss/*.scss'
        }
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: true
      },
      build: {
        src: ['js/src/*.js'],
        dest: 'js/main.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['js/src/*.js'],
        tasks: ['uglify'],
        options: {
          spawn:false
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
