/*jshint esversion: 6*/

/* Audio: Read some text and/or play an mp3 file
 *   Tessel based text to speech and mp3 player
 *   Includes simple node server to broadcast humidity and temperature to the web
 *
 * Inspired by fantastic documentation at https://github.com/tessel/tessel-av#avplayer * MIT license
 *
 */

// Load some code modules we need
var http    = require('http');
var av      = require('tessel-av');
// Create music and voice objects
var audio   = new av.Player();
var voice   = new av.Speaker();
// Setup some text and music
var dialog  = require('./dialog');
var mp3s    = {
  horn: __dirname + '/horn.mp3',
  epic: __dirname + '/bensound-epic.mp3'
};

// HELPER FUNCTION DEFINITIONS:

var playMP3 = function playMP3() { audio.play(mp3s.epic); };
var getLine = function getLine(lineNum) { return dialog[lineNum]; };
var log = function log(phrase) { console.log(phrase); return phrase; };
var speakLines = function speak(lineNums, options, callback) {
  var addop = function addop(text) { return [text].concat(options || []); };
  // Convert lineNums to text and if passed, add options to each. Loop & play.
  lineNums.map(getLine).map(addop).forEach(line => voice.say(log(line)));
  if (callback) { voice.on('empty', callback); }
};

// BASICS - create a new Audio/Voice Player

new av.Player()
.play(mp3s.horn) // Play an MP3 file
.on('ended', () =>
  // When the MP3 has ended, speak some text
  // Basic text to speech - settings https://github.com/tessel/tessel-av/blob/master/espeak.md
  voice.say({
    phrase: 'What do you call a fake noodle? An Impasta! Har, har.',
    s:150,
    p:59
  })
);


// Now use the helpers above and the included `dialog.js` file to play some phrases
setTimeout(() => {
  speakLines([ 0, 1, 2, 3 ]);  // Say several lines via helper - it's easy to just play one line: voice.say('blah blah blah');
  speakLines([ 4 ], [ '-a', 100, '-p',  0, '-s',  90 ]);
  speakLines([ 5 ], [ '-a', 200, '-p', 99, '-s', 180 ]);
  speakLines([ 6, 7 ], [], playMP3); // Say a few more lines then run callback
}, 2000);
