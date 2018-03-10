# Information

Nanoleaf Aurora Support for NEEO - With Effects, Brightness and Colour
There should be no need to update any values manually!

 This Driver creates two Devices
 1. Nanoleaf Smart Light
 2. Nanoleaf Aurora Effects

### Instructions

1. Launch the driver
2. Search for the **Aurora** device and add to NEEO
3. Once the device has been added to NEEO the driver will begin to detect and pair with the Aurora.
4. Press and hold the power button on the Aurora for 5-7 seconds when prompted to do so - you have 11 seconds before the first atempt to generate an API token begins which should be plenty of time.
5. The Aurora will flash when it is paired correctly and ready to go
6. Restart the driver to update the Effects device button lables to match your Aurora's effects and animations.
7. Search for **Effects** and add the Effects device to NEEO
8. Edit exisitng recipes and add shortcuts to the effects and power/brightness settings from the Auroa and Effects devices that you wish to control with NEEO

 You can now contrlol birghtness, colour, power and all cutom effects drectly fromyour NEEO remote - if you're feeling frivolous you can even edit your Sonos recipe so that your NEEO automatically switches the Aurora to a Rhythm effect when yow activate it :)

**Note. You can use the Nanoleaf Smart Device without restarting the driver but the effects device will contain incorrect name labels eg. *Dummy1***



### Troubleshooting
          
  - Have you tried switching it off and on again?! ;)
  - If you have added the Aurora Effects Device and the labels start with #... restart the driver. The real effect labels are generated upon device initialisation. They are then saved to Storage to prevent constant discovery along with the API token and Aurora IP address,until they are retrieved they use default values such as "Dummy 1"

 - If the automated device discovery fails for any reason and it just keeps looping the values can be overwritten manually if detected incorrectly by editing... ./scratch {variablename} 

- Hopefully any other issues will be easily resolved by checking the values contained in the files within ./scratch - these are effectively all the custom variables that are generatd by mdns etc.

- If there are no files in ./scratch try copying the dummy files from the ./scratch/examples folder. Edit the files with your IP and API key as per the example files.

### Known Issues

- The initial device discovery is a bit hit and miss at the moment, need to determine how to only
build the effects device once effects have been detected really. The initialisation function is currently not being used correctly at all.

- Sometimes the effect device needs to be added and removed a few times before the custom effect names are correctly displayed in the app.

- I beleive that if the nanoleaf mdns brodcast fails it wil currently pick up an incorrect IP address and think it has worked, if this happens simply edit the rawIP file in ./scratch with the correct IP address which can be obtained manually from a network scan.

- If you add new effects to Aurora you'll need to restart the driver twice and re-add the effects device in the NEEO app to see the new effects listed. (same goes for ermoving effects)
