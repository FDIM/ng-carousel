"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var CONTAINER_CLASS = 'ng-carousel-indicators';
    
  module.directive('carouselIndicators', ['ngCarouselService', '$window', '$document', CarouselIndicatorsDirective]);
  
  
  
  function CarouselIndicatorsDirective(carouselService, $window, $document){
    return {
      require:'^carousel',
      link: link
      
    };
    
    function link($scope, element, attr, carouselCtrl){
      $scope.$watch(carouselCtrl.options.model+'.length', function(){
        //ctrl.init($scope.$eval(model));
      });
      
    }
  }
  
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngCarousel")));
