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

});
