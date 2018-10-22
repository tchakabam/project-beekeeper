var TEST_STREAMS = [
    'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8',
    'https://wowzaprodhd25-lh.akamaihd.net/i/9e329736_1@364238/master.m3u8',
    'https://wowza.peer5.com/live/smil:bbb_abr.smil/chunklist_w80478204_b2204000.m3u8',
    'https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8'
];

var url = TEST_STREAMS[2];

function checkSessionAlreadyCreated() {
    if (window.hlsjsSession || window.p2pMediaEngine) {
        alert('There already is a session in this window.');
        throw new Error('Can not create another session in this window');
    }
}

/**
 * Creates an Hls.js session using the Beekeepr loader-plugin
 */
function initHlsjsLoaderTestbench() {
    checkSessionAlreadyCreated();

    var session = window.hlsjsSession = new BeekeeprHlsjsLoader.BKHlsjsSession(url);

    var hls = new Hls({
        fLoader: session.getLoaderClass(),
        debug: true,
        liveSyncDurationCount: 10
    });
    hls.attachMedia(document.getElementById('vid'));
    hls.loadSource(url);

    createMonitoringDOM(session.getProxy());
}

/**
 * Creates a standalone "headless" agent session
 */
function initStandaloneUEAgentTestbench() {
    checkSessionAlreadyCreated();

    var engine = window.p2pMediaEngine = engine = new BeekeeprUniversalEngine.Engine();

    engine.setSource(url);

    createMonitoringDOM(engine.getProxy());
}

function createMonitoringDOM(proxy) {
    BeekeeprMonitoring.BKProxyBaseMonitor
        .renderDOM("proxy-monitor-react-root", proxy);

    BeekeeprMonitoring.BKProxyBaseMonitor
        .createP2pGraph(document.querySelector('#proxy-monitor-p2p-graph-root'), proxy);

    BeekeeprMonitoring.BKProxyBaseController
        .renderDOM("proxy-controller-react-root", engine.getProxy(), {
            play: () => engine.getPlayhead().play(),
            pause: () => engine.getPlayhead().pause(),
            start: () => engine.start(),
            getMediaClockTime: () => engine.getPlayhead().getCurrentTime(),
            eventEmitter: engine.getPlayhead(),
        });


}
