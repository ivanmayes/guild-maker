/*global define, require */

define(['app'], function(app) {
    'use strict';

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('dashboard', {
                    url: "/dashboard",
                    templateUrl: "js/views/dashboard.html",
                    controller: 'DashboardCtrl',
                    authenticate: true
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'js/views/login.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'js/views/signup.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                })
                .state('list', {
                    url: '/list/:listId',
                    params: {
                        list: null
                    },
                    templateUrl: 'js/views/list.html',
                    controller: 'ListCtrl',
                    authenticate: false
                })
                .state('plant', {
                    url: '/plant/:plantId',
                    params: {
                        plant: null,
                        back: ""
                    },
                    templateUrl: 'js/views/plant.html',
                    controller: 'PlantCtrl',
                    authenticate: false
                })
                .state('add-plant', {
                    url: '/add-plant',
                    params: {
                        back: "",
                        list: null
                    },
                    templateUrl: 'js/views/add-plant.html',
                    controller: 'AddPlantCtrl',
                    authenticate: false
                })

            $urlRouterProvider.otherwise("/login");
    }]);


});
