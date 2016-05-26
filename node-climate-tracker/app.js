/* Climate Tracker: Graph relative humidity and temperature on webpage
 *   Tessel based climate data tracker
 *   Includes simple node server to broadcast humidity and temperature to the web
 *
 * Inspired by https://tessel.hackster.io/dani-dewitt/displaying-tessel-temperature-data-on-a-live-updating-chart-5c1f2a * Non licensed
 *
 */


// Load some code modules we need
var http    = require('http');
// Hardware
var tessel  = require('tessel');
var climate = require('climate-si7020').use(tessel.port.A);

var DEBUG              = true;  // Whether to log sound-level and other events
var TEMP_TYPE          = 'f';   // pass: 'c' for Celsius or 'f' for Fahrenheit
var READ_INTERVAL      = 2000;  // milliseconds >>> 2 seconds
var WEB_SERVER_ADDRESS = 'http://192.168.0.4:3000';


// HELPER FUNCTION DEFINITIONS:

var getClimate = function getClimate() {
  var temperature, humidity;
  // Response from POST to web server
  var webServerClimateRequestCallback = function webServerClimateRequestCallback(response) {
    if (response.statusCode < 400) {
      if (DEBUG && response) { console.log('* Data successfully trasmitted to web server:', response.statusCode, ' - ', getDate()); }
    } else {
      console.log('\n* Error sending climate data to web server:', response.statusCode, ' - ', getDate());
    }
  };
  // Climate module onReadHumdity callback
  var onReadHumidityCallback = function onReadHumidityCallback(error, rh) {
    if (error) {
      return console.log('\n* onReadHumidityCallback error', error, '\n');
    }

    humidity = rh;

    // Set path & Send to our web server
    http.get(
      WEB_SERVER_ADDRESS + '/climate?temperature=' + temperature + '&humidity=' + humidity,
      webServerClimateRequestCallback
    );

    if (DEBUG) { console.log('* Humidity in %RH: ', JSON.stringify(rh.toFixed(4)), ' - ', getDate()); }
  };
  // Climate module onReadTemperature callback
  var onReadTemperatureCallback = function onReadTemperatureCallback(error, temp) {
    if (error) {
      return console.log('\n* onReadTemperatureCallback error', error, '\n');
    }

    if (DEBUG) { console.log('\n* Temperature in ' + TEMP_TYPE.toUpperCase() + ':', JSON.stringify(temp.toFixed(4)), ' - ', getDate()); }

    temperature = temp;
    climate.readHumidity(onReadHumidityCallback);
  };

  //read the temperature, humidity and then broadcast that data
  climate.readTemperature(TEMP_TYPE, onReadTemperatureCallback);

  //recurse
  setTimeout(getClimate, READ_INTERVAL);
};


// Climate module error handler
var climateError = function climateError(error) {
  console.error('\n\n* climate error:', error, new Date(), '\n');
};


// Run when climate module ready
var onReadyCallBack = function onReadyCallBack() {
  climate.on('error', climateError);

  if (DEBUG) { console.log('\n\nReady to read climate sensor', getDate()); }

  setTimeout(getClimate, READ_INTERVAL);
};


// Gets an ISO formattted date
var getDate = function getDate() { return new Date().toISOString(); };


// START LISTENING:

climate.on('ready', onReadyCallBack);
