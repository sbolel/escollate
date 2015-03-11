angular.module('escollateApp')
.controller('SignupCtrl', function($rootScope, $scope, $state, pyroService) {
  console.log('SignupCtrl');
	$scope.signupData = {};
  $scope.err = {};
  $scope.emailSignup = function() {
  	console.log('createAccount called');
    assertValidAccountProps();
    $scope.err = {};
    pyroService.signup($scope.signupData).then(function(userAccount){
      console.log('Signup successful:', userAccount);
      $state.go('home');
    }, function(err){
      console.warn('Signup error:', err.message);
      $scope.err = err;
      if(err.code == 'EMAIL_TAKEN') {
        $scope.signupData.email = null;
      }
    });
  };
    function assertValidAccountProps() {
      if( !$scope.signupData.email ) {
        $scope.err.message = 'Please enter an email address';
      }
      else if( !$scope.signupData.password || !$scope.signupData.confirm ) {
        $scope.err.message = 'Please enter a password';
      }
      else if($scope.signupData.password !== $scope.signupData.confirm ) {
        $scope.err.message = 'Passwords do not match';
        $scope.signupData.password = null;
        $scope.signupData.confirm = null;
      }
      return !$scope.err.message;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.message? err.message : err + '';
    }
})
