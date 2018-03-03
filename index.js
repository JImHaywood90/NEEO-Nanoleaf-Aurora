'use strict';

// Nanoleaf Aurora Support for NEEO - With Effects, Brightness and Colour
//
// Information //
//
// There should be no need to update any values manually!
//
// This Driver creates two Devices
// 1. Nanoleaf Smart Light
// 2. Nanoleaf Aurora Effects
//
// Instructions //
//
// Simply run the driver, when prompted hold the power button down on the Aurora to pair
// You'll know it's paired when the Aurora flashes. When this happens, restart the driver!
// Restarting will update the effect labels on the device - they were detected during intialisation
// 
// You can use the Nanoleaf Smart Device without restarting...
// Although Aurora Effects device may work but the names of the effects will not match your Aurora!
// 
//                 
// Troubleshooting //
//               
//  - Have you tried switching it off and on again?! ;)
//  
//  - If you have added the Aurora Effects Device and the labels start with #..
//    restart the driver. 
//    The real effect labels are generated upon device initialisation
//    They are then saved to Storage to prevent constant discovery along with the
//    API token and Aurora IP address,until they are retrieved they use fedault valuse
//    such as "Fireflies"
//
//  - If the automated device discovery fails for any reason and it just keeps looping
//    the values can be overwritten manually if detected incorrectly by editing...
//    ./scratch {variablename} 
//  
//  - Hopefully any other issues will be easily resolved by checking the values contained in
//    the files within ./scratch - these are effectively all the custom variables that 
//    are generatd by mdns etc.
//
//  - If there are no files in ./scratch try copying the dummy files from the ./scratch/examples
//    folder. Edit the files with your IP and API key as per the example files.
//
/////////////////////////////////////////////////////////////////////////////////////////////


const neeoapi = require('neeo-sdk');
const controller = require('./controller.js');
const request = require('request');
//all these vars relate to the Aurora effects device
let localStorage, numberOfEffects, effectbuttonname, effectbuttonnamelabel,storageEffectsNumber;
let effectname, effectnamelabel, effect6, effect5, effect4, effect3, effect2, effect1;
let effectBtn1, effectBtn2, effectBtn3, effectBtn4, effectBtn5, effectBtn6, effectBtn7;
let effectBtn8,effectBtn9,effectBtn10,effectBtn11,effectBtn12,effectBtn13,effectBtn14,effectBtn15,effectBtn16,effectBtn17,effectBtn18;
let effectBtn19,effectBtn20,effectBtn21,effectBtn22,effectBtn23,effectBtn24,effectBtn25
var effectBtn = {}; // object

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

    console.log('effects not already detected... making dummy buttons!')
    var index, len, auroraEffects;
  
    for (index = 0, len = 24; index < len; ++index) {
      let label = "Dummy"+index;
      let name = "DummyName"+index;
      effectBtn[index] = {
        name: name,
        label: label
      };
   console.log(label);
  }
}

//All these vars relate to the Nanoleaf Smart Light device


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
 // .addButton(ALERT_BUTTON)
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(HueSlider, controller.hueSliderCallback)
  .addSlider(SatSlider, controller.satSliderCallback)
  .addSlider(BriSlider, controller.brightnessSliderCallback)
  .registerInitialiseFunction(controller.initialise)
;

//Currently just 6 effects are supported

const effectsDevice = neeoapi.buildDevice('Aurora Effects')
  .setManufacturer('Nanotech')
  .addAdditionalSearchToken('Effects')
  .addAdditionalSearchToken('Aurora')
  .setType('LIGHT')
  //There's surely a better way to add all these buttons
  .addButton(effectBtn[1])
  .addButton(effectBtn[2])
  .addButton(effectBtn[3])
  .addButton(effectBtn[4])
  .addButton(effectBtn[5])
  .addButton(effectBtn[6])
  .addButton(effectBtn[7])
  .addButton(effectBtn[8])
  .addButton(effectBtn[9])
  .addButton(effectBtn[10])
  .addButton(effectBtn[11])
  .addButton(effectBtn[12])
  .addButton(effectBtn[13])
  .addButton(effectBtn[14])
  .addButton(effectBtn[15])
  .addButton(effectBtn[16])
  .addButton(effectBtn[17])
  .addButton(effectBtn[18])
  .addButton(effectBtn[19])
  .addButton(effectBtn[20])
  .addButton(effectBtn[21])
  .addButton(effectBtn[22])
  .addButtonHandler(controller.onButtonPressed)
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
      devices: [aurora,effectsDevice]
    });
  })
  .then(() => {
    console.log('# Running initialisation. Remain vigilant!');
  })
  .catch((err) => {
    console.log('Something went wrong')
    console.error('ERROR!', err);
    process.exit(1);
  });
