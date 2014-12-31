/*global define*/

define(['angular'], function(angular) {
    "use strict";

    var filter = function(VERSION) {
        return function(text) {
            return decodeURIComponent(text);
        };
    };

    filter.$inject = ['VERSION'];
    return filter;
});
