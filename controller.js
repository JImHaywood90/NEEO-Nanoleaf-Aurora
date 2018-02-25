'use strict';


const neeoapi = require('neeo-sdk');
const controller = require('./controller.js');
const AuroraApi = require('nanoleaf-aurora-client');
const request = require('request');

// edit the host and accessToken with your Aurora IP and API Token
const api = new AuroraApi({
  host: '192.168.128.14',
  base: '/api/v1/',
  port: '16021',
  accessToken: '928VdZThviM8MHyEsv3SSdD6AbbR9doG'
});

const DEVICE_POLL_TIME_MS = 4000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const MACRO_ALERT = 'ALERT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';



  api.turnOn()
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });

  api.turnOff()
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });


  api.getBrightness()
  .then(function(brightness) {
    console.log('Brightness: ' + brightness);
  })
  .catch(function(err) {
    console.error(err);
  });

  api.setBrightness(10)
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });

  api.getInfo()
  .then(function(info) {
    console.log('Device information: ' + info);
  })
  .catch(function(err) {
    console.error(err);
  });

  api.getPowerStatus()
  .then(function(info) {
    console.log('Power status: ' + info);
  })
  .catch(function(err) {
    console.error(err);
  });

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

module.exports.brightnessSliderCallback = {
    setter: setBrightness,
    getter: getBrightness,
  };

module.exports.hueSliderCallback = {
    setter: setHue,
    getter: getHue,
  };
  
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
  
  };