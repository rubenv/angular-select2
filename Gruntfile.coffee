module.exports = (grunt) ->
    @loadNpmTasks('grunt-bump')
    @loadNpmTasks('grunt-contrib-clean')
    @loadNpmTasks('grunt-contrib-concat')
    @loadNpmTasks('grunt-contrib-connect')
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-uglify')
    @loadNpmTasks('grunt-contrib-watch')
    @loadNpmTasks('grunt-ngmin')
    @loadNpmTasks('grunt-protractor-runner')
    @loadNpmTasks('grunt-sauce-tunnel')
    @loadNpmTasks('grunt-shell')

    @initConfig
        config:
            name: 'angular-select2'
            e2ePort: 9000

        jshint:
            lib:
                options:
                    jshintrc: '.jshintrc'
                files:
                    src: ['src/**.js']
            test:
                options:
                    jshintrc: '.jshintrc-test'
                files:
                    src: ['test/*{,/*}.js']

        concat:
            dist:
                files:
                    'dist/<%= config.name %>.js': ['src/prefix', 'src/*.js', 'src/suffix']

        uglify:
            dist:
                files:
                    'dist/<%= config.name %>.min.js': 'dist/<%= config.name %>.js'

        clean:
            all: ['dist']

        watch:
            options:
                livereload: true
            all:
                files: ['src/**.js', 'test/*{,/*}']
                tasks: ['build', 'protractor:dev']

        ngmin:
            dist:
                files:
                    'dist/<%= config.name %>.js': 'dist/<%= config.name %>.js'

        connect:
            e2e:
                options:
                    port: '<%= config.e2ePort %>'
                    hostname: '0.0.0.0'
                    middleware: (connect) ->
                        return [
                            connect.static(__dirname)
                        ]

        protractor:
            options:
                keepAlive: true
                noColor: false
            dev:
                configFile: 'test-config.js'
                options:
                    args:
                        chromeOnly: true
            ci:
                configFile: 'test-config-ci.js'
                options:
                    keepAlive: false
                    args:
                        sauceUser: process.env.SAUCE_USERNAME
                        sauceKey: process.env.SAUCE_ACCESS_KEY

        bump:
            options:
                files: ['package.json', 'bower.json']
                commitFiles: ['-a']
                pushTo: 'origin'

        shell:
            protractor_update:
                command: 'node_modules/protractor/bin/webdriver-manager update'
                options:
                    stdout: true

        sauce_tunnel:
            ci:
                options:
                    username: process.env.SAUCE_USERNAME
                    key: process.env.SAUCE_ACCESS_KEY
                    identifier: process.env.TRAVIS_JOB_NUMBER || 'test'


    @registerTask 'default', ['test']
    @registerTask 'build', ['clean', 'jshint', 'concat', 'ngmin', 'uglify']
    @registerTask 'test', ['build', 'shell:protractor_update', 'connect:e2e', 'protractor:dev', 'watch:all']
    @registerTask 'ci', ['build', 'shell:protractor_update', 'sauce_tunnel', 'connect:e2e', 'protractor:ci']
