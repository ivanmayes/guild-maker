'use strict';

require.config({
	paths : {
		angular : '../bower_components/angular/angular'
	},
	shim : {
		angular : {
			exports : 'angular'
		}
	}
});

require(['angular', 'app', 'controllers/main'], function(angular) {
	angular.bootstrap(document, ['nlmg']);
});