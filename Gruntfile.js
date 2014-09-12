module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-bump");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-ng-annotate");
    grunt.loadNpmTasks("grunt-protractor-runner");
    grunt.loadNpmTasks("grunt-sauce-tunnel");
    grunt.loadNpmTasks("grunt-shell");

    grunt.initConfig({
        config: {
            name: "angular-select2",
            e2ePort: 9000
        },

        jshint: {
            lib: {
                options: {
                    jshintrc: ".jshintrc"
                },
                files: {
                    src: ["*.js", "src/**.js"]
                }
            },
            test: {
                options: {
                    jshintrc: ".jshintrc-test"
                },
                files: {
                    src: ["test/**/*.js"]
                }
            }
        },

        jscs: {
            lib: {
                options: {
                    config: ".jscs.json"
                },
                files: {
                    src: ["*.js", "src/**/*.js", "test/**/*.js"]
                }
            }
        },

        concat: {
            dist: {
                files: {
                    "dist/<%= config.name %>.js": ["src/*.js"]
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    "dist/<%= config.name %>.min.js": "dist/<%= config.name %>.js"
                }
            }
        },

        clean: {
            all: ["dist"]
        },

        watch: {
            options: {
                livereload: true
            },
            all: {
                files: ["src/**.js", "test/*{,/*}"],
                tasks: ["build", "protractor:dev"]
            }
        },

        ngAnnotate: {
            dist: {
                files: {
                    "dist/<%= config.name %>.js": "dist/<%= config.name %>.js"
                }
            }
        },

        connect: {
            e2e: {
                options: {
                    port: "<%= config.e2ePort %>",
                    hostname: "0.0.0.0",
                    middleware: function (connect) {
                        return [connect["static"](__dirname)];
                    }
                }
            }
        },

        protractor: {
            options: {
                noColor: false
            },
            dev: {
                configFile: "test-config.js",
                options: {
                    keepAlive: true,
                    args: {
                        chromeOnly: true
                    }
                }
            },
            dev_firefox: {
                configFile: "test-config.js",
                options: {
                    keepAlive: true,
                    args: {
                        browser: "firefox"
                    }
                }
            },
            ci: {
                configFile: "test-config.js",
                options: {
                    args: {
                        browser: "firefox"
                    }
                }
            }
        },

        bump: {
            options: {
                files: ["package.json", "bower.json"],
                commitFiles: ["-a"],
                pushTo: "origin"
            }
        },

        shell: {
            protractor_update: {
                command: "./node_modules/.bin/webdriver-manager update",
                options: {
                    stdout: true
                }
            }
        },

        sauce_tunnel: {
            ci: {
                options: {
                    username: process.env.SAUCE_USERNAME,
                    key: process.env.SAUCE_ACCESS_KEY,
                    identifier: process.env.TRAVIS_JOB_NUMBER || "test"
                }
            }
        }
    });

    var browsers = require("open-sauce-browsers")("angular-select2");
    var protractorConfig = grunt.config("protractor");
    var browserTasks = [];
    for (var index = 0; index < browsers.length; index++) {
        var browser = browsers[index];
        protractorConfig["ci_" + index] = {
            configFile: "test-config.js",
            options: {
                args: {
                    sauceUser: process.env.SAUCE_USERNAME,
                    sauceKey: process.env.SAUCE_ACCESS_KEY,
                    capabilities: browser
                }
            }
        };
        browserTasks.push("protractor:ci_" + index);
    }

    grunt.config("protractor", protractorConfig);

    grunt.registerTask("ci_saucelabs", browserTasks);
    grunt.registerTask("default", ["test"]);
    grunt.registerTask("build", ["clean", "jshint", "jscs", "concat", "ngAnnotate", "uglify"]);
    grunt.registerTask("test", ["build", "shell:protractor_update", "connect:e2e", "protractor:dev", "watch:all"]);
    grunt.registerTask("ci", ["build", "shell:protractor_update", "connect:e2e", "protractor:ci"]);
    grunt.registerTask("saucelabs", ["build", "shell:protractor_update", "sauce_tunnel", "connect:e2e", "ci_saucelabs"]);
};
