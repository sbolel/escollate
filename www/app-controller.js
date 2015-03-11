angular.module('escollateApp')
.controller('AppCtrl', function($scope){

})


.controller('MenuCtrl', function($ionicTabsDelegate, $scope, $state){
  var tabDelegate = $ionicTabsDelegate.$getByHandle('Main');
  // Logged out buttons
  // $scope.buttons = [
  //   {name:'Signup', state:'connect'},
  //   {name:'Login', state:'login'}
  // ];
  $scope.buttons = [
    {name:'Ask A Question', state:'question-new'},
    {name:'Questions', state:'questions'},
  	{name:'Dashboard', state:'dash'},
  	{name:'Logout', action:'logout'},
  ];
  $scope.clickButton = function(ind) {
  	var button = $scope.buttons[ind];
  	if(button.hasOwnProperty('state')){
  		console.log(button.name + ' clicked. Going to state:', button.state);
  		$state.go(button.state);
  	}
  }
})