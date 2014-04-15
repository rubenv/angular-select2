var config = require('./test-config');
config.multiCapabilities = require('open-sauce-browsers')('angular-select2');
module.exports = config;
