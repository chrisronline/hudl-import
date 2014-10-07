(function() {
  'use strict';

  /**
   * Serves as the single point of access for import logic
   * Even though this class delegates most of the work to
   * the GoogleService, it exists to serve as a layer between
   * the controller and the implementation - if, in the future,
   * the backend provider for videos changes, the controller needs
   * no updates.
   */
  function ImportService($q, GoogleService) {
    var service = {};

    // The google libraries are loaded async
    // and may not be available when a service
    // method is called but we still want to
    // enable the call and return a promise
    // that will be resolved once the library
    // has been loaded.
    function safeQueue(promise, args) {
      args = _.isArray(args) ? args : [args];
      if (GoogleService.isReady()) {
        return promise.apply(null, args);
      }
      return GoogleService.whenReady()
        .then(function() {
          return promise.apply(null, args);
        });
    }

    service.isAuthenticated = function() {
      return safeQueue(GoogleService.check);
    };

    service.authenticate = function() {
      return safeQueue(GoogleService.authorize);
    };

    service.findVideos = function(query) {
      return safeQueue(GoogleService.findVideos, query);
    };

    return service;
  }

  angular.module('hudl')
    .factory('ImportService', ImportService);

})(angular);