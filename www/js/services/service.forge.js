angular.module('roupApp.service.forge', ['firebase', 'roupApp.service.firebase'])

  .factory('forgeService', function($rootScope, $q, firebaseRef, forgeStatus) {
    return{
      status: forgeStatus,
      savePushId: function(){
        if(forgeStatus()){
          //users id doesn't exist
            var deferredId = $q.defer();
            //get pushId
            forge.parse.installationInfo(function(info){
                forge.logging.info("push installation: " + JSON.stringify(info));
                deferredId.resolve(info);
            }, function(err){
                console.log('error in getting push info')
                console.error(err);
                deferredId.reject(err);
            });
            deferredId.promise.then(function(info){
              //check for existance of push id before setting a new one
                console.log('id promise resolved with: ' + info);
                firebaseRef(['users', $rootScope.auth.user.uid, 'pushId'] ).set(info.id, function(err){
                  if(err){
                    console.error('error in saving pushId : '+ err)
                  }
                })
            })
        }
        else {
          //forge doesn't exist
          console.log('Push can not be enabled on this device type')
        }
      },
      setupPush: function(){
        forge.parse.registerForNotifications(function(){
          forge.logging.log('User prompted or accepted to use push notifications');
          console.log('User prompted or accepted to use push notifications');
        }, function(err){
          forge.logging.error('Failed to register for notifications' + JSON.stringify(err));
          console.error('Failed to register for notifications' + JSON.stringify(err));
        })
      },
      changeStatusColor: function(color){
        var deferred = $q.defer();
        var contentColor = 'dark_content'
        if(color == 'white'){
          contentColor = 'light_content'
        }
        else if(color == 'black'){
          contentColor = 'dark_content'

        }
        else{
          console.error('Bar can not be switched to ' + color);
          contentColor = 'dark_content';
        }
        if(forgeStatus()){
          forge.topbar.setStatusBarStyle(contentColor, function(){
            console.log('statusbar text should be ' + color);
            deferred.resolve();
          }, function(err){
            console.log(err);
            deferred.reject();
          })
        }
        else{
          deferred.resolve();
          console.log('There is no topbar color to change the color of');
        }
      }
    }//End of return
  })
.factory('forgeStatus', function(){
  return function forgeStatus(){
      if(typeof forge != 'undefined'){
        return true
      }
      else{
        return false
      }
    }
})
