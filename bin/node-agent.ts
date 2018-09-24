#!/usr/bin/env node

console.log('agent proc launched')

require('./node-shims');

const argv = require('yargs').argv

const WebSocketClient = require('websocket').client;

import {Engine, BKAccessProxyEvents} from '../engines/universal-engine/lib';

const engine = new Engine();

engine.getProxy().on(BKAccessProxyEvents.PeerConnect, () => {
    //console.log('peer connected');
});

engine.getPlayhead().on('update', () => {
    //console.log('time:', engine.getPlayhead().getCurrentTime());
});

engine.getPlayhead().play();

engine.setSource('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8');
engine.start();

/*
if (argv.connectToHerdWebsocket) {
    createWebsocketClient("ws://localhost:");
}
*/

function exit() {
    console.log('Exiting process');
    process.exit(0);
}

/*

function createWebsocketClient(url: string): any {

    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection error: " + error.toString());
            exit();
        });
        connection.on('close', function() {
            console.log('Websocket connection closed');
            exit();

        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });

        function sendNumber() {
            if (connection.connected) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                connection.sendUTF(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
        //sendNumber();
    });

    client.connect(url, 'echo-protocol');

    return client;
}
*/


