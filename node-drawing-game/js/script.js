// jQuery shortcut to wait until the page is ready
$(function () {
  // Declare variables and function first!
  var socket;
  // The port of your web server (set in app.js)
  var serverPort = '3000';
  // Some variables for parts of the browser page that we need to draw on
  var $doc    = $(document);
  var $name   = $('#name');
  var $canvas = $('#paper');
  // A flag for drawing activity
  var drawing = false;
  // Other variables we use for keeping track of stuff
  var clients = {};
  var cursors = {};
  var prev    = {};
  // Generate an unique ID for the local user
  var id = Math.round($.now()*Math.random());
  // Keep track of the last time we moved the mouse
  var lastEmit = $.now();
  var housekeepingDelay = 10 * 1000; //1 sec = 1000 millisecond, thus 10 sec

  // Helpers:
  // Draw a line
  function drawLine(fromX, fromY, toX, toY, color) {
    var context = $canvas[0].getContext('2d');
    // Do stuff to the canvas
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineWidth = 5;
    context.strokeStyle = color || 'black';
    context.stroke();
  }

  // Handle messages coming over the internet from our Node.js server (via pusher)
  function handleServerMovement(data) {
    // console.log('handleServerMovement: ', data)
    if (!(data.id in clients)) {
      // a new user has come online. create a cursor for them
      cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
    }
    // Check if user is drawing
    if (data.drawing && clients[data.id]) {
      // Draw a line on the canvas. clients[data.id] holds
      // the previous position of this user's mouse pointer
      drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y, data.color);
    }
    cursors[data.id].css({ 'left':data.x, 'top':data.y }); // Move the mouse pointer
    // Saving the current client state
    clients[data.id] = data;
    clients[data.id].updated = $.now();
  }

  // Listen for when the user presses down the mouse button
  function startDrawing(mousedownEvent) {
    mousedownEvent.preventDefault();
    drawing = true;
    prev.x = mousedownEvent.pageX;
    prev.y = mousedownEvent.pageY;
    // On the first mouse-button-down, hide the instructions
    $('#instructions').fadeOut();
  }

  // Listen for when the mouse button is lifted or the mouse leaves the browser
  function stopDrawing() {
    drawing = false;
  }

  function clearCanvas() {
    var context = $canvas[0].getContext('2d');
    context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
  }

  // This is called when the mouse moves
  function handleLocalMovement(mousemoveEvent) {
    var color = $('#colorPicker').val();

    // Send an event if we have a socket to send on and it has been
    // at least 30 milliseconds since the last mousemove event
    if (socket && $.now() - lastEmit > 30) {
      socket.emit('mousemove', {
        x:          mousemoveEvent.pageX,
        y:          mousemoveEvent.pageY,
        drawing:    drawing,
        id:         id
      });
      lastEmit = $.now();
    }
    // Draw a line for the current user's movement
    if (drawing) {
      drawLine(prev.x, prev.y, mousemoveEvent.pageX, mousemoveEvent.pageY, color);
      prev.x = mousemoveEvent.pageX;
      prev.y = mousemoveEvent.pageY;
    }
  }

  // Setup all our event listeners
  function listenForEvents() {
    // This is where we start monitoring the local mouse buttons and position
    $canvas.on('mousedown', startDrawing);
    $doc.bind('mouseup mouseleave', stopDrawing);
    $doc.on('mousemove', handleLocalMovement);
  }

  // Call the node server to get the computer's IP Address
  function getIPAddressFromNodeServer(data) {
    $.ajax('/ipAddress')
    .done(function (data) {
      // Bulid a non-localhost link to the node server
      var link = 'http://' + data.ip + ':' + serverPort;

      // Display a message if we are running from the node server and are ready to accept server events
      $('#localIPAddress').text(link); 
      $('#localIPAddress').attr('href', link); 
      $('#socketed').fadeIn(2016);

      // send mouse movements to your Node.js server
      socket = io && io.connect(link); // Open a web socket connection to the node server   
      // Listen for any moving events on the socket connected to our node server.  These could be from other clients.
      socket.on('moving', handleServerMovement);
    });
  }

  // Removes inactive clients
  function housekeeping() {
    for (var identity in clients) {
      var msSinceLastUpdate = $.now() - clients[identity].updated;
      if (msSinceLastUpdate > housekeepingDelay) {
        // Last update was more than 10 seconds ago. 
        // This user has probably closed the page
        cursors[identity].remove();
        delete clients[identity];
        delete cursors[identity];
      }
    }
    setTimeout(housekeeping, housekeepingDelay); //recursive: runs itself
  }

  // Here is where the code actually starts execution...

  listenForEvents();

  getIPAddressFromNodeServer();

  // Remove inactive clients after 10 seconds of inactivity
  housekeeping();
});
