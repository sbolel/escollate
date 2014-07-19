angular.module('roupApp.controllers', ['roupApp.services', 'firebase', 'ionic'])

.controller('ConnectCtrl', function(firebaseRef, loginService, forgeService, syncData, $rootScope, $scope, $state, $firebase, $location, $timeout, storageService) {

  console.log('CONTROLLER = ConnectCtrl');

  $scope.connectWithProvider = function(provider){
    //switch to check against a list of valid providers
    if(provider == 'google' || provider == 'facebook'){
      loginService.providerLogin(provider, function(err, user){
        if(!err){
          console.log(provider + ' login successful for '+user.uid+'. User object:');
          console.log(user);

          firebaseRef(['accounts', user.uid]).once('value', function(userSnap){
            if(userSnap.val() == null){
              // user does not exist

              // getUserFirstName()
              var firstName = 'undefined';
              if ($rootScope.auth.user) {
                if ($rootScope.auth.user.provider == 'google') { 
                  console.log('google');
                  firstName = $rootScope.auth.user.thirdPartyUserData.given_name;
                } else if ($rootScope.auth.user.provider == 'facebook') {
                  console.log('facebook');
                  firstName = $rootScope.auth.user.thirdPartyUserData.first_name;
                } else {
                  console.error('HomeCtrl: Incorrect provider');
                }
              } else {
                console.error('Auth object not defined in rootScope.');
              }
              // !-- getUserFirstName()

              console.log('Provider account not associated with a user, redirecting to welcome.');
              $state.go('welcome',{firstName: firstName});
            }
            else {
              console.log('user account found for ' + user.displayName)
              // TODO: $state.go('main');
            }
          })
        }
        else{
          console.error('HOMECTLR: Unsuccessful login with ' + provider + '. Error: ' + err);
        }
      })
    }
    else{
      console.error('HOMECTLR: A valid provider must be selected')
    }
  }
})

.controller('WelcomeCtrl', function($scope, $rootScope, $state, $stateParams, loginService, forgeService) {

  console.log('CONTROLLER = WelcomeCtrl');
  $scope.firstName = $stateParams.firstName;

  $scope.createNewUser = function() {
    console.log('First login of this user; Adding '+$rootScope.auth.user.uid+' to Firebase and registering Parse Push.');
    loginService.createProviderProfile($rootScope.auth.user, function(err){
      if(!err){
        console.log("created new profile");
        forgeService.savePushId();
        $state.go('publish');
      }
      else{
        console.error('error in creating profile: ' + err);
      }
    })
  }
})

// .controller('PublishCtrl', function(firebaseRef, forgeService, messagesService, syncData, $rootScope, $scope, $state, $firebase, $location, $timeout, loadRecipients, loadPic, $ionicLoading) {
//   console.log('CONTROLLER = PublishCtrl');
//   $scope.messageTitle = '';
//   $scope.selectedRecipients = [];
//   $scope.recipients = loadRecipients;
//   $rootScope.selectedPicture = loadPic;
//   $scope.sendToRecipients = function() {
//     console.log('MESSAGECTRL: Called sendToRecipients()');
//     if($scope.selectedRecipients.length < 1){
//       // alert('Select a recipient');
//       //debuging working around
//       $state.go('newSent');
//     }
//     else{
//       $ionicLoading.show({template: 'Sending...'});
//         messagesService.sendMessage($scope.messageTitle, loadPic, $scope.selectedRecipients).then(function(){
//           $ionicLoading.hide();
//           $state.go('newSent');
//         });
//     }
//   }
// })

// .controller('OutboxCtrl', function(syncData, forgeService, messagesService, $rootScope, $scope, $state, $firebase, $ionicLoading) {
//   console.log('CONTROLLER = OutboxCtrl');
//   $scope.openOutboxMessage = function(id){
//     console.log('attempting to open message with id: ' + id);
//     $state.go('sentMessage', {messageId:id});
//   }
//   //bind to rootScope variable method
//   $ionicLoading.show({template: 'Loading..'})
//   syncData(['users', $rootScope.auth.user.uid, 'messages', 'sent']).$bind($rootScope, 'outbox').then(function(){
//     console.log('outbox was bound to rootScope:');
//     $ionicLoading.hide();
//   })
//   $scope.nullCheck = function(){
//     if($rootScope.outbox.length < 1){
//       return true
//     }
//     else{
//       return false
//     }
//   }
// })

// .controller('newSentMsgCtrl', function(firebaseRef, forgeService, messagesService, syncData, $rootScope, $scope, $state, $timeout, loadPic, $firebase) {
//   console.log('CONTROLLER = newSentMsgCtrl');
//   $scope.message = {picture: loadPic};
// })

// .controller('SentMsgCtrl', function($rootScope, $scope, $state, $stateParams) {
//   console.log('CONTROLLER = SentMsgCtrl');
//   console.log('loading message with id: ' + $stateParams.messageId);
//   //loading method from rootScope method
//   console.log('message: ' +JSON.stringify($rootScope.outbox.$child($stateParams.messageId)));
//   $scope.message = $rootScope.outbox.$child($stateParams.messageId);
// })

// .controller('InboxCtrl', function(firebaseRef, $rootScope, $scope, $state, syncData, $ionicLoading) {
//     console.log('CONTROLLER = InboxCtrl');
//     $ionicLoading.show({template: 'Loading..'})
//     syncData(['users', $rootScope.auth.user.uid, 'messages', 'inbox']).$bind($rootScope, 'inbox').then(function(){
//       console.log('inbox was bound to rootScope:');
//       $ionicLoading.hide();
//     })
//     $scope.nullCheck = function(){
//       if($rootScope.inbox.length < 1){
//         return true
//       }
//       else{
//         return false
//       }
//     }
// })

// .controller('ReceivedMsgCtrl', function(firebaseRef, $rootScope, $scope, $state, $stateParams, messagesService) {
//   console.log('CONTROLLER = ReceivedMsgCtrl');
//   console.log('loading inbox message with id: ' + $stateParams.messageId);
//   $scope.message = $rootScope.inbox.$child($stateParams.messageId);
//   $scope.bookmarkMessage = function(){
//     //add to bookmark list
//     console.log('RECEIVEDMSGCTRL: bookmarkMessage called');
//     messagesService.respondToMessage($scope.message, 'bookmark').then(function(){
//       console.log('message bookmarked');
//       $state.go('inbox');

//     });

//   }
//   $scope.likeMessage = function(){
//     console.log('RECEIVEDMSGCTRL: likeMessage called');
//     messagesService.respondToMessage($scope.message, 'like').then(function(){
//       console.log('message liked');
//       $state.go('inbox');
//     });
//   }
//   $scope.passMessage = function(){
//     console.log('RECEIVEDMSGCTRL: passMessage called');
//     messagesService.respondToMessage($scope.message, 'pass').then(function(){
//       console.log('message passed');
//       $state.go('inbox');

//     });
//   }
// })

// .controller('BookmarksCtrl', function(firebaseRef, $rootScope, $scope, $state) {
//   console.log('CONTROLLER = BookmarksCtrl');
//   $ionicLoading.show({template: 'Loading..'})
//   syncData(['users', $rootScope.auth.user.uid, 'messages', 'bookmarks']).$bind($rootScope, 'bookmarks').then(function(){
//     console.log('outbox was bound to rootScope:');
//     $ionicLoading.hide();
//   })
//   $scope.openBookmark = function(id){
//     console.log('BOOKMARKSCTRL: openBookmark called');
//     console.log('attempting to open message with id: ' + id)
//     $state.go('bookmarks.message', {messageId:id})
//   }

// })

// .controller('BookmarkedMsgCtrl', function(firebaseRef, $rootScope, $scope, $state) {
//   console.log('CONTROLLER = BookmarkedMsgCtrl');
//   console.log('loading bookmarked message with id: ' + $stateParams.messageId);
//   $scope.message = $rootScope.bookmarks.$child($stateParams.messageId);

// })

.controller('AccountCtrl', ['firebaseRef', 'loginService', '$rootScope', '$scope', 'syncData', '$state', function(firebaseRef, loginService, $rootScope, $scope, syncData, $state) {
  console.log('AccountCtrl');
  $scope.user = $rootScope.userAccount;
  $scope.auth = $rootScope.auth.user;
  $scope.updateProfile = function(){
    console.log('updateProfile called');
    firebaseRef(['users', $scope.auth.user.uid]).update({email: $scope.user.email, name: $scope.user.displayName}, function(err){
      if (err){
        console.log('data not saved');
      }
      else {
        console.log('updated ' + $scope.user.displayName)
      }
    });
  }
  $scope.logout = function() {
    loginService.logout();
  }
  $scope.reset = function() {
    $scope.err = null;
    $scope.msg = null;
  }
}]);
