// Our node-drawing-game-caa Server
// Load some code modules we need
var app    = require('http').createServer(requestHandler); // Create the node server
var io     = require('socket.io').listen(app); // For getting socket messages from our client
var os     = require('os'); // For getting the ip address of the server from the operating system's network interface cards
var Static = require('node-static'); // For serving files
var fileServer     = new Static.Server('./'); // This will make all the files in the current folder accessible from the web
var fileServerPort = 3000; // This is the port our node server will listen on

// This is the port for our web server.
app.listen(fileServerPort);
console.log('Node.js running on port ' + fileServerPort + '.  Go to http://localhost:' + fileServerPort + ' to see it!');

function getServerIPAddress () {
  var ifaces = os.networkInterfaces();
  var ip;

  Object.keys(ifaces).forEach(function (ifname) {   
    ifaces[ifname].forEach(function (iface) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (iface.internal || iface.family !== 'IPv4') { return; }      
      ip = iface.address; // This ends up just returning the last ip address but it is good enough for a demo
    });
  });

  return ip;
}

// This handles all incoming requests to our node server
function requestHandler (request, response) {
  // If the client asked for the server's IP address return that
  if(request.method === 'GET' && request.url == '/ipAddress') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify({ip: getServerIPAddress()}));
  }
  // Otherwise, return the file the client asked for
  request.addListener('end', function () {
    fileServer.serve(request, response); // Send down the requested file
  }).resume();
}

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {
  // Start listening for mouse move events
  socket.on('mousemove', function (data) {
    // console.log('mousemove: ', data)
    socket.broadcast.emit('moving', data); // Tell everyone connected to our server that the mouse moved
  });
});
