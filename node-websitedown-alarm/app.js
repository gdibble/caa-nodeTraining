/* Website Down Alarm: Monitor a website and send a text message if not unreachable
 *   Tessel based website uptime monitoring and SMS notification + option to use a relay/pin
 *   Includes simple node server to monitor and demonstrate the alarm
 *
 * Inspired by https://tessel.hackster.io/ifoundthemeaningoflife/website-down-alarm-4a9b8b * Apache-2.0 license
 *
 */


// Hardware
var tessel = require('tessel');
// var relay  = require('relay-mono').use(tessel.port.A);

// Load some code modules we need
var http   = require('http');
var twilio = require('twilio');
// var togglePowerConfig = {
//   use: 'relay',  // or 'pin'
//   relayChn: 1,   // or 2, not needed if using pin
//   relay:    relay,    // defined above
//   // pin:   pin,
//   debug:    true // or false / omit passing
// };
// var togglePower = require('tessel-toggle-power').bind(togglePowerConfig);

// Twillo cfg
var account_sid = 'AC467.............................';
var auth_token  = '2e1fc...........................';
var twilio_num  = '+###########'; // Twilio Test Account Number
var number      = '+###########'; // The number you want to text the information to
var client      = twilio(account_sid, auth_token);

// Variables to track state
var alarmState  = false; // Current state of alarm
var timeouts    = 0;// Wifi timeout count

// Settings
var DEBUG   = true;
var WEB_ADDRESS  = 'http://192.168.147.49:3000';
var CHECK_SITE_EVERY  = 2 * 1000;  // milliseconds >>> 2 seconds


// HELPER FUNCTION DEFINITIONS:

// Check status of website
var checkSite = function checkSite() {
  if (DEBUG) { console.log('\nPinging', WEB_ADDRESS, '...', getDate()); }
  // Check web address
  http.get(WEB_ADDRESS, checkSiteCallback).on('error', checkSiteError);
};


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


// Whenever this system isn't working, flash the light
//   One of the following happened:
//   1. tried to disconnect while not connected
//   2. tried to disconnect while in the middle of trying to connect
//   3. tried to initialize a connection without first waiting for a timeout or a disconnect
var activateAlarm = function activateAlarm() {
  if (!alarmState) {  // Turn On if not already activated
    alarmState = true;
    // togglePower();
    sendText( // Broadcast SMS
      number,
      twilio_num,
      WEB_ADDRESS + ' unreachable' + getDate()
    );
    console.log('* Alarm Activated! SMS sent to', number, getDate());
  }
  setTimeout(checkSite, CHECK_SITE_EVERY); // This is a hack because checkSiteCallback logic doesn't flow to end of function???
};


// Turn Off Alarm
var alarmOff = function alarmOff() {
  if(alarmState) {
    alarmState = false;
    // togglePower();
    // if (DEBUG && alarmState) { console.log('* Alarm deactivated', getDate()); }
  }
};


// Get Web Address Callback
var checkSiteCallback = function checkSiteCallback(response) {
  // Turn light on/off according to result
  if (response.statusCode < 400) { // response statusCode less than 400 are ok - learn more @ http://wikipedia.org/wiki/List_of_HTTP_status_codes
    if (DEBUG) { console.log('* Website OK'); }
    alarmOff();  // Just ensure it is Off
  } else { // response statusCode 400 and greater are different types of errors
    if (DEBUG) { console.log('* Website Not OK: ', response.statusCode); }
    activateAlarm();
  }
  // Repeat
  setTimeout(checkSite, CHECK_SITE_EVERY);
};


// Get Error Callback
var checkSiteError = function checkSiteError(error) {
  if (DEBUG) { console.log('* `http.get` error: ' + error.message, error, '', getDate()); }
  activateAlarm();
};


// Reset the wifi chip progammatically
var powerCycle = function powerCycle() {
  // When the wifi chip resets, it will automatically try to reconnect to the last saved network
  if (DEBUG) { console.log('\n* Cycling power...', getDate()); }

  tessel.network.wifi.reset(function () {
    timeouts = 0; // Reset timeouts

    if (DEBUG) { console.log('\n* Done power cycling, waiting to reconnect...', getDate()); }

    // Give it some time to auto reconnect
    setTimeout(function () {
     if (!tessel.network.wifi.isConnected) {
       checkSite(); // Try to reconnect
     }
    }, (2 * CHECK_SITE_EVERY)); // twice the normal check-delay
  });
};


// Reconnect or reset wifi
var wifiTimeout = function wifiTimeout(error) {
  // Tried to connect but couldn't; retry
  console.log('\n* Timed out connecting to WiFi', error, '', getDate());
  timeouts++;
  if (timeouts > 2) {
    // Reset the wifi chip if we've timed out too many times
    powerCycle();
  } else {
    // Try to reconnect
    checkSite();
  }
};


// Reconnect when disconnected
var wifiDisconnect = function wifiDisconnect() {
  console.log('\n* WiFi disconnected', getDate());
  powerCycle();
};


// WiFi error handler
var wifiError = function wifiDisconnect() {
  console.log('\n* WiFi error', getDate());
  powerCycle();
};


// Gets an ISO formattted date
var getDate = function getDate() { return '   ' + new Date().toISOString(); };


// Ready: test, listen to wifi and start checking site
// var ready = function ready() {
//   // INIT TEST:
//   console.log('\nInit power-toggle test, on then off after 1/2 sec...', getDate());
//   activateAlarm();
//   setTimeout(alarmOff, 500);  // feel free to comment out these three lines^

  // Automatically reconnect on wifi disconnection
  tessel.network.wifi.on('disconnect', wifiDisconnect);
  // Automatically reconnect or reset wifi upon connection timeout
  tessel.network.wifi.on('timeout', wifiTimeout);
  // Let us know if a wifi error occurs
  tessel.network.wifi.on('error', wifiError);

  // Start checking for uptime
  checkSite();
// };

// console.log('\nActivating relay module...');
// relay.on('ready', ready);
