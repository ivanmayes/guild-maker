/*global define */

define(['angular'], function(angular) {
    'use strict';

    return angular.module('app.config', [])
        .constant('VERSION', '0.1')
        .constant('API_VERSION', '1')
        .constant('API_URL', 'http://127.0.0.1:8180/v1/');

});
