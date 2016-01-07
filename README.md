ISS.io - an Ionic application to show ISS current position using StreamData.io
==============================================================================

[Streamdata.io](http://streamdata.io/) is a service acting as a reverse proxy that translates REST APIs into a stream of data.
[Ionic](http://ionicframework.com/) is an HTML5 hybrid framework based on [Cordova](https://cordova.apache.org/) and 
[Angular](https://angularjs.org/) which allows you to build native mobile application for Android, iOS and Windows Phone. 
In this tutorial, we will show you step-by-step how to use streamdata.io in an Ionic application to display the ISS position on a map in real-time.

If you just want to run the sample, after having installed Ionic and cloned this repository, you just have:

* to add one or more platform as explained in step 2
* to fill in your application token as explained in step 3


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


3 - Setting up the Streamdata.io event-source
---------------------------------------------

In order to use the Streamdata.io proxy, you need an App Token. Register on the [Portal](https://portal.streamdata.io/#/register) to create an account and get a valid token.
The Streamdata.io request for the ISS position looks like this:

```
https://streamdata.motwin.net/http://api.open-notify.org/iss-now.json?X-Sd-Token=[your-token]
```

As you can see, it is composed of three parts:

* https://streamdata.motwin.net/: the Streamdata.io proxy url,
* http://api.open-notify.org/iss-now.json: the API which will give us the ISS position,
* ?X-Sd-Token=[your-token]: your Streamdata.io App Token.

Let's call our request with a simple `curl -XGET` to see what the API send us: 

```JSON
event:data
data:{"iss_position":{"latitude":-5.154055625049744,"longitude":137.42699878015998},"message":"success","timestamp":1452186030}
    
event:patch
data:[{"op":"replace","path":"/iss_position/latitude","value":-4.891777641581724},
      {"op":"replace","path":"/iss_position/longitude","value":137.61496558611873},
      {"op":"replace","path":"/timestamp","value":1452186035}]
```

On the first call, the API send us the object `iss_position`, whereas on next calls, it will send us updates in the [JSON-Patch format](http://jsonpatch.com/). 

Once you have your token, you can add the [Streamdata.io JavaScript SDK](https://www.npmjs.com/package/streamdataio-js-sdk) and a [JSON-Patch library](https://github.com/Starcounter-Jack/JSON-Patch) 
to your dev-dependencies in the `bower.json` file:

```JSON
"devDependencies": {
  "ionic": "driftyco/ionic-bower#1.3.2",
  "streamdataio-js": "https://github.com/streamdataio/streamdataio-js-sdk.git#v1.0.5",
  "fast-json-patch": "^1.1.1"
}
```

After running the `bower install` command to add them to your `www/lib` folder, declare them in your `index.html` file:

```HTML
<script src="lib/streamdataio-js/dist/streamdataio.min.js"></script>
<script src="lib/fast-json-patch/dist/json-patch-duplex.min.js"></script>
```

Now we can open the streaming session in the `MapCtrl` in `controllers.js`. First, we need to create an `EventSource` object which takes your Streamdata.io App Token and the ISS API as parameters:

```js
.controller('MapCtrl', function ($scope) {
    
  ... 
      
  var sdToken = "your-token";
  var issApi = "http://api.open-notify.org/iss-now.json";
  var myEventSource = streamdataio.createEventSource(issApi, sdToken); 
}
```

Then we need to register to two callbacks: `onData` to retrieve the initial document, and `onPatch` to retrieve updates:       
      
```js
myEventSource.onData(function (snapshot) { // initialize your data with the initial snapshot
  $scope.issPosition = snapshot;
});
      
myEventSource.onPatch(function (data) {    // update the data with the provided patch
  jsonpatch.apply($scope.issPosition, data);
});
```

Now that we retrieve the position, we need a method to update map's center and the ISS marker according to the new value:

```js    
function refreshMapAndISSMarker(){
  var latLng = new google.maps.LatLng($scope.issPosition.iss_position.latitude, 
                 $scope.issPosition.iss_position.longitude);
  $scope.map.setCenter(latLng);
  $scope.issMarker.setPosition(latLng);
}
```
      
Finally, we just need to call this method in our `onData` and `onPatch` methods and start the streaming session by calling the `open` method on the `myEventSource` object:
      
```
myEventSource.onData(function (snapshot) { // initialize your data with the initial snapshot
  $scope.issPosition = snapshot;
  refreshMapAndISSMarker();
});
      
myEventSource.onPatch(function (data) {    // update the data with the provided patch
  jsonpatch.apply($scope.issPosition, data);
  refreshMapAndISSMarker();
});

myEventSource.open();
```

Et voilà! Our map is now showing the ISS position in real-time :)