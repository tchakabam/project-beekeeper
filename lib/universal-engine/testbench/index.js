var engine;

//var url = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

var url = 'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8';

var elUrl = document.querySelector('#url');
var elPeerId = document.querySelector('#peer-id');
var elSwarmId = document.querySelector('#swarm-id');
var elRtcConfig = document.querySelector('#rtc-config');
var elTrackerConn = document.querySelector('#tracker-connection');
var elPeers = document.querySelector('#peers');
var elMediaClock = document.querySelector('#media-clock');

function initEngine() {
    elUrl.value = elUrl.value || url;

    engine = new BeekeeprUniversalEngine.Engine();

    engine.getProxy().on(BeekeeprUniversalEngine.BKAccessProxyEvents.PeerConnect, () => {
        updateControls();
    });

    engine.getPlayhead().on('update', () => {
        elMediaClock.value = Number(engine.getPlayhead().getCurrentTime()).toFixed(3);

        if (engine.getPlayhead().isPushed()) {
            document.querySelector('#playhead-on').style = 'display: inline';
        } else {
            document.querySelector('#playhead-on').style = 'display: none';
        }
    });

    window.p2pMediaEngine = engine;
}

function initSourceUrl() {
    engine.setSource(document.querySelector('#url').value);
}

function updateControls() {
    elPeerId.value = engine.getPeerId();
    elSwarmId.value = engine.getSwarmId();
    elRtcConfig.value = JSON.stringify(engine.getProxy().getWRTCConfig(), null, 2);
    elTrackerConn.value = JSON.stringify(engine.getProxy().settings.trackerAnnounce, null, 2);
    elPeers.value = JSON.stringify(engine.getProxy().getPeerConnections().map((peer) => peer.getInfo()), null, 2);
}

function startStreaming() {
    engine.start();
}

function play() {
    engine.getPlayhead().play();
}

function pause() {
    engine.getPlayhead().pause();
}

initEngine();

updateControls();

initSourceUrl();









