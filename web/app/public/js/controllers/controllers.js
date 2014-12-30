/*global define, require */

define(function(require) {

    'use strict';

    var angular = require('angular'),
        services = require('services/services'),
        config = require('config'),
        controllers = angular.module('app.controllers', ['app.services', 'app.config']);

    controllers.controller('AppCtrl', require('controllers/AppCtrl'));
    controllers.controller('DashboardCtrl', require('controllers/DashboardCtrl'));
    controllers.controller('LoginCtrl', require('controllers/LoginCtrl'));
    controllers.controller('ListCtrl', require('controllers/ListCtrl'));
    controllers.controller('PlantCtrl', require('controllers/PlantCtrl'));
    controllers.controller('AddPlantCtrl', require('controllers/AddPlantCtrl'));

    /*controllers.run(['$rootScope', function($rootScope) {
            $rootScope.sampleParam = "value";
    }]);*/

    return controllers;

});
