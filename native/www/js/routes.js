/*global define, require */

define(['app'], function (app) {
    'use strict';

    app.config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

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
                .state('tab', {
                    url: "/tab",
                    abstract: true,
                    templateUrl: "templates/tabs.html"
                })
                .state('tab.pet-index', {
                    url: '/pets',
                    views: {
                        'pets-tab': {
                            templateUrl: 'templates/pet-index.html',
                            controller: 'PetIndexCtrl'
                        }
                    }
                })
                .state('tab.pet-detail', {
                    url: '/pet/:petId',
                    views: {
                        'pets-tab': {
                            templateUrl: 'templates/pet-detail.html',
                            controller: 'PetDetailCtrl'
                        }
                    }
                })
                .state('tab.adopt', {
                    url: '/adopt',
                    views: {
                        'adopt-tab': {
                            templateUrl: 'templates/adopt.html'
                        }
                    }
                })
                .state('tab.about', {
                    url: '/about',
                    views: {
                        'about-tab': {
                            templateUrl: 'templates/about.html'
                        }
                    }
                });


            $urlRouterProvider.otherwise("/prelogin");

        }]);


});