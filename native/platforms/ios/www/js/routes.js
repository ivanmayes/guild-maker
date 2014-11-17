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
<<<<<<< HEAD
=======
                .state('search', {
                	url: "/search",
                	templateUrl: "templates/search.html",
                	controller: 'SearchCtrl'
                })
>>>>>>> d7982598b571b45a0300d830dd87f6775631377c
                .state('fav', {
                    url: '/fav',
                    templateUrl: 'templates/favorite-teams.html',
                    controller: 'FavoriteTeamsCtrl'
<<<<<<< HEAD
                })
                .state('team', {
                    url: '/team',
                    templateUrl: "templates/team.html"
                })
=======
                })
                .state('team', {
                    url: '/team',
                    templateUrl: "templates/team.html"
                })
>>>>>>> d7982598b571b45a0300d830dd87f6775631377c
                .state('scores', {
                    url: '/scores',
                    templateUrl: 'templates/scores.html'
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
