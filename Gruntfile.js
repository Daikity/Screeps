const dotenv = require('dotenv');
const matchdep = require('matchdep');
const mergeFiles = require('./grunt-scripts/mergeFiles');
dotenv.config()

module.exports = (grunt) => {
    matchdep.filterAll(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
    mergeFiles(grunt);


    grunt.initConfig({
      copy:      {
        main: {
          expand:  true,
          flatten: true,
          filter:  'isFile',
          cwd:     'dist/',
          src:     '**',
          dest:    'Update This Path'
        },
      },
      screeps: {
        options: {
          email: process.env.SCREEPS_EMAIL,
          token: process.env.SCREEPS_TOKEN,
          branch: process.env.SCREEPS_BRANCH,
          // server: 'season'
        },
        dist: {
          src: ['dist/*.js']
        }
      },
      watch: {
        scripts: {
          files: ['src/main.js'],
          tasks: ['main'],
        },
      }
    });

    grunt.registerTask('main', ['merge', 'write']);
    grunt.registerTask('sandbox', ['merge', 'write-private']);
    grunt.registerTask('merge', 'mergeFiles');
    grunt.registerTask('write', 'screeps');
    grunt.registerTask('write-private', 'copy');
}
