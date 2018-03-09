'use strict';
////////////////////////////////////////////////////////////////////////////
//                                                                        //
// Nanoleaf Aurora Support for NEEO - With Effects, Brightness and Colour //
//                         by Jim Haywood                                 //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

const neeoapi = require('neeo-sdk');
const controller = require('./controller.js');
const request = require('request');
//all these vars relate to the Aurora effects device
let localStorage, numberOfEffects, effectbuttonname, effectbuttonnamelabel,storageEffectsNumber;
let effectname, effectnamelabel;
var effectBtn = {}; // object
var effectsDevice = {}; // object

//Build up a lsit of all available effects (if aleady detected and inject into custom driver "effets")
if (typeof localStorage === "undefined" || localStorage === null) {
  let LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
  console.log('loaded scratch');
  numberOfEffects = localStorage.getItem('numberOfEffects');
}
else {
  console.log('LocalStorage already defined. Sortitng effects.')
  numberOfEffects = localStorage.getItem('numberOfEffects');
}

if (numberOfEffects != null) {
  console.log('effects detected... downloading them!')
  var index, len, auroraEffects;

for (index = 0, len = numberOfEffects; index < len; ++index) {
    let effectnumber = 'effect'+index;
    let effectlabel = localStorage.getItem('auroraEffects'+index);
    let storageEffectsNumber = 'auroraEffects'+index;
    let effectbuttonname = 'effectBtn'+index;
    let effectbuttonnamelbl = '"'+effectbuttonname+'"';
    let effectnametemp = localStorage.getItem(storageEffectsNumber);
    let effectname = effectnametemp.replace(/^"(.*)"$/, '$1');
   // console.log('creating button element for ' +effectbuttonname);
    //console.log(effectname +effectnametemp +effectbuttonname + effectbuttonnamelbl);
    effectBtn[index] = {
      name: effectbuttonnamelbl,
      label: effectlabel
    };
   // console.log(effectBtn[3]);
    }

}
  else {
    //This should only run before we pair with Aurora, the effects device will fail without
    //generating fake buttons.Once connected to Aurora the lables and buttons will be updated
    //JUst restart this driveronce it lists the detected effects to console

    console.log('effects not already detected... making temporary dummy buttons!')
    var index, len, auroraEffects;
  
    for (index = 0, len = 1; index < len; ++index) {
      let label = "Dummy"+index;
      let name = "DummyName"+index;
      effectBtn[index] = {
        name: name,
        label: label
      };
  // console.log(label);
  }
}

////////////////////////////////////////////////////////////
//                                                        //
//All these vars relate to the Nanoleaf Smart Light device//
//                                                        //
////////////////////////////////////////////////////////////

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

//Now supports as many effects as you can throw at it

effectsDevice = neeoapi.buildDevice('Aurora Effects')
  .setManufacturer('Nanotech')
  .addAdditionalSearchToken('Effects')
  .addAdditionalSearchToken('Aurora')
  .setType('LIGHT')
  .addButton(ALERT_BUTTON)
  //we add the effect buttons in the below loop
  //this way it doesn't matter how many effects are detected
  .addButtonHandler(controller.onButtonPressed)
;

//this might just work! we now only add the effects if there are any to add!
//number of effects is the last effect var saved to storage so if it exists
//start building the device and inject appropriate amount of custom buttons.
if (numberOfEffects) {
var index, len, auroraEffects;
for (index = 0, len = numberOfEffects; index < len; ++index) {
effectsDevice.addButton(effectBtn[index]);
}
}

console.log('- discover one NEEO Brain...');
neeoapi.discoverOneBrain()
  .then((brain) => {
    console.log('- Brain discovered:', brain.name);

    console.log('- Start server');
    return neeoapi.startServer({
      brain,
      port: 6336,
      name: 'aurora',
      devices: [aurora,effectsDevice]
    });
  })
  .then(() => {
    console.log('Search for Nanoleaf using the NEEO app and add the device now to continue...');
    console.log('The initialisation will not run until it detects you have added the device')
    console.log('If you have already added the Aurora Smart Light device to NEEO, no action is required.')
  })
  .catch((err) => {
    console.log('Something went wrong')
    console.error('ERROR!', err);
    process.exit(1);
  });
