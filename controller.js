'use strict';

//Load all requirements
const neeoapi = require('neeo-sdk');
const index = require('./index.js');
const AuroraApi = require('nanoleaf-aurora-client');
const request = require('request');
const NanoleavesApi = require('nanoleaves');
let localStorage;
let auroraEffects, numberOfEffects;
let auroraEffectsList, auroraEffectsLbs;

// import the MDNS  module to find IP Address of Aurora (potentially)
var mdns = require('mdns-js');

const DEVICE_POLL_TIME_MS = 4000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const MACRO_ALERT = 'ALERT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';


//don't edit this bit it's just defined here to prevent so many errors during initialisation (due to poor coding)
let rawToken //='FAKETOKEN';
let rawIP // ='111.111.111.111';
//let rawIP = "localhost";
//I just can;t work out how to only build the neeo device once the 'api'
//var has been set during initialisation, It must be possible. For now lets just fill it with dummy data?
//perhaps it should be using NEEO SDK discovery rather than initialisation
let api = new AuroraApi({
  host: '255.255.255.0',
  base: '/api/v1/',
  port: '16021',
  accessToken: 'abcdefghijklmno'
 });
let pollingIntervalId;
let nanoleafHost;
//let IPV4 = require('net').isIP(rawIP);

/////INITIALISATION FUNCTION
module.exports.initialise = function() {
  if (pollingIntervalId) {
    console.log('already initialised, ignore call');
    return false;
  }
  console.log('initialise Aurora service');
  pollingIntervalId = "setInterval";
 checkStatus();
  return;
};


function checkStatus(){
///looks to see if variables exist already

if (typeof localStorage === "undefined" || localStorage === null) {
  let LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//check for existing device variables to save fetchin' em again
//localStorage.removeItem('api');
//localStorage.removeItem('rawIP');
//localStorage.removeItem('nanoleafHost');
//localStorage.removeItem('rawToken');
api = localStorage.getItem('api'); 
rawIP = localStorage.getItem('rawIP');
nanoleafHost = localStorage.getItem('nanoleafHost');
rawToken = localStorage.getItem('rawToken'); 
console.log("rawIP: " +rawIP);
console.log("Nanoleafhost: " +nanoleafHost);
console.log("Token: " +rawToken);
console.log("Api: " +api);
if (rawIP == null) {
  console.log('No IP found. Starting detection.');
  findAuroraIP();
  return;
};
if (nanoleafHost == null) {
  console.log("No Nanoleaves dep var defined. Let's go get one");
  findAuroraIP();
  return;
};
if (rawToken == null) {
  console.log("we may already know your IP and Hostname but there's no API token yet..");
  console.log("let's sort that out...");
  generateToken();
  return;
};
if (api == null) {
  console.log("api var not detected in local storage, generating...")
  startAurora();
  return;
  //smash everything to pieces?
}
if (api != null) {
  console.log("api var detected in local storage")
  startAurora();
  return;
  //smash everything to pieces?
}
}

//First function called when initialised - searches for Aurora IP
function findAuroraIP(){

// Use the Nanoleaf Aurora API mdns broadcast service to detect Auroras IP
//mdns.excludeInterface('0.0.0.0')
var browser = mdns.createBrowser(mdns.tcp("nanoleafapi"));

//starts discovering
browser.on('ready', function onReady() {
  console.log('Nanoleaf MDNS browser is ready');
  browser.discover();
});

//saves the extracted IP address once found
browser.on('update', function onUpdate(data) {
 // console.log('data:', data);
  var steve = data.addresses;
  var alan = steve[0];
  //saves the detected rawIP for future useage
  rawIP = alan;
  localStorage.setItem('rawIP', rawIP);
  //Saves nanoleaf host for future use);
  nanoleafHost = rawIP +':16021';
  localStorage.setItem('nanoleafHost', nanoleafHost);
  //console.log("Aurora IP detected as: " + rawIP);
  //console.log("nanoleafHost var is now: " + nanoleafHost);
  console.log('stopping browser');
  browser.stop();
  //makes sure raw IP is defined as we need it to generate token
  ///ensure rawIP is a valid IP address
  let IP = require('net').isIP(rawIP);
  //if not valid - start searching nanoleapapi mdns again
  if (IP == 0) {findAuroraIP()};
    //if valid generate an API token
  //if (IPV4 == 4) {generateToken()};
  //makes sure rawIP actually exists
  if (rawIP) {
   //Prompt that device discovery is starting and allow time to hold button
   console.log('IP ADDRESS Detcted as ' + rawIP);
   console.log("Press and hold the power button on your Aurora for ~5-7 seconds now, until the lights flash");
   console.log("Generating will begin in 11 seconds...");
   //calls the token generating function after 11 seconds
   setTimeout(generateToken, 11000, "Time's up! Trying to generate token now...");
   }
  //below shouldn't ever be called as if the Aurora is unplugged or unavailable the browser update event will not
  else {
    console.error('Something went wrong generating a token with the detected IP ' + rawIP)
    console.log('Restarting device discovery..')
    findAuroraIP(); 
  }
});
}

////// GENERATE TOKEN /////////
///////////////////////////////

function generateToken(arg) {
  console.log(arg);
    // Device Discovery variable ting
    let requestTokenOptions = {
      method: 'POST',
      url: "http://" + nanoleafHost + "/api/beta/new",
    };
    
    //console.log("and outside the function it's.."  +nanoleafHost);
    //Output discovery details to console
    //console.log('Hold the on-off button down for 5-7 seconds until the LED starts flashing in a sexy pattern');
    
    request(requestTokenOptions, function(error, response, body) {
      if (error) {
        console.log('Error generating token: ' + error);
        //retry discovery
        findAuroraIP();
        return;
      }
     else {
    //output API key to console
    //  console.log("You'll need to use this key in controller.js so best jot it down!..." + response.body);
    //save API key to a variable for future reference? 
      var generatedApiToken = response.body;
     // console.log("what  does this say?" + generatedApiToken);
      var temp = generatedApiToken.split('"');
      rawToken = temp[3];
      localStorage.setItem('rawToken', rawToken);
     }
  
      if (rawToken == 'undefined') { 
        console.log("No token found, atempting device discovery again!");
        generateToken();
      }
      else {
      console.log("Hold that power button down!");
      }
  
  
      //makes sure that rawtoken exists otherwise tries discovery again;
      if (rawToken) {
       startAurora();
         return;
      }
      else {
       console.log("No token found, atempting device discovery again!");
          generateToken();
          return;
      }
      return;
    });
    }


  
    function startAurora(){
      //check for correct formatting rather than null eventually
      //nasty hack use the other variables to reconstruct the existing api var
      //the api var saved to local storage shows as undefined when retrieved
      //console.log(api);
      
    
      api = new AuroraApi({
       host: rawIP,
        base: '/api/v1/',
       port: '16021',
       accessToken: rawToken
       });
       //Save api to local storage
       //Doesn't currently work as it's an object not string
       //JSON stringify and parse doesnt work
       let apiString = JSON.stringify(api);
       localStorage.setItem('api', apiString);
       
//Now we've found Aurora and flashed to confirm pairing let's detect all the effects
//Just got to work out a way to use them with the remote, buttons?
api.listEffects()
.then(function(effects) {
  //Create Raw List of Effects
  //This is a string atm and we need to trim the first 2 and last 2 characters using slice
auroraEffectsList = effects.slice(2,-2);
//console.log('Effects: ' + auroraEffectsList); 
//Split raw list by comma, these values will have speech marks (so names with spaces work!)
auroraEffectsLbs = auroraEffectsList.split(',');
//Split by "," this way there are no speech marks. Used for button functions.
auroraEffects = auroraEffectsList.split('","');
//saves the effect names so we can label the effect buttons appropriately on restart
//This will loop through each effect and save to local storage!
var index, len;
numberOfEffects = auroraEffects.length;
//save number of detected effects for use on restart
localStorage.setItem('numberOfEffects', numberOfEffects)
for (index = 0, len = numberOfEffects; index < len; ++index) {
    console.log('Saving detected effect:' +auroraEffects[index]);
    localStorage.setItem('auroraEffects'+index, auroraEffectsLbs[index]);
  }

})
.catch(function(err) {
console.log('Unable to find any effects')
console.error(err);
return;
});

       //All ready to go now - notify console!

       api.identify()
       .then(function() {
            console.log('Aurora flashing to confirm success!!');
            console.log('# READY! use the NEEO app to search for "Aurora" and "effects".');
        })
        .catch(function(err) {
           console.log('the Aurora is not responding - it may still work. Otherwise restart.')
           console.error(err);
           //if the identify fubnction fails then the api var is wrong.
           //It canalso fail if it's processing effects arrya but still work
           //attempt automatic repair (rerun intial discovery function)
           // findAuroraIP();
           //
           return;
        }); 


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
//actual functions called once api var is generated

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

function setTestEffect(value) {
console.log('setting effect...' + value);
api.setEffect(value)
  .then(function() {
    console.log('Success! Set Aurora to ' +value);
  })
  .catch(function(err) {
    console.error(err);
  });
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
    //use for loop to set events for all the dynamic effect buttons
    //rather than writing 40+ individual if statements!
    //Power functions must be first for the buttons loop to work correctly
    if (name === "POWER_TOGGLE") {
      console.log("finding device power status");
      console.log('no idea how to query device status - true/false is logged to console corrctly but thats it')
    }
  
    if (name === "POWER OFF") {
      console.log("Send Power Off to Aurora");
      api.turnOff();
      return;
    }
    if (name === "POWER ON") {
        console.log("Send Power On to Aurora");
        api.turnOn();
        return;
    }
    let index, len
    for (index = 0, len = numberOfEffects; index < len; ++index) {
      //eventually worked this one out!
      //indexof and includes were sending 1,0 and 10 for 10,  2,3 and 23 for  23
      //the below regex resolves the problem with temp vars txt and numb
      var txt = name;
      //Regex strip all numbers from name and join together in order
      //Use the number against the index to match button to effect
      var numb = txt.match(/\d/g);
      numb = numb.join("");
      if (numb == index){
          // debugging console.log('LOOPING DETECT');
          //console.log("Send button " +index +" to Aurora");
          setTestEffect(auroraEffects[index]);
      }
    }
  };