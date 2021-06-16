const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config();

// Define configuration options
const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  channels: [
    process.env.CHANNELS
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  console.log(`--> Incoming message: ${msg}`)
  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}


/*var play = require('play');

// play with a callback
play.sound('./wavs/sfx/intro.wav', function(){

  // these are all "fire and forget", no callback
  play.sound('./wavs/sfx/alarm.wav');
  play.sound('./wavs/sfx/crinkle.wav');
  play.sound('./wavs/sfx/flush.wav');
  play.sound('./wavs/sfx/ding.wav');

});

//If you want to know when the player has defintely started playing
play.on('play', function (valid) {
  console.log('I just started playing!');
});
play.sound('./wavs/sfx/ding.wav');

//If you want to know if this can't play for some reason
play.on('error', function () {
  console.log('I can\'t play!');
});*/
