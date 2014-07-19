angular.module('roupApp.service.login', ['firebase', 'roupApp.service.firebase', 'roupApp.service.forge'])
  .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', '$timeout', 'providerProfileCreator',
    function($rootScope, $firebaseSimpleLogin, firebaseRef, $timeout, providerProfileCreator) {
      var auth = null;
      return {
        init: function() {
          return auth = $firebaseSimpleLogin(firebaseRef());
        },
        /**
         * @param {string} email
         * @param {string} pass
         * @param {Function} [callback]
         * @returns {*}
         */
         //3rd party provider login
         providerLogin: function(provider, callback){
          assertAuth();
          var scopeInfo = 'email';    // set scope
          /* specify for different providers (facebook, google) */
          if(provider == 'google'){
          }
          else if(provider == 'facebook'){
          }
          else{
            console.error('LOGIN_SERVICE: ' + provider + ' is an invaild provider.');
            forge.logging.error('LOGIN_SERVICE: ' + provider + ' is an invalid provider.');
          }
          auth.$login(provider, {
            rememberMe:true,
            scope:scopeInfo
          }).then(function(user){
            if(callback){
              $timeout(function(){
                callback(null, user);
              })
            }
          });
         },
        //email login
        login: function(email, pass, callback) {
          assertAuth();
          auth.$login('password', {
            email: email,
            password: pass,
            rememberMe: true
          }).then(function(user) {
              if( callback ) {
                //todo-bug https://github.com/firebase/angularFire/issues/199
                $timeout(function() {
                  callback(null, user);
                });
              }
            }, callback);
        },
        logout: function() {
          assertAuth();
          auth.$logout();
        },
        changePassword: function(opts) {
          assertAuth();
          var cb = opts.callback || function() {};
          if( !opts.oldpass || !opts.newpass ) {
            $timeout(function(){ cb('Please enter a password'); });
          }
          else if( opts.newpass !== opts.confirm ) {
            $timeout(function() { cb('Passwords do not match'); });
          }
          else {
            auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function() { cb && cb(null) }, cb);
          }
        },
        createAccount: function(email, pass, callback) {
          assertAuth();
          auth.$createUser(email, pass).then(function(user) { callback && callback(null, user) }, callback);
        },
        setUserData: function() {
          console.warn('Called setUserData in loginService');
          return $rootScope.auth.user;
        },
        createProfile: providerProfileCreator,
        createProviderProfile: providerProfileCreator
      };
      function assertAuth() {
        if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
      }
    }])

  .factory('providerProfileCreator', ['firebaseRef', '$timeout', function(firebaseRef, $timeout, $scope) {
    return function(userObj, callback) {
      console.warn(userObj);

      //check for profile picture
      if(userObj.thirdPartyUserData.hasOwnProperty('picture')){
        var userPic = userObj.thirdPartyUserData.picture;
      }
      else{
        var userPic = 'undefined';
      }

      firebaseRef(['users', userObj.uid]).set({
        displayName: userObj.displayName,
        email: userObj.thirdPartyUserData.email,
        picture: userPic,
        provider: userObj.provider}, function(err) {

        if(!err){
          console.log('LOGIN_SERVICE: newUser in Firebase: ' + userObj.uid);
          firebaseRef('names/' + userObj.displayName).set({
            uid:userObj.uid, 
            email: userObj.thirdPartyUserData.email,
            picture: userPic,
            provider: userObj.provider}, function(err){
            if(err){
              console.error('error in push to names: ' + err);
            }
            else{
              console.log('push to names successful');
            }
          });
        }
        else{
          //error in push of account information
          if(callback){
            console.error('error in pushing new profile to users: ' + err);
            callback(err);
          }
        }
      });
    }
  }])
