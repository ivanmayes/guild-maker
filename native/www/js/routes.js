/*global define, require */

define( ['app'], function(app) {
    'use strict';

    app.config( ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state( 'prelogin', {
                    url: '/prelogin',
                    templateUrl: 'templates/prelogin.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                } )
                .state( 'login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                } )
                .state( 'home', {
                    url: '/home',
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl',
                    authenticate: true
                } )
                .state( 'signup', {
                    url: '/signup',
                    templateUrl: 'templates/signup.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                } )
                .state( 'roleSelect', {
                    url: '/roleselect',
                    templateUrl: 'templates/roleselect.html',
                    controller: 'LoginCtrl',
                    authenticate: true
                } )
                .state( 'search', {
                    url: '/search',
                    templateUrl: 'templates/search.html',
                    controller: 'SearchCtrl',
                    authenticate: false
                } )
                .state( 'schools/teams', {
                    url: '/schools/:schoolId',
                    templateUrl: 'templates/school-teams.html',
                    controller: 'SchoolCtrl',
                    authenticate: false
                } )
                .state( 'fav', {
                    url: '/fav',
                    templateUrl: 'templates/favorite-teams.html',
                    controller: 'FavoriteTeamsCtrl',
                    authenticate: true
                } )
                .state( 'team', {
                    url: '/team',
                    templateUrl: 'templates/team.html',
                    controller: 'TeamCtrl',
                    authenticate: true
                } )
                .state( 'game', {
                    url: '/game',
                    templateUrl: 'templates/game/game.html',
                    controller: 'GameCtrl',
                    authenticate: true
                } )
                .state( 'scores', {
                    url: '/scores',
                    templateUrl: 'templates/scores/scores.html',
                    controller: 'ScoresCtrl',
                    authenticate: true
                } )
                .state( 'divisions', {
                    url: '/scores.divisions',
                    templateUrl: 'templates/scores/divisions.html',
                    controller: 'ScoresCtrl',
                    authenticate: true
                } )
                .state( 'settings', {
                    url: '/settings',
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsCtrl',
                    authenticate: true
                } );
            /*.state('tab.pet-detail', {
                url: '/pet/:petId',
                views: {
                    'fav-tab': {
                        templateUrl: 'templates/pet-detail.html',
                        controller: 'PetDetailCtrl'
                    }
                }
            })*/

            $urlRouterProvider.otherwise( '/prelogin' );

    }] );


} );
