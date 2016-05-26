/* Pet Tracker: Activity tracker which sends a text message + posts to webpage
 *   Monitor accelerometer to track movement/sleep and send SMS/text message
 *
 * Inspired by https://tessel.hackster.io/rickyrobinett/a-sleep-tracker-for-your-dog-using-tessel-and-twilio-655dbf * Non licensed
 *
 */


// Load some code modules we need
var http        = require('http');
var twilio      = require('twilio');
// Hardware
var tessel      = require('tessel');
var accel       = require('accel-mma84').use(tessel.port.A);

// Twillo cfg
var account_sid = 'AC467.............................';
var auth_token  = '2e1fc...........................';
var twilio_num  = '+###########'; // Twilio Test Account Number
var number      = '+###########'; // The number you want to text the information to
var client      = twilio(account_sid, auth_token);

// Movement tracking start-point
var last_movement      = 0.0;
var last_movement_time = Date.now();

var DEBUG              = true;
var WEB_SERVER_ADDRESS = 'http://192.168.0.4:3000';
var MOVED_BLINK_DELAY  = 500; //milliseconds >>> 1/2 sec - Tessel lights flash on movement


// HELPER FUNCTION DEFINITIONS:

// Sends message to Twillo
var sendText = function sendText(to, from, msg) {
  client.messages.create({
    to:   to,
    from: from,
    body: msg
  }, function (error, message) {
    if (error) {
      console.log('\n* twilio error:', error, getDate(), '\n');
    } else if (DEBUG) {
      console.log('\n* twilio SMS send success - SID:', message.sid, getDate());
    }
  });
};


// Accelerometer Set Scale Callback
var scaleSet = function scaleSet() {
  // Response from POST to web server
  var webServerClimateRequestCallback = function webServerClimateRequestCallback(response) {
    if (response.statusCode < 400) {
      if (DEBUG && response) { console.log('* data successfully trasmitted to web server:', response.statusCode, ' - ', getDate()); }
    } else {
      console.log('\n* error sending climate data to web server:', response.statusCode, getDate(), '\n');
    }
  };
  // Listen for accelerometer data
  accel.on('data', function (xyz) {
    var xRoundedToOneDecimal = xyz[0].toFixed(1);
    var seconds = (Date.now() -  last_movement_time) / 1000;
    var minutes = seconds / 60;
    var message;
    // flash lights on the tessel board
    var blink = function blink(tessel) {
      function toggle() {
        tessel.led[2].toggle();
        tessel.led[3].toggle();
        setTimeout (function () {
          tessel.led[2].toggle();
          tessel.led[3].toggle();
        }, MOVED_BLINK_DELAY);
      }
      toggle();
      setTimeout(toggle, (2 * MOVED_BLINK_DELAY));
    };

    if (DEBUG) { console.log('\nxyz:', xyz, xRoundedToOneDecimal, 'last:', last_movement, '\nm:', minutes, 's:', seconds, getDate()); }

    // check if movement more that 0.1
    if (last_movement !== xRoundedToOneDecimal) {
      last_movement = xRoundedToOneDecimal; //set last_movement to current movement
      last_movement_time = Date.now();

      if (seconds > 1) { // (minutes > 5) {
        message = 'Pet slept for ' + Math.round(seconds) + ' seconds ' /* + Math.rounds(minutes) + ' minutes'*/;

        // Broadcast SMS
        sendText(number, twilio_num, message);

        // Set path & Send to our web server
        http.get(
          WEB_SERVER_ADDRESS + '/movement?at=' + encodeURIComponent(last_movement_time) + '&delta=' + last_movement + '&message=' + encodeURIComponent(message),
          webServerClimateRequestCallback
        );

        // Show on the tessel
        blink(tessel);
      }
    }
  }.bind(this));
};


// Accelerometer Set Rate Callback
var rateSet = function rateSet() {
  accel.setScaleRange(8, scaleSet.bind(this));
};


// Gets an ISO formattted date
var getDate = function getDate() { return '   ' + new Date().toISOString(); };


// Accelerometer Error Handler
var accelError = function accelError(error) {
  console.log('\n* accelerometer error:', error, '\n');
};


// Accelerometer Ready Callback
var accelReady = function accelReady() {
  accel.on('error', accelError, getDate(), '\n');

  // Turn one of the LEDs on to start.
  tessel.led[2].on();
  console.log('* accelerometer ready', getDate());

  // Start streaming accelerometer data
  accel.setOutputRate(1.56, rateSet.bind(this));
};


// START LISTENING:

accel.on('ready', accelReady);
