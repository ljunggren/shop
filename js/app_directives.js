(function() {
var app = angular.module('app-directives', []);
  app.directive("appHead", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "app/appHead.html?"+appUtil.appVersion
    };
  });
  app.directive("appFooter", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "app/appFooter.html?"+appUtil.appVersion
    };
  });
  app.directive("appDetail", function() {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: "modules/phone/details.html?"+appUtil.appVersion
    };
  });
})();
