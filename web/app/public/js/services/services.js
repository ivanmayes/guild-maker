/*global define */

define(function(require) {

    'use strict';

    var angular = require('angular'),
        config = require('config'),
        services = angular.module('app.services', ['app.config']);

    services.factory('UserService', require('services/UserService'));
    services.factory('ListService', require('services/ListService'));
    services.factory('PlantService', require('services/PlantService'));

    return services;

});
