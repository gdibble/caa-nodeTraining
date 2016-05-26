/* Node Drawing Game
 *   Draw on a canvas with just the HTML file, or run `node app.js` and draw with others
 *
 * Inspired by http://tutorialzine.com/2012/08/nodejs-drawing-game/ * 'Free use' license 'with no attribution necessary'
 *
 */


// Our node-drawing-game-caa Server
// Load some code modules we need
var http     = require('http'); // Create the node server
var socketio = require('socket.io'); // For getting socket messages from our client
var Static   = require('node-static'); // For serving files
var os       = require('os'); // For getting the ip address of the server from the operating system's network interface cards
var server   = new Static.Server('./'); // This will make all the files in the current folder accessible from the web
var ipLogged = 0;
var app, io;


var DEBUG = true; // noisy console output for debugging


// HELPER FUNCTION DEFINITIONS:

// Returns `/ipAddress` request
var getServerIP = function getServerIPAddress() {
  var ifaces = os.networkInterfaces(), ip;
  // Get the IPv4 formatted IP address from the ifname data
  Object.keys(ifaces).forEach(function (ifname) {   
    ifaces[ifname].forEach(function (iface) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (iface.internal || iface.family !== 'IPv4') { return; }      
      ip = iface.address; // This ends up just returning the last ip address but it is good enough for a demo
    });
  });
    ipLogged++; // Only log the IP on the server's console once
  if (ipLogged < 2) {
    console.log('\n* server IP address sent:', ip, '  home loads:', ipLogged);
  }
  return ip;
};


// This handles all incoming requests to our node server
var requestHandler = function requestHandler(request, response) {
  var requestEnded = function requestEnded() { server.serve(request, response); };
  if (request.method === 'GET' && request.url == '/ipAddress') {
    // GET /ipAddress
    response.writeHead(200, { 'Content-Type':'application/json' }); // Set header
    return response.end(JSON.stringify({ ip:getServerIP() })); // Send object
  }
  // Otherwise, return the file the client asked for
  request.addListener('end', requestEnded).resume(); // Send file
};


// Got `movemove` web socket event and broadcast `moving` back to web clients
var onMousemove = function onMousemove(data) {
  if (DEBUG) { console.log('* mousemove:', data); }
  if (io.socket) {
    io.socket.broadcast.emit('moving', data); // Broadcast mouse movement
  }
};


// Socket Connection Ready
var socketConnected = function socketConnected(socket) {
  io.socket = socket.on('mousemove', onMousemove); // Listen for movements
  console.log('* web sockets ready');
};


// App Server Ready
var appReady = function appReady() {
  console.log('\nNode.js web server running @ http://localhost:' + server.port +
                             ' or http://' + getServerIP() + ':' + server.port);
};


// START LISTENING:

server.port = 3000;
app = http.createServer(requestHandler); // Create the node server
io  = socketio
      .listen(app) // Setup web sockets
      .sockets.on('connection', socketConnected); // Get a socket to listen on
app.listen(server.port, appReady); // Run web server
