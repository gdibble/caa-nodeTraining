# node-pet-sleeptracker
Activity tracker which sends a text message + posts to webpage
 *   Monitor accelerometer to track movement/sleep and send SMS/text message
 *   _Remeber to run `npm install` in this project repo to get all the dependencies_

---

#### Parts used:
- [Tessel 2](https://tessel.io/)<br>
  ![alt text](https://s3.amazonaws.com/technicalmachine-assets/launch/animation-files/tessel2.png "Tessel 2")
- [Accelerometer module](https://tessel.io/modules#module-accelerometer)<br>
  <img class="disabled" src="https://s3.amazonaws.com/technicalmachine-assets/product+pics/2014+05+15+production+modules/accelerometer.jpg" width="25%" height="25%" title="Tessel Accelerometer module" />

#### NPM Software modules used:
- [node-static](https://www.npmjs.com/package/node-static) - simple web server to demonstrate project
- [os](https://www.npmjs.com/package/os) - used to get the server IP address and return it to a client
- [tessel](https://www.npmjs.com/package/tessel) - cannot live without it ;)
- [accel-mma84](https://www.npmjs.com/package/accel-mma84) - lets you read the tilt of the accelerometer module
- [twilio](https://www.npmjs.com/package/twilio) - used with a free account to send an SMS message
- [socket.io](https://www.npmjs.com/package/socket.io) - setup a web socket between the web server and browsers

--

## Instructions

1. Plug your Accelerometer module into port A
2. Get a free account from [Twilio](https://www.twilio.com), then activate a From `number`
3. Run `node server` and copy the IP Address shown - you can view also view it @ `localhost:3000`
4. Edit `app.js` and enter the copied IP into the variable `WEB_SERVER_ADDRESS`<br>
   Also enter your accound SID, token, twilio (from) number and a cell number
5. `t2 list` to make sure your Tessel is connected, then run `t2 run app.js`
6. Your T2 app will noisily output console logs (notice `DEBUG = true`)
7. Bump the accelerometer; you will get an SMS messsage and the same shows up on the web page

*So now the question is, what else can you do with this?! :)*


--


_Made with ♥ by CAA_
