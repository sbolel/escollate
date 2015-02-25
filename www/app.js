angular.module('escollateApp', ['ionic', 'firebase', 'escollateApp.services',  'checklist-model', 'escollateApp.directives','escollateApp.filters', 'escollateApp.question', 'escollateApp.dash'])
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
  .state('home', {
    url:'/app',
    abstract:true,
    templateUrl: 'templates/menu.html',
  })
  .state('questions', {
    parent:'home',
    url: '/questions',
    views:{
      'menuContent':{
        controller: 'QuestionCtrl',
        templateUrl: 'components/question/question-list.html'
      }
    }
  })
  .state('question-new', {
    parent:'home',
    url: '/questions/new',
    views:{
      'menuContent':{
        controller: 'QuestionCtrl',
        templateUrl: 'components/question/question-new.html'
      }
    }
  })
  .state('question', {
    parent:'home',
    url: '/questions/:qId',
    views:{
      'menuContent':{
        templateUrl: 'templates/questions.item.html'
      }
    }
  })
  .state('dash', {
    parent:'home',
    url: '/dash',
    views:{
      'menuContent':{
        controller:'DashCtrl',
        templateUrl: 'components/dash/dash-index.html'
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

  $urlRouterProvider.otherwise("/app/questions");
});
