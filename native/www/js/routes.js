/*global define, require */

define(['app'], function(app) {
    'use strict';

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('prelogin', {
                    url: "/prelogin",
                    templateUrl: "templates/prelogin.html",
                    controller: 'LoginCtrl'
                })
                .state('login', {
                    url: "/login",
                    templateUrl: "templates/login.html",
                    controller: 'LoginCtrl'
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                })
                .state('signup', {
                    url: "/signup",
                    templateUrl: "templates/signup.html",
                    controller: 'LoginCtrl'
                })
                .state('roleSelect', {
                    url: "/roleselect",
                    templateUrl: "templates/roleselect.html",
                    controller: 'LoginCtrl'
                })
                .state('search', {
                    url: "/search",
                    templateUrl: "templates/search.html",
                    controller: 'SearchCtrl'
                })
                .state('fav', {
                    url: '/fav',
                    templateUrl: 'templates/favorite-teams.html',
                    controller: 'FavoriteTeamsCtrl'
                })
                .state('team', {
                    url: '/team',
                    templateUrl: "templates/team.html",
                    controller: 'TeamCtrl'
                })
                .state('game', {
                    url: '/game',
                    templateUrl: "templates/game/game.html",
                    controller: 'GameCtrl'
                })
                .state('scores', {
                    url: '/scores',
                    templateUrl: 'templates/scores/scores.html',
                    controller: 'ScoresCtrl'
                })
                .state('divisions', {
                    url: '/scores.divisions',
                    templateUrl: 'templates/scores/divisions.html',
                    controller: 'ScoresCtrl'
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsCtrl'
                })
            /*.state('tab.pet-detail', {
                url: '/pet/:petId',
                views: {
                    'fav-tab': {
                        templateUrl: 'templates/pet-detail.html',
                        controller: 'PetDetailCtrl'
                    }
                }
            })*/

            $urlRouterProvider.otherwise("/prelogin");

    }]);


});
