# node-climate-tracker
Graph humidity and temperature on webpage
 *   Tessel based climate data tracker
 *   Includes simple node server to broadcast humidity and temperature to the web
 *   _Remeber to run `npm install` in this project repo to get all the dependencies_

---

#### Parts used:
- [Tessel 2](https://tessel.io/)<br>
  ![alt text](https://s3.amazonaws.com/technicalmachine-assets/launch/animation-files/tessel2.png "Tessel 2")
- [Climate module](https://tessel.io/modules#module-climate)<br>
  <img class="disabled" src="https://s3.amazonaws.com/technicalmachine-assets/product+pics/2014+05+15+production+modules/climate.jpg" width="25%" height="25%" title="Tessel Climate module" />

#### NPM Software modules used:
- [node-static](https://www.npmjs.com/package/node-static) - simple web server to demonstrate project
- [os](https://www.npmjs.com/package/os) - used to get the server IP address and return it to a client
- [tessel](https://www.npmjs.com/package/tessel) - cannot live without it ;)
- [climate-si7020](https://www.npmjs.com/package/climate-si7020) - lets you read the humidity and temperature
- [socket.io](https://www.npmjs.com/package/socket.io) - setup a web socket between the web server and browsers

--

## Instructions

1. Plug your Climate module into port A
2. Run `node server` and copy the IP Address shown, then view it @ `localhost:3000`
3. Edit `app.js` and enter the copied IP into the variable `WEB_SERVER_ADDRESS`
4. `t2 list` to make sure your Tessel is connected, then run `t2 run app.js`
5. Your T2 app will noisily output console logs (notice `DEBUG = true`)
6. Notice that your web page is now graphing data
7. Breath on the climate module; you will see the humidity and temperature change on the web page

*So now the question is, what else can you do with this?! :)*


--


_Made with ♥ by CAA_
