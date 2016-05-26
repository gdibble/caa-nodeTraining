// Our node server
// Load some code modules we need
var http     = require('http'); // Create the node server
var Static   = require('node-static'); // For serving files
var os       = require('os'); // For getting the ip address of the server from the operating system's network interface cards
var server   = new Static.Server('./'); // This will make all the files in the current folder accessible from the web
var ipLogged = 0;
var app;


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


// App Server Ready
var appReady = function appReady() {
  console.log('\nNode.js web server running @ http://localhost:' + server.port + ' or http://' + getServerIP() + ':' + server.port);
};


// START LISTENING:

server.port = 3000;
app = http.createServer(requestHandler); // Create the node server
app.listen(server.port, appReady);
