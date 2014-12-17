/*global define, console */

define( function() {
    'use strict';

    function ctrl($scope, $state, $stateParams, UserService, SchoolService) {
        $scope.query = '';
        $scope.schoolsSeen = {};
        $scope.searchResults = [];
        $scope.userQueried = false;
        $scope.selectedSchool = false;

        var access_token = UserService.getAccessToken();
        var betaSchools;

        // Get our beta schools for the initial list
        // TODO: Change this to nearby schools once we have more
        var betaSchoolRequest = SchoolService.getBetaSchools( access_token );
        betaSchoolRequest.then( function(schools) {
            betaSchools = schools;
            $scope.searchResults = schools;
        } );


        // This may need to be modified or optimized once we're pinging the server
        $scope.search = function(query) {

            if (query.length) {
                var getSchools = SchoolService.getSchoolsByQuery( query, access_token );
                getSchools.then( function(searchResults) {
                    $scope.userQueried = true;
                    $scope.searchResults = searchResults;
                    console.log( searchResults );

                }, function(reason) {
                        console.log( 'Failed:', reason );
                        $scope.errorMsg = reason;
                    } );
            } else {
                $scope.userQueried = false;
                $scope.searchResults = betaSchools;
            }


            // When the API is implemented we might want to run this
            // before assigning to the scope var
            // Cache these
            //recordSchoolsSeen($scope.searchResults);

        };

        $scope.selectSchool = function(school) {
            $state.go( 'search/teams', {
                school: school
            } );
        };
    }

    ctrl.$inject = ['$scope', '$state', '$stateParams', 'UserService', 'SchoolService'];
    return ctrl;
} );
