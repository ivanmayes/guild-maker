'use strict';

require.config({
    paths: {
        ionic: '../bower_components/ionic/release/js/ionic.bundle.min'
    },
    shim: {
        ionic: {
            exports: 'ionic'
        }
    }
});

require(['ionic', 'app', 'controllers/main', 'config/routes'], function(ionic) {
    angular.bootstrap(document, ['nlmg']);
});
