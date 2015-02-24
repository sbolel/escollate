angular.module('escollateApp.question', ['firebase', 'ionic', 'escollateApp.service.firebase'])

.controller('QuestionCtrl', function(firebaseRef, $rootScope, $scope, $state, $ionicTabsDelegate, $ionicModal, $timeout, $http) {
  console.log('CONTROLLER[QuestionsCtrl]');
  var tabDelegate = $ionicTabsDelegate.$getByHandle('Main');
      $scope.isNull = {};
      $scope.isNull.asks = false;

  firebaseRef('questions').on('value', function(questionsSnap){
    $scope.questions = questionsSnap.val();
    $scope.$apply();
  })
  // firebaseRef(['users', $rootScope.auth.user.uid, 'asks']).on('value', function(questionsSnap){
  //   if(questionsSnap.val() == null){
  //     console.log('null test is correct');
  //     $scope.isNull.asks = true;
  //   }
  //   else{
  //     console.log('null test is wrong')
  //     $scope.asks = questionsSnap.val();
  //     $scope.isNull.asks = false;

  //   }
  // })

  $scope.newQuestion = function() {
    // $state.go('question',section);
    $ionicModal.fromTemplateUrl('question-create-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.openModal();
    });
  }
  $scope.viewQuestion = function(section) {
    // $state.go('question',section);
    $scope.selected = section;
    $ionicModal.fromTemplateUrl('question-view-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.openModal();
    });
  }
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.againstMarket = function (market, business) {
      if(market<=business){
          return {color: "green"};
      } else {
          return {color: "red"};
      }
  };
  $scope.trend = function (businessData) {
      var last = businessData[businessData.length];
      var penultimate = businessData[businessData.length - 1];
      if (last <= penultimate) {
          return 'ion-arrow-down-b';
      } else {
          return 'ion-arrow-up-b';
      }
  }
  $scope.data;
  $scope.oldMarket;
  $http.get('./dataModel.json').success(function(data){
	  console.log(data);
	  $scope.data = data;
	  $scope.oldMarket = data;
	});


  $scope.submitQuestion = function(){
    // console.log('submitQuestion run with ' + JSON.stringify({author:{uid:$rootScope.auth.user.uid, displayName: $rootScope.auth.user.displayName}, title: $scope.qTitle, description: $scope.qDescription}))
    $scope.closeModal();
    firebaseRef(['questions']).push({author:{uid:$rootScope.auth.user.uid, displayName: $rootScope.auth.user.displayName}, title: $scope.qTitle, description: $scope.qDescription, view_count:_.random(1,99), response_count:_.random(1,99)}, function(err){
      if(!err){
        console.log('questions list push successful');
        firebaseRef(['users', $rootScope.auth.user.uid, 'asks']).push({author:{uid:$rootScope.auth.user.uid, displayName: $rootScope.auth.user.displayName}, title: $scope.qTitle, description: $scope.qDescription, view_count:0, response_count:0}, function(err){
          if(!err){
            console.log('personal asks list push successful');
          }
        })
      }
    })
  }
})


.factory('questionService', ['$rootScope', 'firebaseRef', '$q', '$timeout', 'syncData', 'storageService', '$state',
  function($rootScope, firebaseRef, $q, $timeout, syncData, storageService, $state) {
    return {
      sendMessage: function(title, picture, recipientsArray){
        console.log('MESSAGES SERVICE: sendMessage called: ');
        var parentDeferred = $q.defer();
        function base64Convert(picture){
          var deferred = $q.defer();
          if(typeof forge != 'undefined'){
            console.log('converting to base64');
            //[TODO] Wrap in timeout if using || for uri/base64 (uri doesn't work after reboot)
              forge.file.base64(picture, function(base64){
                picture.base64 = base64;
                console.log('conversion successful')
                deferred.resolve(picture);
              }, function(err){
                console.error(err);
                deferred.reject(err);
              })
          }
          else{
            console.error('Can not do base64 conversion without forge');
            deferred.reject();
          }
          return deferred.promise;
        }
        function saveToOutbox(basePic){
          console.log('adding message to outbox..');
          var deferredSave = $q.defer();
          var messageObj = {
            title: title,
            picture: basePic,
            recipients: recipientsArray,
            time: Date.now()
          };
          // rootScope.outbox is bound, so adding item updates fb
          var pushObj = firebaseRef(['users', $rootScope.auth.user.uid, 'messages', 'outbox']).push(messageObj, function(err){
            if(err){
              console.error('Error saving to personal outbox.');
              deferredSave.reject(err);
            }
            else {
              console.log('message saved to outbox');
              messageObj.parentId = pushObj.name();
              deferredSave.resolve(messageObj);
            }
          })
          return deferredSave.promise;
        }
        function sendToRecipient(recipient, message){
          console.log('sendToRecipient called for ' + recipient);
          var deferred = $q.defer();
          //remove recipients parameter from message
          delete message.recipients
          //add information about author
          message.author = {
            uid:$rootScope.auth.user.uid,
            displayName:$rootScope.auth.user.displayName
          }
          console.log('MsgObj: ' + message);
          firebaseRef(['users', recipient, 'messages','inbox']).push(message, function(err){
            console.log('message sent to: ' + recipient);
            deferred.resolve('success');
            if(err){
              console.error('Error sending to ' + recipient + ', error: ' + err);
              deferred.reject(err);
            }
            else{
              // console.log('message sent to: ' + recipient);
              // deferred.resolve('success');
            }
          })
          return deferred.promise;
        }
        function backgroundRecipientSend(parentMsgId){
          console.log('backgroundRecipientSend called');
          var deferred = $q.defer();
          // Closures to track the resulting collection as it's built and the iteration index
          var resultCollection = [], index = 0;
          function enQueueNext() {
              $timeout(function () {
                  // Process the element at "index"
                  resultCollection.push(sendToRecipient(recipientsArray[index], parentMsgId));

                  index++;
                  if (index < recipientsArray.length)
                      enQueueNext();
                  else
                  {
                      // We're done; resolve the promise
                      deferred.resolve(resultCollection);
                  }
              }, 0);
          }
          // Start off the process
          enQueueNext();
          return deferred.promise;
        }
        base64Convert(picture).then(function(basePic){
          return basePic
        }).then(function(basePic){
          return saveToOutbox(basePic);
        }).then(function(parentMsgId){
          return backgroundRecipientSend(parentMsgId);
        }).then(function(resultsArray){
          console.log('all send promises resolved with results: ' + JSON.stringify(resultsArray));
          parentDeferred.resolve();
        })
        return parentDeferred.promise;
    },
      respondToMessage: function(message, responseType, responseContent){
        console.log('MESSAGE SERVICE: respond to message called');
        if(responseType == 'like' || responseType == 'pass' || responseType == 'bookmark'){
          console.log('passed if');
          var parentDeferred = $q.defer();
          $q.all([addToLocation(responseType), sendResponseToAuthor(), removeReceviedMessage()]).then(function(){
          //add to new folder, add response to author's copy, remove from received

            console.log('all completed');
            parentDeferred.resolve();

          })
            return parentDeferred.promise;


        }
        else{
          console.error('invalid responseType called: ' + responseType);
        }
        function removeReceviedMessage(){
          //remove from recevied
          var deferredDelete = $q.defer();
          console.log('removing message with id ' + message.$id +' from personal recevied');
          syncData(['users', $rootScope.auth.user.uid, 'messages','inbox', message.$id]).$remove().then(function(){
            console.log('message removed from recevied folder ');
            deferredDelete.resolve();
          })
          // firebaseRef(['users', $rootScope.auth.user.uid, 'messages','inbox', message.$id]).remove(function(err){
          //   console.log('message removed from recevied folder ');
          //   deferredDelete.resolve();
          //   if(err){
          //     console.error('error removing from personal recevied folder');
          //     deferredDelete.reject();
          //   }
          //   else{
          //     // console.log('message removed from recevied folder ');
          //     // deferredDelete.resolve();
          //   }
          // });
          // $rootScope.inbox.child(message.$id).$remove().then(function(){
          //   deferredDelete.resolve();
          // })
          return deferredDelete.promise;
        }
        function sendResponseToAuthor(){
          var deferredResponse = $q.defer();
          console.log('sending response of ' + responseType + ' to ' + message.author.displayName);
          //[TODO] Figure out method of posting reponse that does not write to someone another users user object (message.parentId). Realationship through server watch function?
          //[TODO] Use actual names for response folders instead of just reponseType
          var responseObj = {
            createdAt:Date.now(),
            author:{
              uid:$rootScope.auth.user.uid,
              displayName: $rootScope.auth.user.displayName
            }
          }
          console.log('sending ' + responseType + ': ' +JSON.stringify(responseObj) + ' to ' + message.author.displayName + '('+ message.author.uid+')' );
          firebaseRef(['users', message.author.uid, 'messages', 'outbox', message.parentId,'responses', responseType]).push(responseObj, function(err){
            if(err){
              console.error('error sending response to author: ' + err);
            }
            else{
              console.log(responseType + ' was sent to the message author');
              deferredResponse.resolve();
            }
          });
          return deferredResponse.promise;
        }
        function addToLocation(location){
          var deferred = $q.defer();
          console.log('adding message with id ' + message.$id + ' to the ' + location + ' folder');
          syncData(['users', $rootScope.auth.user.uid, 'messages', location]).$add(message).then(function(ref){
            console.log('message added to ' + location);
            deferred.resolve();
          })
          // firebaseRef(['users', $rootScope.auth.user.uid, 'messages', location]).push(message, function(ref){
          //
          // });
          return deferred.promise;
        }
      }
    } // !-- return()
  }])
