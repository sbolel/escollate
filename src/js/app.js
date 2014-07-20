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

  /* Main App */
  .state('home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: 'templates/home.html',
  })


  .state('cards', {
      url: '/browse',
      controller: 'CardsCtrl',
      templateUrl: 'templates/browse.html'
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


  // /* Message Creation */
  // .state('publish', {
  //   url: '/publish',
  //   controller: 'PublishCtrl',
  //   templateUrl: 'templates/publish.html',
  // })
  // .state('newSent', {
  //   url: '/new',
  //   controller: 'newSentMsgCtrl',
  //   templateUrl: 'templates/outbox.new.html',
  // })

  // /* Received Messages */
  // .state('inbox', {
  //   url: '/inbox',
  //   controller: 'InboxCtrl',
  //   templateUrl: 'templates/inbox.html'
  // })
  // .state('receivedMessage', {
  //   url: '/inbox/:messageId',
  //   controller: 'ReceivedMsgCtrl',
  //   templateUrl: 'templates/inbox.message.html'
  // })

  //  Sent Messages
  // .state('outbox', {
  //   url: '/outbox',
  //   controller: 'OutboxCtrl',
  //   templateUrl: 'templates/outbox.html'
  // })
  // .state('sentMessage', {
  //   url: '/:messageId',
  //   controller: 'SentMsgCtrl',
  //   templateUrl: 'templates/outbox.message.html'
  // })

  // /* Bookmarked Messages */
  // .state('bookmarks', {
  //   url: '/bookmarks',
  //   controller: 'BookmarksCtrl',
  //   templateUrl: 'templates/bookmarks.html'
  // })
  // .state('bookmarkedMessage', {
  //   url: '/bookmarks/:messageId',
  //   controller: 'BookmarkedMsgCtrl',
  //   templateUrl: 'templates/bookmarks.message.html'
  // })


  $urlRouterProvider.otherwise("/");
});
