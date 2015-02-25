angular.module('escollateApp')
.controller('AppCtrl', function($ionicTabsDelegate){
  var tabDelegate = $ionicTabsDelegate.$getByHandle('Main');

})


.controller('MenuCtrl', function($ionicTabsDelegate, $scope, $state){
  var tabDelegate = $ionicTabsDelegate.$getByHandle('Main');
  $scope.buttons = [
  	{name:'Login', state:'login'},
  	{name:'Dashboard', state:'dash'},
  	{name:'Signup', state:'connect'},
  	{name:'Logout', action:'logout'},
  	{name:'Questions', state:'questions'}

  ];
  $scope.clickButton = function(ind) {
  	var button = $scope.buttons[ind];
  	if(button.hasOwnProperty('state')){
  		console.log(button.name + ' clicked. Going to state:', button.state);
  		$state.go(button.state);
  	}
  }
})