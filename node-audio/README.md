# node-audio
Read some text and/or play an mp3 file
 *   Tessel based text to speech and mp3 player
 *   Includes simple node server to broadcast humidity and temperature to the web
 *   _Remeber to run `npm install` in this project repo to get all the dependencies_

---

#### Parts used:
- [Tessel 2](https://tessel.io/)<br>
  ![alt text](https://s3.amazonaws.com/technicalmachine-assets/launch/animation-files/tessel2.png "Tessel 2")
- [USB Audio](https://tessel.io/modules#tessel-av)<br>
  <img class="disabled" src="http://ecx.images-amazon.com/images/I/71Kgv7ZoI5L._SL1500_.jpg" width="25%" height="25%" title="USB Audio" />

#### NPM Software modules used:
- [node-static](https://www.npmjs.com/package/node-static) - simple web server to demonstrate project
- [os](https://www.npmjs.com/package/os) - used to get the server IP address and return it to a client
- [tessel](https://www.npmjs.com/package/tessel) - cannot live without it ;)
- [tessel-av](https://www.npmjs.com/package/tessel-av) - lets you play mp3s or speak text
- [socket.io](https://www.npmjs.com/package/socket.io) - setup a web socket between the web server and browsers

--

## Instructions

1. Plug your USB Audio device into the top USB port, and some speakers or headphones into the green jack
2. `t2 list` to make sure your Tessel is connected, then run `t2 run app.js`
3. Your T2 app will begin outputting audio

*So now the question is, what else can you do with this?! :)*


--


_Made with ♥ by CAA_
