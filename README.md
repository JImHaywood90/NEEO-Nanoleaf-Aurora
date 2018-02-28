Very basic Nanoleaf Aurora plugin for NEEO
Version 2.0

Allows the following functions;
Power On,
Power Off,
Brightness,
Colour (the NEEO UI doesn't have a colour wheel? so it's a slider),
More Colour! (Hue and Saturation now),

Aurora IP and Token are now automatically generated upon initialisation, as soon as you run index.js you'll need to hold the power button on your Aurora until the lights flash.

Your Aurora IP is detected using mdns looking for the _nanoleafapi.tcp broadcast - works for me but can;t guarantee it'll work for all.

The token is generated during device initialisation currently so jsut make sure the Aurora is ready if the token fails to generate.

Unfortunately, in  its current state you'll need to pair the Aurora every time you start the addon  but it's a good start

