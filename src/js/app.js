angular.module('roupApp', ['roupApp.controllers', 'roupApp.services', 'ionic', 'firebase', 'checklist-model', 'ionic.contrib.ui.cards'])
//set constant variable for firebase url
.constant('FBURL', 'https://roup.firebaseio.com')

.run(['loginService', '$rootScope', 'FBURL', function(loginService, $rootScope, FBURL){
  // establish authentication variable
  $rootScope.auth = loginService.init('/');
  $rootScope.FBURL = FBURL;
}])

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  /* Login and Signup */
  .state('connect',{
    url: '/',
    controller: 'ConnectCtrl',
    templateUrl: 'templates/connect.html'
  })
  .state('welcome', {
    url: '/welcome/:firstName',
    controller: 'WelcomeCtrl',
    templateUrl: 'templates/connect.welcome.html'
  })
  .state('home', {
    url:'/home',
    templateUrl: 'templates/home.html'
  })

  .state('questionitem', {
    url: '/questions',
    templateUrl: 'templates/questions.item.html'
  })


  /* Account */
  .state('account', {
    url: '/account',
    controller: 'AccountCtrl',
    templateUrl: 'templates/account.html'
  })
  .state('feedback', {
    url: '/feedback',
    controller: 'AccountCtrl',
    templateUrl: 'templates/feedback.html'
  })

  $urlRouterProvider.otherwise("/");
});
