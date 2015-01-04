/*global requirejs, document, window, navigator, console */

requirejs.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        jquery: '../../bower_components/jquery/src/jquery',
        uiRouter: '../../bower_components/angular-ui-router/release/angular-ui-router',
        uiBootstrap: '../../bower_components/angular-bootstrap/ui-bootstrap',
        uiBootstrapTemplates: '../../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        angularGoogleChart: '../../bower_components/angular-google-chart/ng-google-chart'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        uiRouter: {
            deps: ['angular']
        },
        uiBootstrap: {
            deps: ['angular']
        },
        uiBootstrapTemplates: {
            deps: ['angular', 'uiBootstrap']
        },
        angularGoogleChart: {
            deps: ['angular']
        },
        socketIo: {
            deps: ['angular']
        }
    },
    priority: [
        'angular'
    ],
    deps: [
        'bootstrap'
    ]
});
