var appController = angular.module('appSprint', ['app-directives']);

appController.controller('appController', ['$http', function($http){
//  this.pageContext=angular.copy(PageContext).init("home",true);
  
  //operations
  this.requestLogout=function(){
    location.href="login.html";
  }
}]);

