//  _   _  ______  ______  ____             _    _  _____    ____   _____            
// | \ | ||  ____||  ____|/ __ \      /\   | |  | ||  __ \  / __ \ |  __ \     /\    
// |  \| || |__   | |__  | |  | |    /  \  | |  | || |__) || |  | || |__) |   /  \   
// | . ` ||  __|  |  __| | |  | |   / /\ \ | |  | ||  _  / | |  | ||  _  /   / /\ \  
// | |\  || |____ | |____| |__| |  / ____ \| |__| || | \ \ | |__| || | \ \  / ____ \ 
// |_| \_||______||______|\____/  /_/    \_\\____/ |_|  \_\ \____/ |_|  \_\/_/    \_\
//                                                                                  
// Information //
//
// Nanoleaf Aurora Support for NEEO - With Effects, Brightness and Colour
// There should be no need to update any values manually!
//
// This Driver creates two Devices
// 1. Nanoleaf Smart Light
// 2. Nanoleaf Aurora Effects
//
// Instructions //
//
// Simply run the driver, The first time you run it you will be prompted to add the device to NEEO to continue device
// discovery and initialisation phase. Once the device has been added toNEEO you will then be automatically prompted to 
// hold the power button down on the Aurora to pair and complete setup.
// You'll know it's paired when the Aurora flashes. When this happens, restart the driver and add the effects device
// to Neeo. This way the effects device will contain a custom lsit of your Aurora effects and animations. 
// Any subsequent server restarts should then be much quicker as the disocvery phase will not have to run
//
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
// Known Issues //
//
//
//  - The initial device discovery is a bit hit and miss at the moment, need to determine how to only
//    build the effects device once effects have been detected really. The initialisation function is currently not    //    being used correctly at all.
//  - Sometimes the effect device needs to be added and removed a few times before the custom effect names are correctly //    displayed in the app.
//  - I beleive that if the nanoleaf mdns brodcast fails it wil currently pick up an incrrect IP address and think it  //    has worked, if this happens simply edit the rawIP file in ./scratch with the correct IP address which can be 
//    obtained manually from a network scan.
//  - If you add new effects to Aurora you'll need to restart the driver twice and readd the effects device in the NEEO //    app to see the new effects listed. (same goes for rmeoving effects)
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////