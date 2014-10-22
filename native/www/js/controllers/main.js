'use strict';

define(['app', 'services/storage'], function(app) {
	return app.controller('MainController',
		[
			'$scope',
			'$location',
			'storage',
			function MainController($scope, $location, storage) {
				var data = $scope.data = storage.get();
				
				if($location.path() === '') {
					$location.path('/');
				}

				$scope.location = $location;

				/*$scope.$watch('location.path()', function (path) {
					$scope.statusFilter = (path === '/active') ?
						{ completed: false } : (path === '/completed') ?
						{ completed: true } : null;
				});*/

				$scope.greeting = 'Hello!';
			}
		]
	);
});