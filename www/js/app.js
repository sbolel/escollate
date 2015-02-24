angular.module('roupApp', ['ionic', 'firebase','roupApp.controllers', 'roupApp.services',  'checklist-model', 'roupApp.directives'])
//set constant variable for firebase url
.constant('FBURL', 'https://roup.firebaseio.com')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
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
    controller: 'HomeCtrl',
    templateUrl: 'templates/home.html'
  })

  .state('question', {
    url: '/question',
    controller: 'HomeCtrl',
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
