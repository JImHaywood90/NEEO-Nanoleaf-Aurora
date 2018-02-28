'use strict';

//Load all requirements
let rawIP;
const neeoapi = require('neeo-sdk');
const controller = require('./controller.js');
const AuroraApi = require('nanoleaf-aurora-client');
const request = require('request');
const NanoleavesApi = require('nanoleaves');

// import the MDNS  module to find IP Address of Aurora (potentially)
var mdns = require('mdns-js');

// edit the host and accessToken with your Aurora IP and API Token
//const api = new AuroraApi({
//host: '192.168.128.14',
//base: '/api/v1/',
//port: '16021',
//accessToken: '928VdZThviM8MHyEsv3SSdD6AbbR9doG'
 //});

const DEVICE_POLL_TIME_MS = 4000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const MACRO_ALERT = 'ALERT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';
let rawToken = 'NOT_INITIALISED';
let api;
let pollingIntervalId;
let nanoleafHost;

module.exports.initialise = function() {
  if (pollingIntervalId) {
    console.log('already initialised, ignore call');
    return false;
  }
  console.log('initialise Aurora service');
  pollingIntervalId = "setInterval";
  findAuroraIP();
};

function firstTime () {
  if(typeof rawToken === "undefined") {
  console.log("something may have gone wrong, let's try again...");
  console.log("API Token unknown" + rawToken);
    generateToken();
} 
else if (rawToken === "NOT_INITIALISED") {
  console.log("Welcome")
   console.log("Hold your Aurora button now!")
  generateToken();
}
else if (typeof api === "undefined") {
  console.log("That's odd - seek help! Retrying!");
generateToken();
}
else {
  generateToken();
}
};

//Function to potentially generate token?
function findAuroraIP(){

// Use the Nanoleaf Aurora API mdns broadcast service to detect Auroras IP
//mdns.excludeInterface('0.0.0.0')
var browser = mdns.createBrowser(mdns.tcp("nanoleafapi"));

browser.on('ready', function onReady() {
  console.log('browser is ready');
  browser.discover();
});


browser.on('update', function onUpdate(data) {
  console.log('data:', data);
  var steve = data.addresses;
  var alan = steve[0];
  rawIP = alan;
  console.log(steve + " " + alan);
  nanoleafHost = rawIP +':16021';
  console.log("Aurora IP detected as: " + rawIP);
  console.log("nanoleafHost var is now: " + nanoleafHost);
  browser.stop();
  generateToken();
});

}

////// GENERATE TOKEN /////////
///////////////////////////////

function generateToken() {

  // Device Discovery variable ting
  let requestTokenOptions = {
    method: 'POST',
    url: "http://" + nanoleafHost + "/api/beta/new",
  };
  
  console.log("and outside the function it's.."  +nanoleafHost);
  //Output discovery details to console
  console.log('Hold the on-off button down for 5-7 seconds until the LED starts flashing in a sexy pattern');
  
  request(requestTokenOptions, function(error, response, body) {
    if (error) {
      console.log('Error generating token: ' + error);
      return;
    }
  //output API key to console
  //  console.log("You'll need to use this key in controller.js so best jot it down!..." + response.body);
  //save API key to a variable for future reference? 
    var generatedApiToken = response.body;
   // console.log("what  does this say?" + generatedApiToken);
    var temp = generatedApiToken.split('"');
    rawToken = temp[3];
    console.log("Generated new token..." + rawToken);
    //this is where the api is actually called! don't ask!
     api = new AuroraApi({
      host: rawIP,
      base: '/api/v1/',
      port: '16021',
      accessToken: rawToken
     });
    return api;
    console.log(api);
  });
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//test functions for ip address
///////////////////////////////////////////////////////////////////////////////////////////////////////
//actual functions 

function setBrightness(deviceId, value) {
    var sourcerawsource = parseInt(value)
    console.log('Setting brightness to: ' + sourcerawsource);
    return api.setBrightness(sourcerawsource)
    .then(function() {
      console.log('Success!');
    })
    .catch(function(err) {
      console.error(err);
    });
  }
  
  function getBrightness(deviceId) {
    return api.getBrightness(deviceId);
  }

  function setHue(deviceId, value) {
    var drHue = parseInt(value)
    console.log('Setting hue know what to: ' + drHue);
    return api.setHue(drHue)
    .then(function() {
      console.log('Success!');
    })
    .catch(function(err) {
      console.error(err);
    });
  }
  
  function getHue(deviceId) {
    return api.getHue(deviceId);
  }

  function setSat(deviceId, value) {
    var Satval = parseInt(value)
    console.log("I hope you're 'sat' down - Updating Sat: " + Satval );
    return api.setSat(Satval)
    .then(function() {
      console.log('Success!');
    })
    .catch(function(err) {
      console.error(err);
    });
  }
  
  function getSat(deviceId) {
    return api.getSat(deviceId);
  }

//Brightness and Colour Slider Handlers
module.exports.brightnessSliderCallback = {
    setter: setBrightness,
    getter: getBrightness,
  };

module.exports.hueSliderCallback = {
    setter: setHue,
    getter: getHue,
  };

module.exports.satSliderCallback = {
    setter: setSat,
    getter: getSat,
  };

//Detect button press and then perform appropriate function 
module.exports.onButtonPressed = function onButtonPressed(name,deviceid) {
    console.log('[CONTROLLER]', name, 'button was pressed!');
  
    if (name === "POWER_TOGGLE") {
      console.log("finding device power status");
      console.log('no idea how to query device status - true/false is logged to console corrctly but thats it')
    }
  
    if (name === "POWER OFF") {
      console.log("Send Power Off to Aurora");
      api.turnOff();
    }
    if (name === "POWER ON") {
        console.log("Send Power On to Aurora");
        api.turnOn();
    }
    if (name === "ALERT") {
      console.log("Is it your first time?");
      firstTime();
  }
  };