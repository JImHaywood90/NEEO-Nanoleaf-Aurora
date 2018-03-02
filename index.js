'use strict';

// Nanoleaf Aurora Support

const neeoapi = require('neeo-sdk');
const controller = require('./controller.js');
const request = require('request');

//We Use the Nanoleaf-Aurora-CLient and Nanoleaves NPM modules to communicate with Aurora
const AuroraApi = require('nanoleaf-aurora-client');
const NanoleavesApi = require('nanoleaves');
const nanoleafHost = '192.168.128.14:16021';

// Create a slider to adjust Aurora's brightnes
const BriSlider = {
  name: 'brightness',
  label: 'Dimmer',
  range: [0, 100],
  unit: '%'
};


//Create a second slider that changes the Aurora's Hue
const HueSlider = {
  name: 'hue',
  label: 'Hue',
  range: [0, 360],
  unit: 'number'
};

//Create a third slider that changes the saturation
const SatSlider = {
  name: 'sat',
  label: 'Saturation',
  range: [0, 100],
  unit: 'number'
};

//Create Power Switch
const powerSwitch = {
  name: 'power',
  label: 'Power'
};


//Power toggle currently not working - don't know how to use api.getPowerStatus()
const POWER_TOGGLE_BUTTON = { name: 'POWER_TOGGLE', label: 'Power Toggle' };
//Alert button is not needed just yet
const ALERT_BUTTON = { name: 'ALERT', label: 'Alert' };

const aurora = neeoapi.buildDevice('Smart Light')
  .setManufacturer('Nanotech')
  .addAdditionalSearchToken('Rhythm')
  .addAdditionalSearchToken('Aurora')
  .setType('LIGHT')
  .addButtonGroup('Power')
 //.addButton(POWER_TOGGLE_BUTTON)
  //.addButton(ALERT_BUTTON)
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(HueSlider, controller.hueSliderCallback)
  .addSlider(SatSlider, controller.satSliderCallback)
  .addSlider(BriSlider, controller.brightnessSliderCallback)
  .registerInitialiseFunction(controller.initialise)
;


console.log('- discover one NEEO Brain...');
neeoapi.discoverOneBrain()
  .then((brain) => {
    console.log('- Brain discovered:', brain.name);

    console.log('- Start server');
    return neeoapi.startServer({
      brain,
      port: 6336,
      name: 'aurora',
      devices: [aurora]
    });
  })
  .then(() => {
    console.log('# We just need to find and Pair Aurora quickly...');
  })
  .catch((err) => {
    console.error('ERROR!', err);
    process.exit(1);
  });
