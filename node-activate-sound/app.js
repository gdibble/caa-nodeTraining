/* Sound Activation: Make something happen when a sound is heard
 *   Tessel based sound activated action, such as turning on a light via relay
 *
 * Inspired by https://tessel.hackster.io/ifoundthemeaningoflife/tessel-clap-switch-7ee7af * Apache-2.0 license
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
var sndLevel = 0.2;   // Sound level (0-1) needed to trigger; you may need to adjust this
var debug    = true;  // Whether to log sound-level and other events
var lightOn = false;

// HELPER FUNCTION DEFINITIONS:

// Do something when sound trigger activated
var reachedSoundLevel = function reachedSoundLevel(value) {  // (error, value) { // <= supposed to work like this
  // if (error) {
  //   return console.log('\n* reachedSoundLevel error', error, '\n');
  // }

  // Toggle your Relay or Pin
  if(!lightOn) { togglePower(); }
  lightOn = true;

  console.log('* reachedSoundLevel:', value + '  - ', getDate(), '\n');
};



var checkSoundLevel = function checkSoundLevel() {
  setTimeout(getSoundLevel, 1000); // milliseconds => every 1/2 second
};

var ambientGetSoundLevelCallback = function ambientGetSoundLevelCallback(error, value) {
  if (error) {
    return console.log('\n* getSoundLevel error', error, '\n');
  }
  
  console.log('* getSoundLevel:', value);

  if(lightOn && value < sndLevel) {
    togglePower();
    lightOn = false;
  }
};

var getSoundLevel = function getSoundLevel() {
  ambient.getSoundLevel(ambientGetSoundLevelCallback);
  checkSoundLevel();
};

// Run when Ambient module is ready
var ambientReady = function ambientReady() {
  // Set the sound trigger
  ambient.setSoundTrigger(sndLevel);

  if (debug) {
    console.log('* ambientReady: sound-trigger set to ' + sndLevel, '; now listening...', getDate());
    checkSoundLevel();  //when debugging, also log the current sound level value on an interval
  }

  // When the sound trigger is reached
  ambient.on('sound-trigger', reachedSoundLevel);
};


// Start listening to Ambient module
var listenToAmbient = function listenToAmbient() {
  if (debug) { console.log('* listenToAmbient: sound-trigger set to ' + sndLevel, '; now listening...', getDate()); }

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
