angular.module('roupApp.service.storage', ['firebase', 'roupApp.service.firebase'])

  .factory('storageService', ['$rootScope', 'firebaseRef', '$q', '$timeout', 'syncData', 'forgeService',
    function ($rootScope, firebaseRef, $q, $timeout, syncData, forgeService) {
      //new vars and functions
      var storageObject = {};
      storageObject.pics = [];
      var prefsArray = [];
      function loadStorageObject (name){
        if(_.contains(storageObject, name)){
          return storageObject[name]
        }
        else{
          return null
        }
      }
      function getPrefKeys(){
        var deferred = $q.defer();
        if(prefsArray.length < 1){
          forge.prefs.keys(function (keysArray) {
            //resolve for null?
            console.log('Current prefs: ');
            console.log(keysArray);
            prefsArray = keysArray;
            deferred.resolve(keysArray);
          }, function(err){
            forge.logging.error(err);
            deferred.reject(err)
          });
        }
        else{
          //getPrefs has already been run, so we know what prefs there were (watch out for new ones?)
          deferred.resolve(prefsArray);
        }
        return deferred.promise
      }
      //old vars
      var prefs = {};
      var localPictures = [];
      return {
        //New Storage Method
        getPrefs: function(){
          if(forgeService.status()){
            return getPrefKeys()
          }
          else{
            console.log('no preferences enabled for this device');
          }
        },
        bindPics: function(){
          if(forgeService.status()){
            if(loadStorageObject('pics') != null){
              console.log('returning storage object ')
              return loadStorageObject('pics');
            }
            else{
              console.log('no pictures in storage to bind to')
              return [];
            }
          }
          else{
            console.log('can not bind local pictures on this platform')
          }
        },
        loadPref: function (prefName) {
          //get all user preferences from forge prefs and set appropriate variables
          //should be called at the begining of app then run the specific loads of scope vars
          var deferred = $q.defer();
          if(forgeService.status()){
            if(_.contains(storageObject, prefName)){
              //storage object contains pics pref
              //resolve with pics array from storage object
              console.log('storageObject contains ' + prefName + ' with a value of ' + loadStorageObject(prefName))
              deferred.resolve(storageObject[prefName]);
            }
            else{
              //storage object doesn't have a pics pref
              getPrefKeys().then(function(prefs){
                if(_.contains(prefs, prefName)){
                  console.log(prefName + ' pref exists, loading it.')
                  forge.prefs.get(prefName, function(pref){
                      console.log('loaded ' + prefName);
                      console.log(pref);
                      deferred.resolve(pref);
                  }, function(err){
                    console.error('error getting ' + prefName + ' pref:');
                    console.error(err);
                    deferred.reject(err);
                  })
                }
                else{
                  //pref does not exist in list of pref keys
                  console.log(prefName + ' does not exist')
                  deferred.resolve(null);
                }
              });
            }
          }
          else{
            console.log('preferences can not be loaded on this platform');
            deferred.resolve()
          }
          return deferred.promise
        },
        savePref: function (prefName, prefValue) {
          //save in the background if forge exists
          if(forgeService.status()){
            storageObject[prefName] = prefValue;
            forge.prefs.set(prefName, prefValue, function () {
              console.log(prefName + ' preference was set')
            })
          }
          else{
            console.log('Preferences not able to be saved on this platform')
          }
        },
        //adding to existing pref (will be made general)
        addToPref: function (file) {
          console.log('save picture run');
          //set preference in background
          if(forgeService.status()){
            //get permenant url
            var deferredUrl = $q.defer();
            forge.file.URL(file, function(url){
              console.log('got a file url: ');
              console.log(url);
              deferredUrl.resolve(url)
            });
            deferredUrl.promise.then(function(url){
              //after url has been generated
              file.url = url;
              console.log('first promise completed with file obj: ');
              console.log(file);
              $timeout(function(){
                if(loadStorageObject('pics') != null){
                  //storage object contans a pics parameter (array)
                  //add picture to the top of pics array
                  loadStorageObject('pics').unshift(file);
                  console.log('storageObject.pics updated with picture:');
                  console.log(storageObject.pics);
                  //set preference to storage object with new value
                  forge.prefs.set('pics', storageObject.pics, function(){
                    console.log('picture preference updated with new picture')
                  }, function(err){
                    console.error('error setting pics pref');
                  })
                }
                else {
                  //preference must be loaded
                  //either there is no pref or there is
                  var deferred = $q.defer()
                  forge.prefs.get('pics', function(picsPref){
                    deferred.resolve(picsPref);
                  }, function(err){
                    console.error('Error getting pics preference:')
                    deferred.reject(err);
                  })
                  deferred.promise.then(function(picsPref){
                    //add new picture to preference
                    if(picsPref != null){
                      picsPref.unshift(file);
                    }
                    else{
                      //add first picture
                      picsPref = [file]
                    }
                    forge.prefs.set('pics', picsPref, function () {
                      console.log('picture saved in pics preference:');
                      console.log(picsPref);
                    }, function(err){
                      console.error('error saving picture');
                    })
                  })
                }
              }, 0)//end of timeout
            })
           
          }
          else{
            console.log('pictures can not be saved on this platform');
          }
        },
        bindListWithScope: function (bindScope, listName) {
          console.log('running bindListwithscope with ' + listName);
          var listBase = syncData(['users', $rootScope.auth.user.uid]).$child(listName);
          listBase.$bind(bindScope, listName).then(function () {
            console.log(listName + ' was bound');
            //set watcher and save storageObj + pref in the background
            $timeout(function(){
              //setup watcher for null and storage
              bindScope.$watch(listName, function (newVal, oldVal) {
                if (listBase.$getIndex().length > 0) {
                  bindScope.isNullList[listName] = false;
                  console.log('old');
                  console.log(oldVal);
                  console.log('setting ' + listName + ' pref to ');
                  console.log(newVal);
                  //save to service storage
                  storageObject[listName] = newVal;
                  //save list to preference
                  if(forgeService.status()){
                    forge.prefs.set(listName, newVal, function(){
                      console.log(listName + 'preference was set');
                    })
                  }
                }
                else {
                  //activate ui-element for null list ($scope.isNullList[listName])
                  bindScope.isNullList[listName] = true;
                  //set object in storageObj to empty
                  storageObject[listName] = {};
                }
              })
            })
          })
        }
      }//end of return
    }])
//   .factory('backgroundProcess', ['$q', '$timeout' , function($q, $timeout){
//     var self = this;

//     // Works like Underscore's map() except it uses setTimeout between each loop iteration
//     // to try to keep the UI as responsive as possible
//     self.responsiveMap = function(collection, evalFn)
//     {
//         console.log('service called with collection: ');
//         console.log(collection);
//         var deferred = $q.defer();
//         // Closures to track the resulting collection as it's built and the iteration index
//         var resultCollection = [], index = 0;
//         function enQueueNext() {
//             $timeout(function () {
//                 // Process the element at "index"
//                 resultCollection.push(evalFn(collection[index]));

//                 index++;
//                 if (index < collection.length)
//                     enQueueNext();
//                 else
//                 {
//                     // We're done; resolve the promise
//                     deferred.resolve(resultCollection);
//                 }
//             }, 0);
//         }

//         // Start off the process
//         enQueueNext();

//         return deferred.promise;
// }

// return self;
//   }])


