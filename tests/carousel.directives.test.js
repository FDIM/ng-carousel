"use strict";
/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('carousel', function () {
  beforeEach(module("ngCarousel"));
  var $compile,
    $rootScope,
    $window,
    $timeout,
    carouselService;

  beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _$timeout_, _ngCarouselService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    $timeout = _$timeout_;
    carouselService = _ngCarouselService_;
  }));

  describe("static", function() {
    it("should init successfully and slide 1 should be visible", function(){
      var template = '<div carousel><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li></ul></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 1");
    });

    it("should init successfully and slide 2 should be visible", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li></ul></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect($rootScope.$carousel.$index).toBe(1);
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 2");
    });

    it("should init successfully and slide 1 should be visible, together with 2 indicators", function(){
      var template = '<div carousel><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li></ul><span carousel-indicators></span></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 2 should be visible, together with 2 indicators", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li></ul><span carousel-indicators></span></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);
    });
  });

  describe("dynamic", function() {
    var slides = ["slide 1", "slide 2"];
    it("should init successfully and slide 1 should be visible", function(){
      var template = '<div carousel><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 1");
    });

    it("should init successfully even with incorrect model", function(){
      var template = '<div carousel><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul></div>';
      $rootScope.slides = undefined;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("");
    });

    it("should init successfully and slide 2 should be visible", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect($rootScope.$carousel.$index).toBe(1);
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 2");
    });

    it("should init successfully and slide 1 should be visible, together with 2 indicators", function(){
      var template = '<div carousel><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 2 should be visible, together with 2 indicators", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      carouselService.$$rAF.flush();
      carouselService.$$rAF.flush();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 1 should be visible, together with 2 indicators and update once index is changed", function(){
      var template = '<div carousel><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();

      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);

      $rootScope.$carousel.index = 1;
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 1 should be visible, together with 2 indicators, update once index is changed and wrap around", function(){
      var template = '<div carousel carousel-wrap-around="true"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();

      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);

      $rootScope.$carousel.next();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.$carousel.next();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);

      $rootScope.$carousel.previous();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.$carousel.previous();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 1 should be visible, together with 2 indicators, update once index is changed and not wrap around", function(){
      var template = '<div carousel carousel-wrap-around="false"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();

      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);

      $rootScope.$carousel.next();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.$carousel.next();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.$carousel.previous();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);

      $rootScope.$carousel.previous();
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:first-child')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:first-child')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 2 should be visible, even if new slide is added in the end", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides.slice();

      var element = $compile(template)($rootScope);
      $rootScope.$digest();

      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.slides.push("slide 3");
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);
    });

    it("should init successfully and slide 2 should be visible, even if new slide is added in the beggining", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides.slice();

      var element = $compile(template)($rootScope);
      $rootScope.$digest();

      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.slides.unshift("slide 3");
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(3)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(3)')).hasClass('active')).toBe(true);
    });
    it("should init successfully and slide 1 should become visible once slide 2 is removed", function(){
      var template = '<div carousel carousel-index="1"><ul><li ng-class="{active:$carousel.index===$index}" ng-repeat="s in slides">{{s}}</li></ul><span carousel-indicators></span></div>';
      $rootScope.slides = slides.slice();

      var element = $compile(template)($rootScope);
      $rootScope.$digest();

      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(2)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(2)')).hasClass('active')).toBe(true);

      $rootScope.slides.pop()
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.ng-carousel ul li:nth-child(1)')).hasClass('active')).toBe(true);
      expect(angular.element(element[0].querySelector('.ng-carousel-indicators a:nth-child(1)')).hasClass('active')).toBe(true);
    });
  });
  describe("swipe", function() {
    it("should init successfully with swipe enabled", function(){
      var template = '<div carousel carousel-swipe-gesture="true"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li></ul></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 1");
      expect($rootScope.$carousel.options.carouselSwipeGesture).toBeTruthy();
    });
    it("should init successfully with swipe disabled", function(){
      var template = '<div carousel carousel-swipe-gesture="false"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li></ul></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 1");
      expect($rootScope.$carousel.options.carouselSwipeGesture).not.toBeTruthy();
    });
    it("should init successfully and react to swipe left", function(){
      var template = '<div carousel carousel-index="1" style="width:200px; height:200px;" ><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li><li ng-class="{active:$carousel.index===2}">slide 3</li></ul></div>';
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      $rootScope.$digest();

      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:100, clientY:20, button:0}));
      expect($rootScope.$carousel.suspended).toEqual(true);

      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:80, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:60, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:40, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mouseup",{clientX:40, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      expect($rootScope.$carousel.suspended).toEqual(false);
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 3");

    });
    it("should init successfully and react to swipe right", function(){
      var template = '<div carousel carousel-index="1" style="width:200px; height:200px;"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li><li ng-class="{active:$carousel.index===2}">slide 3</li></ul></div>';
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      $rootScope.$digest();

      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:100, clientY:20, button:0}));
      expect($rootScope.$carousel.suspended).toEqual(true);

      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:120, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:140, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:160, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mouseup",{clientX:160, clientY:20, button:0}));
      carouselService.$$rAF.flush();
      expect($rootScope.$carousel.suspended).toEqual(false);

      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 1");
    });
    
    it("should init successfully and update every 3000ms", function(){
      var template = '<div carousel style="width:200px; height:200px;"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li><li ng-class="{active:$carousel.index===2}">slide 3</li></ul></div>';
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      $rootScope.$digest();
      
      $timeout.flush(5000);
      
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 2");
          
    });
    
    it("should init successfully, update every 3000ms and react to focus/blur events", function(){
      var template = '<div carousel style="width:200px; height:200px;"><ul><li ng-class="{active:$carousel.index===0}">slide 1</li><li ng-class="{active:$carousel.index===1}">slide 2</li><li ng-class="{active:$carousel.index===2}">slide 3</li></ul></div>';
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      $rootScope.$digest();
      
      $timeout.flush(5000);
      
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 2");
      
      angular.element($window).triggerHandler('blur');
      
      $timeout.verifyNoPendingTasks();
      
      angular.element($window).triggerHandler('focus');
      
      $timeout.flush(5000);
      
      expect(angular.element(element[0].querySelector('.active')).text()).toEqual("slide 3");
      
    });
  });
});
