/*global define, console */

define(function() {
    'use strict';

    function ctrl($scope, $state) {
        $scope.query = '';
        $scope.schoolsSeen = {};
        $scope.searchResults = [];
        $scope.userQueried = false;

        /*
        // TODO:
        // --get user location
        // --query for schools within 50 miles
        // --seed data into searchResults
        $http.get('someurl').success(function(data) {
            $scope.searchResults = JSON.parse(data);
        });
        */

        // SIMULATE nearby schools
        var localSchools = [
            {
                name: 'Fayetteville',
                id: 1
            },
            {
                name: 'Springdale',
                id: 2
            },
            {
                name: 'Rogers',
                id: 3
            },
            {
                name: 'Bentonville',
                id: 4
            }
        ];

        // Cache these
        recordSchoolsSeen(localSchools);
        // Add to display list
        $scope.searchResults = localSchools;

        // This may need to be modified or optimized once we're pinging the server
        $scope.search = function(query) {
            // SIMULATE getting results from server
            if (query.length) {

                /*
                $http.get('someurl').success(function(data) {
                    $scope.searchResults = JSON.parse(data);
                });
                */

                $scope.userQueried = true;
                $scope.searchResults = [
                    {
                        name: 'Fayetteville',
                        id: 1
                    },
                    {
                        name: 'Springdale',
                        id: 2
                    },
                    {
                        name: 'Rogers',
                        id: 3
                    },
                    {
                        name: 'Bentonville',
                        id: 4
                    },
                    {
                        name: 'Little Rock',
                        id: 5
                    },
                    {
                        name: 'Ft. Smith',
                        id: 6
                    },
                    {
                        name: 'Harrison',
                        id: 7
                    },
                    {
                        name: 'Mountain Home',
                        id: 8
                    },
                    {
                        name: 'Pine Bluff',
                        id: 9
                    }
                ];

                // When the API is implemented we might want to run this
                // before assigning to the scope var
                // Cache these
                recordSchoolsSeen($scope.searchResults);
            } else {
                $scope.userQueried = false;
                $scope.searchResults = localSchools;
            }
        }

        // Cache all the schools we encounter locally
        function recordSchoolsSeen(schools) {
            for (var s in $scope.searchResults) {
                $scope.schoolsSeen[$scope.searchResults[s].id] = $scope.searchResults[s];
            }
        }

        $scope.selectSchool = function(id) {
            alert($scope.schoolsSeen[id].name);
        }
    }

    ctrl.$inject = ['$scope', '$state'];
    return ctrl;
});
