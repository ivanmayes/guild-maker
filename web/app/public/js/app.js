/*global define, require */

define(['angular',
    'uiRouter',
    'uiBootstrap',
    'uiBootstrapTemplates',
    'angularGoogleChart',
    'config',
    'filters/filters',
    'services/services',
    'directives/directives',
    'controllers/controllers'
], function(angular, uiRouter) {
        'use strict';

        var app = angular.module('app', [
            'app.controllers',
            'app.filters',
            'app.services',
            'app.directives',
            'app.config',
            'ui.bootstrap',
            'ui.router',
            "googlechart"
        ]);

        app.run(function($rootScope, $state, UserService) {

            $rootScope.token = UserService.getAccessToken();
            $rootScope.user = UserService.getUserSettings();

            // Check if Page requires authentication
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
                if (toState.authenticate && !UserService.isLoggedIn()) {
                    // User isn’t authenticated
                    console.log('Not logged in');
                    $state.transitionTo('login');
                    event.preventDefault();

                }
                console.log('Route changed');

            });


        });


        return app;

    });
