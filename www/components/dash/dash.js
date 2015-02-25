angular.module('escollateApp.dash', ['ionic'])

.controller('DashCtrl', function($scope, $rootScope) {
  console.log('CONTROLLER[DashCtrl]');
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