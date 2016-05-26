# **JavaScript** and **Node.js**

# Intro

What is JavaScript?
JS started as a simple scripting language adopted in web browsers.  The name of the standard is ECMAScript, and you may see ES5 (version 5) or ES6 (the newest ideas.)  Basically it allows _stuff_ to be changed. _Stuff_ could be the value of a text input, or the visibility of a button.  You could also get data or media from another computer and do one thing or another with it.  As browsers grew up, their features increased.  Many have contributed to build open/shared web standards which enable cool tech like multi-touch and OpenGL gaming that we enjoy today.

So what is Node.js?
Node is simply JavaScript as a server, which run on a server to get data like your email and send it to a browser (like on your phone, which also runs JS.)  In 2009 a guy named Ryan Dahl took Google's "V8" JavaScript engine and wrote some hooks into the [Linux] operating system.  In 2011 Node.js got a package manager which lets you install "modules" (stand-alone features anyone can add to their own project.)  Last year in 2015, Node was upgraded to use brand new features of the next version of ECMAScript 6, which means you have more power as a Developer.

Developer?
Yup, and that's you.  Oxford defines it as "A person or thing that develops something."  Like software.  So let's _develop_ our skills and learn a few basic things about JavaScript and Node.js...

## JavaScript Basics

Once you understand these basics, you may imagine making a game or something else awesome and unique.  There's a lot more to learn in JS and Node, so let's start with a few ideas that you can grow.

Take these concepts and practice them, later read more online and finally try more complex ideas.

### Types

1. [**undefined**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) (nothing is set)
2. [**null**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null) (not valid, irrelevant)
3. **boolean** (true || false) [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
4. **number** (-infinity - infinity) [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/number)
5. **strings** (a bunch of characters) [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string)
6. objects (complex things) [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/object)<br>
  - **objects** as data structures, which is what we usually mean<br>
    `{ key:'value', x:'y', '1':2 }`
  - **arrays** which are lists [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/array)<br>
    `[ undefined, null, false, 3.14, 'CISLA', { a:1 }, [ 1, 2, 3 ] ]`
  - **functions** or methods [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/function)<br>
    perform tasks and are run with ()<br>
    `var fn = function (n) { return n/2; };`<br>
    `fn(4);` → `2`
7. _NEW in ES6:_ **symbol** (an identifier) [\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/symbol)

### Compare Types with logical operators

- **!**<br>
  _not_ – reverse a result<br>
  `!(1===1)` → `false`

- **===**<br>
  _equal_<br>
  `1 === 2` → `false`

- **!==**<br>
  _not equal_<br>
  `'x' !== 'y'` → `true`

- **>**<br>
  _greater than_<br>
  `2 > 1` → `true`

- **>==**<br>
  _greater than or equal-to_

- **<**<br>
  _less than_<br>
  `5 < 2` → `false`

- **<==**<br>
  _less than or equal-to_

- **&&**<br>
  _and_ – if both the left and right evaluations are true, this returns true; otherwise it returns false

- **||**<br>
  _or_ – if the left or the right evaluation are true or both are true, this returns true; otherwise false

**Values can be variables or literals** which are fixed and cannot be changed.  For example, null.

Variables are set with values for use later.  The value can be any of the types you learned about above, or it could be the result of comparing two values.  You can then loop over those values, run them through a function to get a different result or make something happen, or even pass the value through an event to something listening for it.


## Things we will learn today

- Comments in code `//it's good to explain intent`

- A "statement" is a line of code that may do one thing like set a variable, or several things from right-to-left.  As a good defense to prevent bugs, **end statements with ;**

- Setting a variable:<br>
  `var a = 3;` a normal variable<br>
  `let b = 'string';` a block scoped variable<br>
  `const c = 3.14;` cannot be changed once set<br>
  _Both let and const are new with ES6_

- Conditional statements
  ```
  if (a === 1) {
    //do this
  } else if (a > 5) {
    //do something else
  } else {
    //otherwise do this
  }
  ```

- Debugging in JavaScript and Node.js and<br>
  Logging output in the console<br>
  `console.error(new Error('oh noz!!!'));`

- Make your own function and invoke it<br>
  ```
  var getGeo = function getGeo(lat, long) {
    return [lat, long];
  };
  var caa2A = getGeo(34.0579, -118.4142);
  ```

- Loops the new and easy way with .forEach()<br>
  ```
  var myArray = ['a', 'b', 'c'];
  var loopCallback = function (item, index, array) {
      console.log('\n\n item:', item);
      console.log('index:', index);
      console.log('index of array:', array[index]);
  };
  myArray.forEach(loopCallback);  //start the loop
  ```

- Listen for events and invoke functions<br>
  How apps and games are made...   _by you?_

# Node.js && JavaScript Practice

## Installation

You can install Node.js on your Windows PC, Mac or Linux computer.  It's available free online from [www.nodejs.org](http://www.nodejs.org), then download and run it.

## Starting at the Command Line Interface (cli)

In today's class, we've done the download/install step for you, but it's something you can do easily at home to start exploring on your own.

- In Windows, click Start and type `cmd` then press Enter
- On a Mac, press Command-Spacebar, type terminal and press Enter
- In Linux you're probably in a shell already, but for Ubuntu open a Shell

So with your new console open and awaiting a command, let's make a place to store your coding projects and then go into that directory.  Type:

`mkdir dev` and press Enter – mkdir makes a directory<br>
`cd dev` and press Enter – cd stands for change-directory, so you're going into it

Now let's make another directory to play in today

`mkdir nodebasics` and press Enter<br>
`cd nodebasics` and press Enter

Finally, we're fire up our Node JavaScript engine and try a few things

`node` and press Enter

Now let's try some examples like we learned above under **arrays** and **functions**.  Type the example code from those bullet-points into the node JavaScript interpreter and you'll be running commands directly to see the outcome:

```
var myArray = ['a', 'b', 'c'];
var loopCallback = function (item, index, array) {
    console.log('\n\n item:', item);
    console.log('index:', index);
    console.log('index of array:', array[i]);
};
c.forEach(loopCallback);    //start the loop
```

You should see some output like this:

```
Item: a
index: 0
index of array: a

item: b
index: 1
index of array: b
```

You also notice that `item` is the same as `array[index]`.  That's because the `index` is the position of the value in the `array`.<br>
Something else interesting is that the `index` starts at 0 instead of 1.  This is called zero-indexing, so remember that Array indexes start with _0_ and the last value is at _length-1_.

Next let's try making the simple function example from above.  Type each line as follows:

```
var getGeo = function getGeo(lat, long) {
    return [lat, long];
};
var caa2A = getGeo(34.0579, -118.4142);
```

Type all the commands as listed above, and you will have set a variable named caa2A.  We can view the value of this variable with the built in console.log() function:

`console.log(caa2A);` → `[34.0579, -118.4142]`

When we pass values into a function in the leading parenthesis, they are called `arguments`.  We passed in latitude and longitude --- `getGeo(lat, long)`.  _Just like we passed `lat, long` into the `getGeo` function, we also passed our `caa2A` variable into `console.log` function._  What we got back was an array constructed of the lat and long.  When invoked with `()`, function uses the `return` statement to give a value back.

So let's look at this line from right-to-left:

`var caa2A = getGeo(34.0579, -118.4142);`

We pass `lat, long` into the function, which returns an array, and then that gets set into the `caa2A` variable.  So remember that statements like settings this variable flow from right-to-left.

So basically we are running JS line-by-line at the command prompt.  But there's a better way – by creating a `.js` file and then running it with the `node` program/command.

## Running a script

Let's fire up a text edit.  It could be anything like a text editor, but why not use some cool tech to get it done with style.  Today we'll use a program called Sublime Text 2, which has a free trial use.

In the editor, you can type any of the examples from above, or experiment on your own.  Enter some statements, conditional if-else and have it do a console.log(result) at least once or at the end.

Save the files into your `dev/nodebasics` directory as `app.js`

Next we'll open a command prompt/terminal/shell like we did above, or use the same one if it's open.  Type the following command to tell Node.js to run/interpret your script file:

`node app.js`

Hopefully your script ran successfully and you noticed the result of the console.log statement.<br>
If you have an error, you'll see that first with a line-number reference to the problem.  It can be easy to debug problems.  We can also run node in [debug mode](https://nodejs.org/api/debugger.html).  A few of the debug commands are c to continue execution, and n to step to the next line.  Let's try our script again in debug mode:

`node debug app.js`

## Event driven functionality

When making something that responds to data or user input, we use [events](https://nodejs.org/api/events.html) to trigger a result.  Flip over to your text editor (Sublime/etc.) and make a new file, save it as `eventemitter.js` and enter the following:

```
const EventEmitter = require('events');
const util = require('util');
var newArray = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
var onFirst = function (item) {
   console.log('first item:', item);
};
var onFirstHalf = function (item) {
    console.log(item + ' in the first half of newArray');
};
var onSecondHalf = function (item) {
    console.log(item + ' in the second half of newArray');
};
var MyEmitter = function myEmitter() {
    EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);
const myEmitter = new MyEmitter();
myEmitter.on('first', onFirst);  //listen for `first` events
myEmitter.on('1stHalf', onFirstHalf);  //listen for `1stHalf` events
myEmitter.on('2ndHalf', onSecondHalf);  //listen for `2ndHalf` events
var loopCallback = function (item, index, array) {
    if (index === 0) {
        myEmitter.emit('first', item);
    } else if (index < array.length/2) {
        myEmitter.emit('1stHalf', item);
    } else {
        myEmitter.emit('2ndHalf', item);
    }
};
newArray.forEach(loopCallback);  //start the loop and events
```

Save your file, go to the shell and type the following – if you're feeling confident, try it without `debug`.

`node debug eventemitter.js`
    → `first 2`
    → `3 is in the first half`
    → `5 is in the first half`
etc...

## What would you do with this?

You could get requests from a browser or app/game and send back commands.  Or you could read sensors from an Arduino board to control a NodeBot.  An ultrasonic sensor could tell the bot to stop moving, or that sensor could have the NodeBot flash some eyes and make a noise.<br>
The next step is to just experiment; be a Developer.  Search the web for JavaScript and Node.js tutorials.  The more you practice, the more "ah ha" moments you'll have.  Then the only limit is your imagination...


--


# Resources

* http://github.com/gdibble/caa-nodeTraining | you can also download this repo or [clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#Cloning-an-Existing-Repository) with [git](https://git-scm.com) using:
  * `git clone https://github.com/gdibble/caa-nodeTraining.git`
* http://www.nodejs.org
* http://www.sublimetext.com/
* http://www.w3schools.com/js/
* http://www.codecademy.com/
* http://coderdojola.com/kids-coding-resources/
* http://developer.mozilla.org/en-US/
* http://developer.mozilla.org/en-US/docs/Web/Tutorials
* http://developer.mozilla.org/en-US/docs/Games
* http://creativejs.com/2011/08/31-days-of-canvas-tutorials/


--


_Made with ♥ by CAA_
