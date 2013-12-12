module.exports = (grunt) ->
    @loadNpmTasks('grunt-contrib-clean')
    @loadNpmTasks('grunt-contrib-concat')
    @loadNpmTasks('grunt-contrib-connect')
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-uglify')
    @loadNpmTasks('grunt-contrib-watch')
    @loadNpmTasks('grunt-release')
    @loadNpmTasks('grunt-ngmin')
    @loadNpmTasks('grunt-protractor-runner')

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
                tasks: ['build', 'protractor']

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

    @registerTask 'default', ['test']
    @registerTask 'build', ['clean', 'jshint', 'concat', 'ngmin', 'uglify']
    @registerTask 'package', ['build', 'release']
    @registerTask 'test', ['build', 'connect:e2e', 'protractor', 'watch:all']
    @registerTask 'ci', ['build', 'connect:e2e', 'protractor']
