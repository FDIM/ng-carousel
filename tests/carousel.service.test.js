"use strict";
/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('carousel service', function () {
  var service;
  beforeEach(module("ngCarousel"));
  beforeEach(inject(function(_ngCarouselService_) {
    service = _ngCarouselService_;
  }));
  
  it("invokeOncePerFrame should work", function(){
    var callCount = 0;
    var debounced = service.invokeOncePerFrame(function() {
      callCount++;
    });
    expect(debounced).toBeDefined();

    expect(callCount).toBe(0);
    debounced();
    expect(callCount).toBe(0);
    service.$$rAF.flush();
    expect(callCount).toBe(1);
    debounced();
    debounced();
    debounced();
    debounced();
    expect(callCount).toBe(1);
    service.$$rAF.flush();
    expect(callCount).toBe(2);
  });

  it("normalizeEvent should work with touch event", function(){
    var ev = {touches:[{clientX:12, clientY:12}]};
    service.normalizeEvent(ev);
    expect(ev.clientX).toEqual(12);
    expect(ev.clientY).toEqual(12);
  });

  it("normalizeEvent should work with jquery wrapper event", function(){
    var ev = {originalEvent:{touches:[{clientX:12, clientY:12}]}};
    service.normalizeEvent(ev);
    expect(ev.originalEvent.clientX).toEqual(12);
    expect(ev.originalEvent.clientY).toEqual(12);
  });
  
  it("normalizeOptions should work", function(){
    var attr = {rawValue:"123"};
    var defaultOptions = {rawValue:"1234", useDefault:"1234567890"};
    var result = service.normalizeOptions(attr, defaultOptions);
    
    expect(result.rawValue).toEqual("123");
    expect(result.useDefault).toEqual("1234567890");
    
  });

});
