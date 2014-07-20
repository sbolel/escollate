angular.module('roupApp.controllers', ['roupApp.services', 'firebase', 'ionic'])

.controller('ConnectCtrl', function(firebaseRef, loginService, forgeService, syncData, $rootScope, $scope, $state, $firebase, $location, $timeout, storageService) {
  console.log('CONTROLLER[ConnectCtrl]');
  $scope.connectWithProvider = function(provider){
    //switch to check against a list of valid providers
    if(provider == 'google' || provider == 'facebook'){
      loginService.providerLogin(provider, function(err, user){
        if(!err){
          console.log(provider + ' login successful for '+user.uid+'. User object:');
          firebaseRef(['accounts', user.uid]).once('value', function(userSnap){
            if(userSnap.val() == null){     // user does not exist
              /* getUserFirstName(): */
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
              console.log('Provider account not associated with a user, redirecting to welcome.');
              $state.go('welcome',{firstName: firstName});
            } else {
              console.log('user account found for ' + user.displayName)
              $state.go('home');
            }
          })
        } else{
          console.error('HOMECTLR: Unsuccessful login with ' + provider + '. Error: ' + err);
        }
      })
    } else{
      console.error('HOMECTLR: A valid provider must be selected')
    }
  }
})

.controller('WelcomeCtrl', function($scope, $rootScope, $state, $stateParams, loginService, forgeService) {
  console.log('CONTROLLER[WelcomeCtrl]');
  $scope.firstName = $stateParams.firstName;
  $scope.createNewUser = function() {
    console.log('First login of this user; Adding '+$rootScope.auth.user.uid+' to Firebase and registering Parse Push.');
    loginService.createProviderProfile($rootScope.auth.user, function(err){
      if(!err){
        console.log("created new profile");
        forgeService.savePushId();
        $state.go('home');
      } else{
        console.error('error in creating profile: ' + err);
      }
    })
  }
})


.controller('HomeCtrl', function(firebaseRef, forgeService, syncData, $rootScope, $scope, $state, $firebase, $location, $timeout, $ionicLoading) {
  console.log('CONTROLLER[HomeCtrl]');

})


.controller('DashCtrl', function(firebaseRef, forgeService, syncData, $rootScope, $scope, $state, $firebase, $location, $timeout, $ionicLoading) {
  console.log('CONTROLLER[DashCtrl]');

})


.controller('QuestionsCtrl', function(firebaseRef, forgeService, syncData, $rootScope, $scope, $state, $firebase, $location, $timeout, $ionicLoading) {
  console.log('CONTROLLER[QuestionsCtrl]');

})


.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate, $rootScope) {
  console.log('CONTROLLER[CardsCtrl]');
  $rootScope.accepted = 0;
  $rootScope.rejected = 0;
  var cardCount = 0;
  var cardTypes = [
    { title: 'Mid-Century Puzzle Solver', image: 'https://dl.dropboxusercontent.com/s/44pkexr08hp14lg/chair1.jpg' },
    { title: 'Clean, Classic Eames Chair', image: 'https://dl.dropboxusercontent.com/s/mzzadz5zz4e8or8/chair2.jpg' },
    { title: 'Serious Arm Chair. No Kidding.', image: 'https://dl.dropboxusercontent.com/s/sukm6n2cimigm1g/chair3.jpg' },
    { title: 'Cheerful Chair', image: 'https://dl.dropboxusercontent.com/s/x4duj48krtsjtb1/chair4.jpg' },
    { title: '3 Ottomans. 30 bucks', image: 'https://dl.dropboxusercontent.com/s/k3bj926xf55fb0r/ottomans.jpg' }
  ];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    if (this.swipeCard.positive === true) {
      $scope.$root.accepted++;
    } else {
      $scope.$root.rejected++;
    }
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[cardCount];
    cardCount++;
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})


.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate, $rootScope) {
  console.log('CONTROLLER[CardCtrl]');
  $scope.accept = function () {
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    $rootScope.accepted++;
    card.swipe(true);
  }
  $scope.reject = function() {
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    $rootScope.rejected++;
    card.swipe();
  };
})


.controller('AccountCtrl', ['firebaseRef', 'loginService', '$rootScope', '$scope', 'syncData', '$state', function(firebaseRef, loginService, $rootScope, $scope, syncData, $state) {
  console.log('CONTROLLER[AccountCtrl]');
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
  $scope.sendFeedback = function(){
    console.log('sendFeedback called');
    var time = Date.now();
    firebaseRef(['feedback']).push({user:{uid:$rootScope.auth.user.uid, email: $rootScope.auth.user.email, name: $rootScope.auth.user.displayName}, content:$scope.feedbackContent, createdAt: time}, function(err){
      if (err){
        console.log('data not saved');
      }
      else {
        console.log('updated ' + $rootScope.auth.user.displayName)
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
