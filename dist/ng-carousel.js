"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngCarousel", [])));

"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var TRANSLATEZ_SUFFIX = 'translateZ(0)';
  module.service('ngCarouselService', ['$$rAF',CarouselService]);
  
  function CarouselService($$rAF) {
    this.$$rAF = $$rAF;
  }

  CarouselService.prototype.normalizeEvent = function(ev) {
    // jquery
    if(ev.originalEvent){
      ev = ev.originalEvent;
    }
    if(ev.touches){
      ev.clientX = ev.touches[0].clientX;
      ev.clientY = ev.touches[0].clientY;
    }
    return ev;
  };
  
  // taken from angular material: https://github.com/angular/material/blob/67e50f6e51b3e0282c086d9bb7760661c8135bbf/src/core/core.js
  CarouselService.prototype.invokeOncePerFrame = function(cb) {
    var queuedArgs, alreadyQueued, queueCb, context, self;
    self = this;
    return function debounced() {
      queuedArgs = arguments;
      context = this;
      queueCb = cb;
      if (!alreadyQueued) {
        alreadyQueued = true;
        self.$$rAF(function() {
          queueCb.apply(context, Array.prototype.slice.call(queuedArgs));
          alreadyQueued = false;
        });
      }
    };
  };
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngCarousel")));

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
