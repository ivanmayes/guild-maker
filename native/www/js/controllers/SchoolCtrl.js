/*global define, console */

define(function() {
    'use strict';

    function ctrl($scope, $state, $stateParams, $ionicPopup, UserService, SchoolService) {
        $scope.teams = [];
        $scope.school = $stateParams.school;
        $scope.selectedTeam;

        var access_token = UserService.getAccessToken();

        // Get teams of schools
        var schoolTeams = SchoolService.getTeamsOfSchool($stateParams.school._id, access_token);
        schoolTeams.then(function(teams) {
            $scope.teams = teams;
        });

        $scope.selectRole = function(team) {
            $scope.selectedTeam = team;

            var myPopup = $ionicPopup.show({
                cssClass: 'roleSelect',
                templateUrl: 'templates/modals/selectRole.html',
                title: 'Follow ' + team.sport + ' - ' + team.level,
                scope: $scope
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
        }

        $scope.followTeam = function(team, role) {
            console.log('Following ', team, role);
        }




    }

    ctrl.$inject = ['$scope', '$state', '$stateParams', '$ionicPopup', 'UserService', 'SchoolService'];
    return ctrl;
});
