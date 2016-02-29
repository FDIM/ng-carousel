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
    carouselService;

  beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _ngCarouselService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
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
});
