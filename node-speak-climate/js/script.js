/*global $,io,nv,d3*/

// jQuery shortcut to wait until the page is ready
$(function () {
  // Declare variables and function-declarations first!
  var times_now    = [];
  var temperatures = [];
  var humidities   = [];
  var now, socket;

  // Setup data for nvD3 
  var climateData = function climateData() {
    var temp  = [];
    var humid = [];
    var data;

    for (var i = 0; i < 500; i++) {
      if (times_now[i]) {
        temp.push({ x:times_now[i], y:temperatures[i].toFixed(2) });
        humid.push({ x:times_now[i], y:humidities[i].toFixed(2) });
      }
    }
    data = [{
      values: temp,
      key:    'Temperature',
      color:  'red'
    }, {
      values: humid,
      key:    'Humidity',
      color:  'blue'
    }];

    return data;
  };

  // Call D3 to resize graph on window-resize
  var windowOnResizeCallback = function windowOnResizeCallback(graph) {
    var width  = nv.utils.windowSize().width - 40;
    var height = nv.utils.windowSize().height - 40;
    var margin = graph.margin();

    // Width and Height corrections
    if (width < margin.left + margin.right + 20) {
      width = margin.left + margin.right + 20;
    }
    if (height < margin.top + margin.bottom + 20) {
      height = margin.top + margin.bottom + 20;
    }

    // Reset graph element
    graph
      .width(width)
      .height(height);
    // Reset D3 rendering
    d3.select('#graph')
      .attr('width', width)
      .attr('height', height)
      .call(graph);

    return;
  };

  var nvAddGraphCallback = function nvAddGraphCallback(graph) {
    // Reset window onResize handler
    window.onresize = windowOnResizeCallback.bind(this, graph);
  };

  // Handle messages coming over the internet from our Node.js server (via web socket)
  var handleServerClimate = function handleServerClimate(payload) {
    if (payload instanceof Object) {
      // Valid payload
      now = Date.now();  // a timestamp in milliseconds
      times_now.push(now);
      temperatures.push(payload.temperature);
      humidities.push(payload.humidity);
      // Call nvD3 `addGraph`
      nv.addGraph({
        generate: function() {
          var width  = nv.utils.windowSize().width - 40;
          var height = nv.utils.windowSize().height - 40;
          var chart  = nv.models.lineChart()
                                .width(width)
                                .height(height)
                                .margin({ top:50, right:0, bottom:0, left:50 })
                                .useInteractiveGuideline(true)  // We want nice looking tooltips and a guideline!
                                .showLegend(true)               // Show the legend, allowing users to turn on/off line series.
                                .showYAxis(true)                // Show the y-axis
                                .showXAxis(false);              // Show the x-axis
          d3.select('#graph')
            .attr('width', width)
            .attr('height', height)
            .datum(climateData())  // using helper above
            .call(chart);

          return chart;
        },
        callback: nvAddGraphCallback
      });
    } else {
      // Log if invalid payload
      console.log('\nhandleServerCliamte invalid payload:', payload, '  - ', getDate());
    }
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
      socket = io().on('climate', handleServerClimate);
      console.log('socket.io listening for `climate` events');
      setTimeout(io, 1000); // Init web socket listener
    }
  };

  // Gets an ISO formattted date
  var getDate = function getDate() { return new Date().toISOString(); };

  // Call the node server to get the computer's IP Address
  $.ajax('/ipAddress').done(getCallback_ipAddress);

  return;
});
