angular.module('escollateApp')
.controller('LoginCtrl', function($scope, $state, $rootScope, pyroService) {
  console.log('LoginCtrl');
  $scope.loginData = {};
  $scope.login = function() {
    console.log('[LoginCtrl] Login called:');
    pyroService.loginPromise($scope.loginData).then(function(userData){
      console.log('login successful:', userData);
      $state.go('home');
    }, function(err){
      $scope.err = err;
      console.error('[LoginCtrl] Error Logging In:', err);
    });
  };
})
