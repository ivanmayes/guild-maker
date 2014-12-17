/*global define */

define(function(require) {

    'use strict';

    var angular = require('angular'),
        config = require('config'),
        services = angular.module('app.services', ['app.config']);

    services.factory('UserService', require('services/UserService'));
    services.factory('SchoolService', require('services/SchoolService'));

    return services;

});
