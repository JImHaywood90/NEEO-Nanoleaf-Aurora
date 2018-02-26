'use strict';

// Nanoleaf Aurora Support thanks to Geert Wille (@GeertWille) and Niels de Klerk (@nklerk) for their initial work

const neeoapi = require('neeo-sdk');
const controller = require('./controller.js');

//We Use the Nanoleaf-Aurora-CLient NPM module to communicate with Aurora
//Remember to edit host name and api token in controller.js :)
const AuroraApi = require('nanoleaf-aurora-client');

// Create a slider to adjust Aurora's brightnes
const slider = {
  name: 'brightness',
  label: 'Dimmer',
  range: [0, 100],
  unit: '%'
};

//Create a second slider that changes the Aurora's colour
const slider2 = {
  name: 'colour',
  label: 'Colour',
  range: [0, 360],
  unit: 'number'
};

//Create Power Switch
const powerSwitch = {
  name: 'power',
  label: 'Power'
};

//this would be nice but not worked out how yet
const discoveryInstructions = {
  headerText: 'Discover devices',
  description: 'NEEO will discover your Aurora now, press NEXT'
};

//Power toggle currently not working - don't know how to use api.getPowerStatus()
const POWER_TOGGLE_BUTTON = { name: 'POWER_TOGGLE', label: 'Power Toggle' };
//Alert button is not needed just yet
const ALERT_BUTTON = { name: 'ALERT', label: 'Alert' };

const aurora = neeoapi.buildDevice('Smart Light')
  .setManufacturer('Nanotech')
  .addAdditionalSearchToken('Rhythm')
  .setType('LIGHT')
  .addSlider(slider2, controller.hueSliderCallback)
  .addButtonGroup('Power')
 //.addButton(POWER_TOGGLE_BUTTON)
 // .addButton(ALERT_BUTTON)
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(slider, controller.brightnessSliderCallback)
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
    console.log('# READY! use the NEEO app to search for "Aurora".');
  })
  .catch((err) => {
    console.error('ERROR!', err);
    process.exit(1);
  });
