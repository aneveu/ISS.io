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

