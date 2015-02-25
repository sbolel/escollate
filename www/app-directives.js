'use strict';

/* Directives */
angular.module('escollateApp.directives', [])

// .directive('ionSearch', function() {
//   return {
//       restrict: 'E',
//       replace: true,
//       scope: {
//           getData: '&source',
//           model: '=?',
//           search: '=?filter'
//       },
//       link: function(scope, element, attrs) {
//         attrs.minLength = attrs.minLength || 0;
//         scope.placeholder = attrs.placeholder || '';
//         scope.search = {value: ''};

//         if (attrs.class)
//           element.addClass(attrs.class);
//         if (attrs.source) {
//           scope.$watch('search.value', function (newValue, oldValue) {
//             if (newValue.length > attrs.minLength) {
//               scope.getData({str: newValue}).then(function (results) {
//                 scope.model = results;
//               });
//             } else {
//               scope.model = [];
//             }
//           });
//         }
//         scope.clearSearch = function() {
//             scope.search.value = '';
//         };
//       },
//       template:'<ion-header-bar class="bar-subheader item-input-wrapper">' +
//                   '<i class="icon ion-ios7-search placeholder-icon"></i>' +
//                   '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
//                   '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
//                 '</ion-header-bar>'
//   };
// })
.directive('lineGraph', function() {
  return {
    template: '<div class="graphLine" ></div>',
    link: function(scope, tElem, attrs) {
      var options = function(businessSeries, marketSeries){
        return {
          chart: {
            renderTo: $(tElem)[0],
            type: 'areaspline',
            spacing: [0,0,10,0]
          },
          title: {
            text: ''
          },
          xAxis: {
            lineWidth: 0,
            minorGridLineWidth: 0,
            minorTickLength: 0,
            tickLength: 0,
            lineColor: 'transparent',
            categories: [
            'J',
            'F',
            'M',
            'A',
            'M',
            'J',
            'J',
            'A',
            'S',
            'O',
            'N',
            'D'
            ],
          },
          yAxis: {
            gridLineColor: 'transparent',
            labels: {
              enabled: false
            },
            title: {
              enabled: false
            }
          },
          tooltip: {
            shared: true,
            valueSuffix: ' units'
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.5
            }
          },
          legend: {
            enabled: false
          },
          series: [{
            data: businessSeries
          }, {
            data: marketSeries
          }]
        }
      };

      var chart = new Highcharts.Chart(options([3, 4, 3, 5, 4, 10, 12, 10, 3, 9, 11, 18], [1, 3, 4, 3, 3, 5, 4, 8, 7, 12, 5, 6]));

            // $(tElem).highcharts(options([3, 4, 3, 5, 4, 10, 12, 10, 3, 9, 11, 18]
            //     , [1, 3, 4, 3, 3, 5, 4, 8, 7, 12, 5, 6]));
    scope.$watch('allBusiness', function(data){
      if (data) {
        console.log(data);
        chart.series[0].update({
          data: [10, 4, 10, 5, 4, 10, 12, 10, 10, 9, 11, 18]
        });
      } else {
        chart.series[0].update({
          data: [10, 4, 3, 5, 4, 3, 12, 3, 3, 9, 11, 18]
        });
      }
    });
    }
  }
})
.directive('slideable', function () {
  return {
    restrict:'C',
    compile: function (element, attr) {
      // wrap tag
      var contents = element.html();
      element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

      return function postLink(scope, element, attrs) {
          // default properties
          attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
          attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
          element.css({
            'overflow': 'hidden',
            'height': '0px',
            'transitionProperty': 'height',
            'transitionDuration': attrs.duration,
            'transitionTimingFunction': attrs.easing
          });
        };
      }
    };
  })
.directive('slideToggle', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var target = document.querySelector(attrs.slideToggle);
      attrs.expanded = false;
      element.bind('click', function() {
        var content = target.querySelector('.slideable_content');
        if(!attrs.expanded) {
          content.style.border = '1px solid rgba(0,0,0,0)';
          var y = content.clientHeight;
          content.style.border = 0;
          target.style.height = y + 'px';
        } else {
          target.style.height = '0px';
        }
        attrs.expanded = !attrs.expanded;
      });
    }
  }
});
