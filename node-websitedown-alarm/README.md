# node-website-alarm
Monitor a website and send a text message if not unreachable
 *   Tessel based website uptime monitoring and SMS notification + option to use a relay/pin
 *   Includes simple node server to monitor and demonstrate the alarm
 *   _Remeber to run `npm install` in this project repo to get all the dependencies_

---

#### Parts used:
- [Tessel 2](https://tessel.io/)<br>
  ![alt text](https://s3.amazonaws.com/technicalmachine-assets/launch/animation-files/tessel2.png "Tessel 2")
- ~~[Relay module](https://tessel.io/modules#module-relay)~~ *(optional: sends SMS, but you can do more like toggle power on something)*<br>
  <img class="disabled" src="https://s3.amazonaws.com/technicalmachine-assets/product+pics/2014+05+15+production+modules/relay.jpg" width="25%" height="25%" title="Tessel Relay module" />

#### NPM Software modules used:
- [node-static](https://www.npmjs.com/package/node-static) - simple web server to demonstrate project
- [os](https://www.npmjs.com/package/os) - used to get the server IP address and return it to a client
- [tessel](https://www.npmjs.com/package/tessel) - cannot live without it ;)
- [twilio](https://www.npmjs.com/package/twilio) - used with a free account to send an SMS message
- ~~[relay-mono](https://www.npmjs.com/package/relay-mono)~~ - try turning on a rotating light/etc.
- ~~[tessel-toggle-power](https://www.npmjs.com/package/tessel-toggle-power)~~ - toggles a relay module, or specified pin *(wire up your own relay and trigger it)*

--

## Instructions

1. Get a free account from [Twilio](https://www.twilio.com), then activate a From `number`
2. Edit `app.js`: enter your accound SID, token, twilio (from) number, cell number and `WEB_ADDRESS`
3. Run `node server` which you can then view @ `localhost:3000`
4. `t2 list` to make sure your Tessel is connected, then run `t2 run app.js`
5. Your T2 app will noisily output console logs (notice `DEBUG = true`)
6. Switch to your node server and press `CTRL+C` to stop the web server
7. When the T2 app runs `http.get` and it fails, you will get an SMS message
8. *Feeling adventurous? Have a Relay module or breadboard, some jumper cables and lights? Enable the `relay-mono` and `tessel-toggle-power` lines within `app.js`.  If you use a Relay module, plug it into port A as shown in the code.  If you use a pin simply edit the code with the pin-number that you prefer.*

*So now the question is, what else can you do with this?! :)*


--


_Made with ♥ by CAA_
