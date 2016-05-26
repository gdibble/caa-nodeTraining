/*global $*/

// jQuery shortcut to wait until the page is ready
$(function () {

  // Call the node server to get the computer's IP Address
  $.ajax('/ipAddress').done(function (data) {
    // Bulid a non-localhost link to the node server
    var link = 'http://' + data.ip + ':3000';

    // Display a message if we are running from the node server and are ready to accept server events
    $('#localIPAddress').text(link); 
    $('#localIPAddress').attr('href', link);
    $('#localIPAddress').attr('href', link);
    $('#active').fadeIn(2016);
  });

});
