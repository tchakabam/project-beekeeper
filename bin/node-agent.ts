#!/usr/bin/env node

// FIXME: https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
declare var require: any
declare var process: any

require('./node-shims');

import * as BeekeeprUniversalEngineNode from '../build/BeekeeprUniversalEngineNode.umd';

const {BKAccessProxyEvents, Engine} = BeekeeprUniversalEngineNode;

console.log('# Beekeeper NodeAgent >', 'agent proc launched\n')

const engine = new Engine();

engine.getProxy().on(BKAccessProxyEvents.PeerConnect, () => {
    //console.log('peer connected');
});

engine.getPlayhead().on('update', () => {
    console.log('time:', engine.getPlayhead().getCurrentTime());
});

engine.getPlayhead().play();

engine.setSource('https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8');

engine.start();


