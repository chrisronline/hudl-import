(function() {
  'use strict';

  // Need a global method to handle acknowledging that
  // the google client has loaded
  window.OnLoadCallback = function() {
    angular.element(document.body).injector().get('GoogleService').init();
  };

  /**
   * Serves as a way to interact with the google client api
   */
  function GoogleService($q) {
    var service = {};

    // A queue of functions to execute once the
    // google client library is ready
    var readyQueue = [];

    var clientId = '45117185497-phoi4l1lpk872mbu5kj3rv69cb60a1pa.apps.googleusercontent.com';
    var apiKey = 'AIzaSyB3HBKYcU0mlvbG3Z1KSoERH6qlKZrR8zM';
    // Need plus.login to get the logged in user's name (seems weird)
    var scopes = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/plus.login';

    // Generically handles an auth response (either from an auth lookup or request)
    // and handles loading the necessary libraries and the user information
    function handleAuthorizeResponse(result) {
      if (result.status && result.status.signed_in) {
        return $q.all([gapi.client.load('youtube', 'v3'), gapi.client.load('plus', 'v1')])
          .then(function() {
            return $q.when(gapi.client.plus.people.get({userId: 'me'}))
              .then(function(response) {
                return response.result;
              });
          });
      }
      return $q.reject();
    }

    service.init = function() {
      gapi.client.setApiKey(apiKey);
      while (readyQueue.length) readyQueue.shift()();
    };

    service.check = function() {
      return $q.when(gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}))
        .then(handleAuthorizeResponse);
    };

    service.authorize = function() {
      return $q.when(gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}))
        .then(handleAuthorizeResponse);
    };

    service.findVideos = function(query) {
      // https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.search.list
      return $q.when(gapi.client.youtube.search.list({part: 'snippet', forMine: true, type: 'video', q: query, maxResults: 50 }))
        .then(function(response) {
          return _(response.result.items)
            // It is apparently possible for this search to return id-less
            // video objects but we do not want to deal with those
            .reject(function(item) {
              return _.isUndefined(item.id.videoId);
            })
            // Remap the snippet to include the id and a reference to the url
            .map(function(item) {
              return _.extend(item.snippet, { id: item.id.videoId, url: 'http://youtube.com/watch?v=' + item.id.videoId });
            })
            .value();
        });
    };

    service.isReady = function() {
      return !!gapi.client;
    };

    service.whenReady = function() {
      var deferred = $q.defer();
      readyQueue.push(deferred.resolve);
      return deferred.promise;
    };

    return service;
  }

  angular.module('hudl')
    .factory('GoogleService', GoogleService);

})(angular);