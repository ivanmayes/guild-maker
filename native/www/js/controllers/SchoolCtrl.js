/*global define, console */

define( function() {
    'use strict';

    function ctrl($scope, $state, $stateParams, UserService, SchoolService) {
        $scope.teams = [];
        console.log( 'school', $stateParams.schoolName );

        var access_token = UserService.getAccessToken();

        // Get teams of schools
        var schoolTeams = SchoolService.getTeamsOfSchool( $stateParams.schoolId, access_token );
        schoolTeams.then( function(teams) {
            console.log( 'teams', teams );
            $scope.teams = teams;
        } );


    }

    ctrl.$inject = ['$scope', '$state', '$stateParams', 'UserService', 'SchoolService'];
    return ctrl;
} );
