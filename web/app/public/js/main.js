/*global requirejs, document, window, navigator, console */

requirejs.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        uiRouter: '../../bower_components/angular-ui-router/release/angular-ui-router',
        uiBootstrap: '../../bower_components/angular-bootstrap/ui-bootstrap',
        uiBootstrapTemplates: '../../bower_components/angular-bootstrap/ui-bootstrap-tpls'
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
