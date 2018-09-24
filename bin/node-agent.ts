require('./node-shims');

import {Engine, BKAccessProxyEvents} from '../engines/universal-engine/lib';

const engine = new Engine();

engine.getProxy().on(BKAccessProxyEvents.PeerConnect, () => {
    console.log('peer connected');
});

engine.getPlayhead().on('update', () => {
    console.log('time:', engine.getPlayhead().getCurrentTime());
});

engine.getPlayhead().play();

engine.setSource('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8');
engine.start();
