'use strict';

/* Filters */
angular.module('escollateApp.filters', [])

.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
}])

.filter('reverse', function() {
  function toArray(list) {
    var k, out = [];
    if( list ) {
      if( angular.isArray(list) ) {
        out = list;
      }
      else if( typeof(list) === 'object' ) {
        for (k in list) {
          if (list.hasOwnProperty(k)) {
            out.push(list[k]);
          }
        }
      }
    }
    return out;
  }
  return function(items) {
    return toArray(items).slice().reverse();
  };
})
// .filter('search', function($window){
//   return function (items, query) {
//     var filtered = []
//     _ = $window._;
//     if(query && typeof query == "string"){
//       var keysToSearch = ['title', 'description', 'author'];
//       //Filter items that have a key that matches the
//       var filtered = _.filter(items, function(item){
//         console.log('item:', item);
//           //Check each of the keys specified for a match
//           var matchingKeyArray = _.some(keysToSearch, function(key){
//             //Check item's parameter value for a match with the query
//             if(_.has(item, key)){
//               if(_.isString(item[key])){
//                 console.log('item[key]', item[key]);
//                 return matchesQuery(item[key], query);
//               }
//               return false
//               // else if(_.isObject(item[key])){

//               //        _.some(item[key], function(){

//               //        });
//               //        return false;
//               // }
//             }

//             return false;
//           });
//           console.log('matching key array:', matchingKeyArray);
//           return matchingKeyArray.length;
//       });
//         return filtered;
//       }
//     return items;

//   };
//   function matchesQuery(str, query){
//     var letterMatch = new RegExp(query, 'i');
//     return letterMatch.test(str.substring(0, query.length));
//   }
// })
.filter('searchTitle', function($window){
  return function (items, query) {
    var filtered = [];
    var letterMatch = new RegExp(query, 'i');
    var filtered = $window._.filter(items, function(item){
      if (letterMatch.test(item.title.substring(0, query.length))) {
          return true;
      }
      return false;
    })


    return filtered;
  };
})
.filter('orderObjectBy', function(){
  return function (input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
      array.push(input[objectKey]);
    }

    function compare(a,b) {
      if (a[attribute] < b[attribute])
        return -1;
      if (a[attribute] > b[attribute])
        return 1;
      return 0;
    }

    array.sort(compare);
    return array;
  }
})

.filter('timeAgo', function() {
  return function(utc) {
    if (utc){
    var a = moment(utc).fromNow();
    return a;
    }
    else{
      return null;
    }
  };
})
