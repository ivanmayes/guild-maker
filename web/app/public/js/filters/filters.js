/*global define */

define(['angular', 'filters/InterpolateFilter', 'filters/DecodeURI', 'services/services'], function(angular, InterpolateFilter, DecodeURI) {
    'use strict';

    var filters = angular.module('app.filters', ['app.services']);
    filters.filter('interpolate', InterpolateFilter);
    filters.filter('decodeURI', DecodeURI);
    return filters;

});
