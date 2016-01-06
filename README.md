ISS.io - an Ionic application to show ISS current position using StreamData.io
==============================================================================

[Streamdata.io](http://streamdata.io/) is a service acting as a reverse proxy that translates REST APIs into a stream of data.
[Ionic](http://ionicframework.com/) is an HTML5 hybrid framework based on [Cordova](https://cordova.apache.org/) and 
[Angular](https://angularjs.org/) which allows you to build native mobile application for Android, iOS and Windows Phone. 
In this tutorial, we will show you step-by-step how to use streamdata.io in an Ionic application to display the ISS position on a map in real-time.

Install Ionic and every dependencies needed
-------------------------------------------

If you haven't already, follow [this guide](http://ionicframework.com/getting-started/) to install Ionic. 


1 - Create the Ionic application
--------------------------------

Start a new project based on the maps template by running `ionic start iss.io maps`. This will build an Ionic project which displays a map.

If you're working on Mac OS X, iOS platform has automatically been added to your project.
 
To add Android platform, run `ionic platform add android`. 

You can run your application in your browser with `ionic serve` command, in an emulator with `ionic emulate [platform]` or in your device with `ionic run [platform]`.
If you want to read more about those commands and their options, have a look [here](http://ionicframework.com/docs/cli/test.html) for serve and 
[here](http://ionicframework.com/docs/cli/run.html) for emulate and run.

When you run it for the first time, you should see a map centered on Ionic's headquarters, a header bar with title `Map` and a footer bar with a `center on me` button.


2 - Customize the application to match our needs
------------------------------------------------

For our purpose, we need to display the map a little bit differently. Open the `directives.js` file in the `www/js` folder and follow steps below:

* First of all, we're going to extract the latitude, longitude and the `LatLng` object in variables as we're going to reuse them.
As we don't know the exact position of the ISS at the moment, let's use Cap Canaveral's coordinates to start:

    ```js
    var lat = 28.5072628;
    var lng = -80.6526204;
    var latLng = new google.maps.LatLng(lat, lng);
    ```

* Then we're going to change the `mapOptions` object to display the map in a more convenient way for our usecase:

    ```js
    var mapOptions = {
      center: latLng,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoom: 4,
      minZoom: 4,
      streetViewControl: false
    };
    ```

* And finally, we add a `marker` object with a custom icon to show the ISS position (don't forget to put the icon in the `www/img` folder):

    ```js
    var issMarker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: 'img/iss_marker.png',
      title: 'ISS'
    });
    ```

* We'll need the `MapCtrl` to know the `issMarker` object later, so we add it as a parameter to the `onCreate` function:

    ```js
    $scope.onCreate({map: map, issMarker: issMarker});
    ```

* Now we're going to add the `issMarker` to the `mapCreated` function into `controllers.js`:

    ```js
    $scope.mapCreated = function (map, issMarker) {
      $scope.map = map;
      $scope.issMarker = issMarker;
    };
    ```
    
* And obviously, we add it to the directive's declaration too:

    ```HTML
    <map on-create="mapCreated(map, issMarker)"></map>
    ```

You can also replace the header bar title in `index.html` by something more relevant like `ISS Position`, and remove the code related to the footer bar and the `center on me` button for more readability if you prefer. 

