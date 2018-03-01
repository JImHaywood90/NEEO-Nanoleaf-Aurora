if (typeof localStorage === "undefined" || localStorage === null) {
  let LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
 
var rawIP = localStorage.getItem('rawIP');
var nanoleafHost = localStorage.getItem('NanoleafHost');
console.log(rawIP);
if (rawIP == null) {findAuroraIP};
if (nanoleafHost == null) {findAuroraIP};
if (rawToken == null) {generateToken};

alan = '192.168.1.8'
localStorage.setItem('rawIP', alan);
localStorage.setItem('nanoleafHost', alan);
localStorage.setItem('rawToken', alan);