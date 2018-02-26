Very basic Nanoleaf Aurora plugin for NEEO
Version 1.1

Allows the following functions;
Powwer On
Power Off
Brightness
Colour (the NEEO UI doesn't have a colour wheel? so it's a slider)



 Host IP and API Token will need to edited manually in "controller.js" at the moment.

- Host IP Can be found dynamically by its mdns broadcast in terminal using the below command (requires avahi-utils);

avahi-browse _nanoleafapi._tcp --resolve -t |grep address| cut -d "=" -f2 | tr -d '[]'

Unfortunately, i've not worked out how to do this in nodejs yet

- Api Token needs to be generated manually (I used nanoleaves npm module I think but I can't remember how)



