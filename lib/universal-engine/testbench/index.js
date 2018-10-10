var engine;

var url;

//url = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

//url = 'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8';

//url = 'https://wowzaprodhd25-lh.akamaihd.net/i/9e329736_1@364238/master.m3u8';

url = 'https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8';

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

function initUI() {
    document.getElementById('max-bandwidth-kbps').addEventListener('change', onMaxPeerBandwidthChange);
}

function onMaxPeerBandwidthChange(event) {
    var value = event.target.value;

    //console.log(value)

    engine.setNetemPeerMaxKbps(value);
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

initUI();

initEngine();

updateControls();

initSourceUrl();










