angular.module('starter.directives', [])

  .directive('map', function () {
    return {
      restrict: 'E',
      scope: {
        onCreate: '&'
      },
      link: function ($scope, $element, $attr) {
        function initialize() {
          var lat = 28.5072628;
          var lng = -80.6526204;
          var latLng = new google.maps.LatLng(lat, lng);

          var mapOptions = {
            center: latLng,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            zoom: 4,
            minZoom: 4,
            streetViewControl: false
          };
          var map = new google.maps.Map($element[0], mapOptions);

          var issMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: 'img/iss_marker.png',
            title: 'ISS'
          });

          $scope.onCreate({map: map, issMarker: issMarker});

          // Stop the side bar from dragging when mousedown/tapdown on the map
          google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
            e.preventDefault();
            return false;
          });
        }

        if (document.readyState === "complete") {
          initialize();
        } else {
          google.maps.event.addDomListener(window, 'load', initialize);
        }
      }
    }
  });
