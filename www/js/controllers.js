angular.module('starter.controllers', [])

  .controller('MapCtrl', function($scope) {
    $scope.mapCreated = function(map, issMarker) {
      $scope.map = map;
      $scope.issMarker = issMarker;
    };
  });
