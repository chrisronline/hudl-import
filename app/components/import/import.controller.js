(function() {
  'use strict';

  function ImportRoute($routeProvider) {
    $routeProvider
      .when('/import', {
        templateUrl: 'components/import/import.html',
        controller: 'ImportCtrl'
      });
  }

  function ImportCtrl($scope, ImportService) {
    // The default step
    $scope.step = 1;

    // Indicates if we are currently searching for a video
    $scope.searching = false;

    // Function used to search for videos
    // It has a debounce set to 500ms to prevent
    // multiple requests while the user is typing
    $scope.search = _.debounce(function() {
      // Reset the list of videos to avoid user confusion
      $scope.videos = [];

      // Mark that we are searching
      $scope.searching = true;

      ImportService.findVideos($scope.query)
        .then(function(videos) {
          $scope.videos = videos;
        })
        .finally(function() {
          // Ensure we always reset this to false
          $scope.searching = false;
        });
    }, 500);

    $scope.add = function(video) {
      video._added = true;
    };
    $scope.remove = function($event, video) {
      // The remove button is nested within the video element which has a ng-click
      // attached - when we remove, we want to prevent a readdition immediately
      // so call 'stopPropagation' to prevent the add handler from firing
      $event.stopPropagation();
      video._added = false;
    };

    function handleAuth(promise) {
      // Mark that we are authenticating
      $scope.authenticating = true;
      promise
        .then(function(user) {
          $scope.authed_user = user;
          $scope.step = 2;
        })
        .finally(function() {
          // Ensure we always reset this to false
          $scope.authenticating = false;
        });
    }

    $scope.authenticate = function() {
      handleAuth(ImportService.authenticate());
    };

    $scope.checkAuth = function() {
      handleAuth(ImportService.isAuthenticated());
    };

    // Check by default
    $scope.checkAuth();
  }

  angular.module('hudl')
    .controller('ImportCtrl', ImportCtrl)
    .config(ImportRoute);

})(angular);