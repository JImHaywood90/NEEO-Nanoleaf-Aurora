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

Managed to implementlocalstorage to save generated API token and Aurora IP for reuse
This Should mean Aurora only hastobepaired once - when initially running the plugin.

IF API key is not generated correctly It will currently just loop until the Aurora is ready to pair (power button held down until lights start flashing) or it will loop forever.