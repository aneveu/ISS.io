angular.module('starter.controllers', [])

  .controller('MapCtrl', function ($scope) {
    $scope.mapCreated = function (map, issMarker) {
      $scope.map = map;
      $scope.issMarker = issMarker;
    };

    var sdToken = "your-token";
    var issApi = "http://api.open-notify.org/iss-now.json";
    var myEventSource = streamdataio.createEventSource(issApi, sdToken);

    myEventSource.onData(function(snapshot){
      $scope.issPosition = snapshot;
      refreshMapAndISSMarker();
    });

    myEventSource.onPatch(function(data){
      jsonpatch.apply($scope.issPosition, data);
      refreshMapAndISSMarker();
    });

    myEventSource.open();

    function refreshMapAndISSMarker(){
      var latLng = new google.maps.LatLng($scope.issPosition.iss_position.latitude, $scope.issPosition.iss_position.latitude);
      $scope.map.setCenter(latLng);
      $scope.issMarker.setPosition(latLng);
    }
  });
