var appModule = angular.module('app', []);

appModule.controller('HomeCtrl', function($scope) {
    $scope.message = 'Well, hello there!';
});

appModule.controller('AuthCtrl', function($scope) {
    $scope.message = 'Please sign in';
    $scope.hideInitial = function(ev) {
        console.log('WORKED', ev);
        /*var dismissAnimation = new steroids.Animation({
          transition: "flipHorizontalFromRight",
          duration: 1.0,
          curve: "easeInOut"
        });*/

        steroids.initialView.dismiss({
            animation: dismissAnimation
        });
    }
});



/*

var recipeApp = angular.module('recipeApp', ['RecipeModel']);


// Index: http://localhost/views/recipe/index.html

recipeApp.controller('IndexCtrl', function($scope, RecipeRestangular) {
    var showLogin = function showLogin() {
        // var authScreen = new steroids.views.WebView("sign_in.html");
        // steroids.modal.show(authScreen);
    };

    // showLogin();

    // Helper function for opening new webviews
    $scope.open = function(id) {
        webView = new steroids.views.WebView("/views/recipe/show.html?id=" + id);
        steroids.layers.push(webView);
    };

    // Fetch all objects from the local JSON (see app/models/recipe.js)
    RecipeRestangular.all('recipe').getList().then(function(recipes) {
        $scope.recipes = recipes;
    });

    // -- Native navigation
    steroids.view.navigationBar.show("Recipes");

});


// Show: http://localhost/views/recipe/show.html?id=<id>

recipeApp.controller('ShowCtrl', function($scope, $filter, RecipeRestangular) {

    // Fetch all objects from the local JSON (see app/models/recipe.js)
    RecipeRestangular.all('recipe').getList().then(function(recipes) {
        // Then select the one based on the view's id query parameter
        $scope.recipe = $filter('filter')(recipes, {
            recipe_id: steroids.view.params['id']
        })[0];
    });

    // -- Native navigation
    steroids.view.navigationBar.show("Recipe " + steroids.view.params.id);

});
*/
