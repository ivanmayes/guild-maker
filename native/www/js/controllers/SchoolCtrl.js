/*global define, console */

define(function() {
    'use strict';

    function ctrl($scope, $state, $stateParams, $ionicPopover, UserService, SchoolService) {
        $scope.teams = [];
        $scope.school = $stateParams.school;

        var access_token = UserService.getAccessToken();

        // Get teams of schools
        var schoolTeams = SchoolService.getTeamsOfSchool($stateParams.school._id, access_token);
        schoolTeams.then(function(teams) {
            $scope.teams = teams;
        });

        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $ionicPopover.fromTemplateUrl('templates/modals/selectRole.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });


    }

    ctrl.$inject = ['$scope', '$state', '$stateParams', '$ionicPopover', 'UserService', 'SchoolService'];
    return ctrl;
});
