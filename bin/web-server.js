#!/usr/bin/env node

const nodeStatic = require('node-static');
const path = require('path');

const publicPath = path.resolve('./');

console.log('# Beekeeper NodeAgent >', 'public path:', publicPath, '\n')

//
// Create a node-static server instance to serve the './public' folder
//
const file = new nodeStatic.Server(publicPath);

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(process.env.PORT || 8080);
