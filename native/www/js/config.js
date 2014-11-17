/*global define */

define(['angular'], function(angular) {
    'use strict';

    return angular.module('app.config', [])
        .constant('VERSION', '0.1')
        .constant('API_VERSION', '1');

});
