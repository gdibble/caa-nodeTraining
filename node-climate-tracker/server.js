// Our node server
// Load some code modules we need
var http     = require('http'); // Create the node server
var socketio = require('socket.io'); // For getting socket messages from our client
var Static   = require('node-static'); // For serving files
var url      = require('url'); // Parse url strings for data
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
  ipLogged++;
  return ip;
};


// Gets an ISO formattted date
var getDate = function getDate() { return '   ' + new Date().toISOString(); };


// This handles all incoming requests to our node server
var requestHandler = function requestHandler(request, response) {
  var requestEnded = function requestEnded() { server.serve(request, response); };
  var queryData    = url.parse(request.url, true).query;
  var temperature  = queryData && Number(queryData.temperature);
  var humidity     = queryData && Number(queryData.humidity);
  var data;
  if (request.method === 'GET' && request.url == '/ipAddress') {
    // GET /ipAddress
    response.writeHead(200, { 'Content-Type':'application/json' }); // Set header
    return response.end(JSON.stringify({ ip:getServerIP() })); // Send object
  } else if (request.method === 'GET' && request.url.indexOf('/climate') === 0 && temperature && humidity) {
    // GET /climate?temperature=0.0&humidity=0.0
    data = {
      temperature: temperature,
      humidity:    humidity
    };
    if (DEBUG) { console.log('\n* /climate data received', getDate(), '\n   ' + JSON.stringify(data)); }

    if (io.socket) {
       // Give climate data to everyone connected to the web server
      io.socket.broadcast.emit('climate', data);
      if (DEBUG) { console.log('    ^ payload broadcast via web socket'); }
    }
    response.writeHead(201);
    return response.end();
  }
  // Otherwise, return the file the client asked for
  request.addListener('end', requestEnded).resume(); // Send file
};


// Socket.io Connection Ready makes web socket available for `requestHandler`
var socketConnected = function socketConnected(socket) {
  io.socket = socket;
  console.log('* web sockets ready');
};


// App Server Ready
var appReady = function appReady() {
  console.log('\nNode.js web server running @ http://localhost:' + server.port + ' or http://' + getServerIP() + ':' + server.port);
};


// START LISTENING:

server.port = 3000;
app = http.createServer(requestHandler); // Create the node server
io  = socketio
      .listen(app) // Setup web sockets
      .sockets.on('connection', socketConnected); // Get a socket to listen on
app.listen(server.port, appReady);
