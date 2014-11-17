/*global define, require */

define(function(require) {

    'use strict';

    var angular = require('angular'),
        services = require('services/services'),
        config = require('config'),
        controllers = angular.module('app.controllers', ['app.services', 'app.config']);

    controllers.controller('AppCtrl', require('controllers/AppCtrl'));
    controllers.controller('LoginCtrl', require('controllers/LoginCtrl'));
<<<<<<< HEAD
=======
    controllers.controller('SearchCtrl', require('controllers/SearchCtrl'));
>>>>>>> d7982598b571b45a0300d830dd87f6775631377c
    controllers.controller('HomeCtrl', require('controllers/HomeCtrl'));
    controllers.controller('FavoriteTeamsCtrl', require('controllers/FavoriteTeamsCtrl'));
    controllers.controller('ScoresCtrl', require('controllers/ScoresCtrl'));

    controllers.run(['$rootScope', function($rootScope) {
            $rootScope.sampleParam = "value";
    }]);

    return controllers;

});
