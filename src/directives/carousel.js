"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var EVENTS = {
    start:'mousedown touchstart',
    move:'mousemove touchmove',
    end: 'mouseup touchend'
  };
  var NO_SELECT_CLASS = 'no-select';
  
  module.directive('carousel', ['ngCarouselService', '$window', '$document', CarouselDirective]);

  function CarouselDirective(carouselService, $window, $document){
    
  }
  
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngCarousel")));
