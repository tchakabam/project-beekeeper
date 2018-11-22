#!/usr/bin/env node

// FIXME: https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
declare var require: any
declare var process: any

require('./node-shims');

import * as BeekeeprHeadlessAgentNode from '../build/BeekeeprHeadlessAgentNode.umd';

const {BKAccessProxyEvents, Engine} = BeekeeprHeadlessAgentNode;

console.log('# Beekeeper NodeAgent >', 'agent proc launched\n')

var url;

//url = 'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8';

// url = 'https://wowzaprodhd25-lh.akamaihd.net/i/9e329736_1@364238/master.m3u8';

url = 'https://wowza.peer5.com/live/smil:bbb_abr.smil/chunklist_w80478204_b2204000.m3u8';

//url = 'https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8';

const engine = new Engine();

engine.getProxy().on(BKAccessProxyEvents.PeerConnect, () => {
    //console.log('peer connected');
});

engine.getPlayhead().on('update', () => {
    console.log('---> playhead clock-time:', engine.getPlayhead().getCurrentTime());
});

engine.getPlayhead().play();

engine.setSource(url);

engine.start();


