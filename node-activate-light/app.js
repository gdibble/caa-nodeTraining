/* Light Activation: Make something happen when the lights come on
 *   Tessel based light activated action, such as turning on a fan via relay
 *
 * Inspired by node-activate-sound * Non licensed
 *
 */


// Hardware
var tessel  = require('tessel');
var ambient = require('ambient-attx4').use(tessel.port.A); // on port A
var relay   = require('relay-mono').use(tessel.port.B);    // on port B
// var pin     = tessel.port.B.pin[2];                        // pin 2 on port B

// Load some code modules we need
var togglePowerConfig = {
  use:      'relay',  // or 'pin'
  relayChn: 1,        // or 2, not needed if using pin
  relay:    relay,    // defined above
  // pin:   pin,
  debug:    true      // or false / omit passing
};
var togglePower = require('tessel-toggle-power').bind(togglePowerConfig);

// Configuration
var lgtLevel = 0.6;  // Light level (0-1) needed to trigger; you may need to adjust this
var debug    = true; // Whether to log light-level and other events
var lightOn = false;


// HELPER FUNCTION DEFINITIONS:

// Do something when light trigger activated
var reachedLightLevel = function reachedLightLevel(value) {  // (error, value) { // <= supposed to work like this
  // if (error) {
  //   return console.log('\n* reachedLightLevel error', error, '\n');
  // }

  // Toggle your Relay or Pin
  if(!lightOn) { togglePower(); }
  lightOn = true;
  console.log('* reachedLightLevel:', value + '  - ', getDate(), '\n');
};

var ambientgetLightLevelCallback = function ambientgetLightLevelCallback(error, value) {
  if (error) {
    return console.log('\n* getLightLevel error', error, '\n');
  }

  console.log('* getLightLevel:', value);

  if(lightOn && value < lgtLevel) {
    togglePower();
    lightOn = false;
  }
};

var checkLightLevel = function checkLightLevel() {
  setTimeout(getLightLevel, 1000); // milliseconds => every 1/2 second
};

var getLightLevel = function getLightLevel() {
  ambient.getLightLevel(ambientgetLightLevelCallback);
  checkLightLevel();
};

// Run when Ambient module is ready
var ambientReady = function ambientReady() {  
  // Set the light trigger
  ambient.setLightTrigger(lgtLevel);

  if (debug) {
    console.log('* ambientReady: light-trigger set to ' + lgtLevel, '; now listening...', getDate());
    checkLightLevel();  //when debugging, also log the current light level value on an interval
  }

  // When the light trigger is reached
  ambient.on('light-trigger', reachedLightLevel);
};


// Start listening to Ambient module
var listenToAmbient = function listenToAmbient() {
  if (debug) { console.log('* listenToAmbient: light-trigger set to ' + lgtLevel, '; now listening...', getDate()); }

  // When the module is connected
  ambient.on('ready', ambientReady);
};


// Gets an ISO formattted date
var getDate = function getDate() { return new Date().toISOString(); };


// INIT TEST:
console.log('\n\nInit power toggle test, on then off after 1/2 sec...', getDate());
togglePower();
setTimeout(togglePower, 500);  // feel free to comment out these three lines^


// START LISTENING:

// Now start listening on the relay and connect the wifi to check the website
relay.on('ready', listenToAmbient);
// listenToAmbient(); //when using pin instead of relay
