#!/usr/bin/env node

console.log('agent proc launched')

// FIXME: https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
declare var require: any
declare var process: any

require('./node-shims');

const argv = require('yargs').argv

const WebSocketClient = require('websocket').client;

import * as BeekeeprUniversalEngineNode from '../build/BeekeeprUniversalEngineNode.umd';

const {BKAccessProxyEvents, Engine} = BeekeeprUniversalEngineNode;

const engine = new Engine();

engine.getProxy().on(BKAccessProxyEvents.PeerConnect, () => {
    //console.log('peer connected');
});

engine.getPlayhead().on('update', () => {
    //console.log('time:', engine.getPlayhead().getCurrentTime());
});

engine.getPlayhead().play();

engine.setSource('https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8');

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


