// Standalone usage
var XMLHttpRequest = require('node-http-xhr');

// Usage as global XHR constructor
global.XMLHttpRequest = require('../ext-mod/node-http-xhr/lib');

var URL = require('url');

global.URL = URL;

global.window = {
    performance: {
        now: () => Date.now()
    },
    setTimeout: global.setTimeout,
    setInterval: global.setInterval,
    clearTimeout: global.clearTimeout,
    clearInterval: global.clearInterval
};

global.wrtc = require('wrtc');
