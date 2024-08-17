const dotenv = require('dotenv');
dotenv.config()

module.exports = (grunt) => {
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: '**/*.{js,wasm}',
                dest: 'dist/',
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
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.{js,wasm}'],
                        flatten: true
                    }
                ]
            }
        },
        clean: ['dist/*'],
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['clean', 'copy:main', 'clean', 'copy:main', 'screeps'],
            },
        }
    });
}
