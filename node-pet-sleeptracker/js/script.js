/*global $,io*/

// jQuery shortcut to wait until the page is ready
$(function () {
  // Declare variables and function first!
  var socket;
  var $main = $('#main');

  // Add movement data to the page
  var handleMovedEvent = function (data) {
    var delta = data.delta;
    var time  = Number(decodeURIComponent(data.at));
    var msg   = decodeURIComponent(data.message);

    $main.append(
      '<p class="faux-sms from-them">' +
        '<time title="Δ ' + delta + '" datetime="' + time + '">' +
          new Date(time).toLocaleString() +  // i.e. "6/26/2016, 12:24:48 PM"
        ':</time>' +
        msg +
      '</p>'
    );

    return;
  };


  // GET request for /ipAddress AJAX Callback
  var getCallback_ipAddress = function getCallback_ipAddress(data) {
    // Bulid a non-localhost link to the node server
    var link = 'http://' + data.ip + ':3000';

    // Display a message if we are running from the node server and are ready to accept server events
    $('#localIPAddress').text(link); 
    $('#localIPAddress').attr('href', link);
    $('#localIPAddress').attr('href', link);
    $('#active').fadeIn(2016);

    // Open a web socket connection to the node server
    if (io && !socket) {
      socket = io().on('moved', handleMovedEvent);
      console.log('socket.io listening for `moved` events');
      setTimeout(io, 1000); // Init web socket listener
    }
  };


  // Call the node server to get the computer's IP Address
  $.ajax('/ipAddress').done(getCallback_ipAddress);

});
