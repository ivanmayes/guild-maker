/*global define, console */

define( function() {
    'use strict';

    function ctrl($scope, $state, $stateParams, UserService, SchoolService) {
        $scope.teams = [];
        $scope.school = $stateParams.school;

        var access_token = UserService.getAccessToken();

        // Get teams of schools
        var schoolTeams = SchoolService.getTeamsOfSchool( $stateParams.school._id, access_token );
        schoolTeams.then( function(teams) {
            console.log( 'teams', teams );
            $scope.teams = teams;
        } );


    }

    ctrl.$inject = ['$scope', '$state', '$stateParams', 'UserService', 'SchoolService'];
    return ctrl;
} );
