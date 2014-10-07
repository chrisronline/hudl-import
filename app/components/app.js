(function() {
  'use strict';

  function HudlConfig($routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/import' });
  }

  angular.module('hudl', ['ngRoute'])
    .config(HudlConfig);

})(angular);