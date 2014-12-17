/*global define, require */

define( function(require) {

    'use strict';

    var angular = require( 'angular' ),
        services = require( 'services/services' ),
        config = require( 'config' ),
        controllers = angular.module( 'app.controllers', ['app.services', 'app.config'] );

    controllers.controller( 'AppCtrl', require( 'controllers/AppCtrl' ) );
    controllers.controller( 'LoginCtrl', require( 'controllers/LoginCtrl' ) );
    controllers.controller( 'SearchCtrl', require( 'controllers/SearchCtrl' ) );
    controllers.controller( 'HomeCtrl', require( 'controllers/HomeCtrl' ) );
    controllers.controller( 'FavoriteTeamsCtrl', require( 'controllers/FavoriteTeamsCtrl' ) );
    controllers.controller( 'ScoresCtrl', require( 'controllers/ScoresCtrl' ) );
    controllers.controller( 'TeamCtrl', require( 'controllers/TeamCtrl' ) );
    controllers.controller( 'GameCtrl', require( 'controllers/GameCtrl' ) );
    controllers.controller( 'SettingsCtrl', require( 'controllers/SettingsCtrl' ) );
    controllers.controller( 'SchoolCtrl', require( 'controllers/SchoolCtrl' ) );

    /*controllers.run(['$rootScope', function($rootScope) {
            $rootScope.sampleParam = "value";
    }]);*/

    return controllers;

} );
