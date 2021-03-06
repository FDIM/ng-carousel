"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (app) {
  app.controller("AppController", ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
      var counter = 0;
      $scope.items = [];
      $scope.history = [];
      $scope.loadingMore = false;

      $scope.addNewAt = function(index) {
        var i = ++counter;
        var item = {
          title:"item "+i,
          intro:i % 5 ===0 && i>0?'You can\'t pull me (disabled)':'intro '+i,
          disabled: i % 5 ===0  && i>0,
          image:'http://lorempixel.com/500/281/?i='+i
        };
        if(index === 0 ){
          $scope.items.unshift(item);
        }else{
          $scope.items.push(item);
        }

      }

      for(var i =0; i< 5; i++){
        $scope.addNewAt(i);
      }

      $scope.removeItem = function(item) {
        $scope.items.splice($scope.items.indexOf(item),1);
        $scope.history.push("removed "+item.title);
      }

  }]);

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("app", ['ngCarousel'])));
