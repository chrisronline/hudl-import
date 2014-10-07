(function() {
  'use strict';

  function FocusTrigger() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        $attrs.$observe('focusTrigger', function(newValue) {
          if (newValue === 'true') {
            $element[0].focus();
          }
        });
      }
    };
  }

  angular.module('hudl')
    .directive('focusTrigger', FocusTrigger);

})(angular);