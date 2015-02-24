angular.module('escollateApp', ['ionic', 'firebase', 'escollateApp.services',  'checklist-model', 'escollateApp.directives', 'escollateApp.question'])
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

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  /* Login and Signup */
  .state('app', {
    abstract:true,
    controller:'AppCtrl',
    templateUrl: 'templates/home.html'
  })
  .state('home', {
    parent:'app',
    url:'/',
    views: {
      'questions':{
        templateUrl:'components/question/question-list.html',
        controller:'QuestionCtrl'
      },
      'dash':{
        templateUrl:'components/dash/dash-index.html'
      }
    }
  })
  .state('connect',{
    url: '/login',
    controller: 'ConnectCtrl',
    templateUrl: 'templates/connect.html'
  })
  .state('welcome', {
    url: '/welcome/:firstName',
    controller: 'WelcomeCtrl',
    templateUrl: 'templates/connect.welcome.html'
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
