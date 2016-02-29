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
  
  CarouselService.prototype.normalizeOptions = function(attr, defaultOptions){
    var options = {};
    for(var op in defaultOptions){
      options[op] = attr[op] || defaultOptions[op];
    }
    return options;
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
  var CONTAINER_CLASS = 'ng-carousel-indicators';

  module.directive('carouselIndicators', ['ngCarouselService', '$window', '$document', CarouselIndicatorsDirective]);

  function CarouselIndicatorsDirective(carouselService, $window, $document){
    return {
      require:'^carousel',
      link: link,
      scope:{},
      template:'<a ng-repeat="i in $carousel.items" ng-class="{active:$carousel.index==$index}" ng-click="$carousel.index=$index">&nbsp;</a>'
    };

    function link($scope, element, attr, carouselCtrl){
      element.addClass(CONTAINER_CLASS);
      $scope.$carousel = carouselCtrl;
    }
  }

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
  var CONTAINER_CLASS = 'ng-carousel';
  var CONTAINER_ACTIVE_CLASS = 'ng-carousel-active';

  var defaultOptions = {
      carousel: '$carousel',
      carouselWrapAround: false,
      carouselIndex: 0
  };

  module.controller('ngCarouselController',['$scope','ngCarouselService', CarouselController]);
  module.directive('carousel', ['ngCarouselService', '$window', '$document', CarouselDirective]);

  function CarouselController($scope, carouselService){
    var model = this;
    model.$index = 0;

    model.init = init;
    model.next = next;
    model.previous = previous;
    // expose index property
    Object.defineProperty(model, 'index',{
      set: function(value){
        model.$index = value;
        ensureValidIndexRange();
      }, get: function(){
        return model.$index;
      }
    });

    function init(items){
      // if list of items is modified, find currently visible item and adjust the index (no animation)
      if (model.items && model.items.length && items && items.length) {
        var item = model.items[model.$index];
        var newIndex = -1;
        for(var i = 0; i< items.length ; i++){
          if (items[i] === item) {
            newIndex = i;
            break;
          }
        }
        model.disableTransition();
        if (newIndex!==-1){
          model.$index = newIndex;
        }
      }
      model.items = []; // make a copy
      if(items){
        angular.forEach(items, function(i) {
          model.items.push(i);
        });
      }
      ensureValidIndexRange();
    }

    function next(ev){
      model.$index++;
      ensureValidIndexRange();
    }

    function previous(ev){
      model.$index--;
      ensureValidIndexRange();
    }

    function ensureValidIndexRange() {
      if (model.$index >= model.items.length) {
        model.$index = model.options.carouselWrapAround ? 0 : model.items.length - 1;
      }

      if (model.$index < 0) {
        model.$index = model.options.carouselWrapAround ? model.items.length - 1 : 0;
      }
    }
  }

  function CarouselDirective(carouselService, $window, $document){
    return {
      controller:'ngCarouselController',
      compile: compile
    };

    function compile(element, attr, transclude){
      var model = false;
      var targetElement = element.find('ul');
      var li = targetElement.find('li');
      if (li.length ===1 && li.attr('ng-repeat')) {
        var parts = li.attr('ng-repeat').split(' ');
        model = parts[2]; // item in items  -> should take `items`
      }
      return {pre: link};

      function link($scope, element, attr, ctrl){
        element.addClass(CONTAINER_CLASS);
        ctrl.options = carouselService.normalizeOptions(attr, defaultOptions);
        ctrl.disableTransition = disableTransition;
        ctrl.$index = parseInt(ctrl.options.carouselIndex) || 0;
        if(typeof ctrl.options.carouselWrapAround ==='string'){
          ctrl.options.carouselWrapAround = ctrl.options.carouselWrapAround!=='false';
        }
        // disable transition effect if initial
        if(ctrl.$index > 0){
          disableTransition();
        }
        // if carousel is dynamic, e.g. has ng-repeat, watch it
        if (model) {
          $scope.$watch(model+'.length', function(){
            ctrl.init($scope.$eval(model));
          });
        } else {
          ctrl.init(li);
        }

        // expose controller
        $scope.$eval(ctrl.options.carousel+'=value', {value:ctrl});

        // update offset on next frame after value is changed
        $scope.$watch(ctrl.options.carousel+'.$index', carouselService.invokeOncePerFrame(update));

        function update() {
          targetElement[0].style.transform='translateX(-'+(ctrl.index*100)+'%)';
        }

        function disableTransition(){
          // active class disables transition in stylesheet
          carouselService.$$rAF(function(){
              element.addClass(CONTAINER_ACTIVE_CLASS);
              // remove it after next frame update
              carouselService.$$rAF(function(){
                element.removeClass(CONTAINER_ACTIVE_CLASS);
              });
          });
        }
      }
    }
  }

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngCarousel")));
