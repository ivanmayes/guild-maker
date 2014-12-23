/*
 * config loader.
 */

var config,
    experimentalConfig,
    _ = require('underscore');

exports.loadConfig = function (configFile) {
    console.log('Loading config file...  ' + configFile);
    // RM - forcing default.json so we don't need different files for each NODE_ENV
    // config = require('../config/' + (process.env.NODE_ENV||'default') + '.json');
    config = require('../config/default.json');
    experimentalConfig = require('../config/experimental.json');

    // add experimental configurations
    _(experimentalConfig.collections).each(function (collection, i) {
        config.collections.push(collection);
    });

    return config;
};
