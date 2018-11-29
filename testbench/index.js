var TEST_STREAMS = [
    'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8',
    'https://wowzaprodhd25-lh.akamaihd.net/i/9e329736_1@364238/master.m3u8',
    'https://wowza.peer5.com/live/smil:bbb_abr.smil/chunklist_w80478204_b2204000.m3u8',
    'https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8',
    //'https://mlgmsod-pipeline.akamaized.net/media/delivery/2b/b8/2bb8e4ec-f48f-4614-a3a2-1c7b5021aa05/vaJBIUQUAyx_53e71bb8-cc0e-4594-a482-1b90ae396591_2400k.m3u8'
    // 'http://95.142.173.162:8080/playlist.m3u8'
];

var url = TEST_STREAMS[2];

var queryParams = BeekeeprCore.parseOptionsFromQueryString();
if (queryParams.m3u8) {
    url = queryParams.m3u8;
}

function checkSessionAlreadyCreated() {
    if (window.hlsjsSession || window.p2pMediaEngine) {
        window.alert('There already is a session in this window.');
        throw new Error('Can not create another session in this window');
    }
}

/**
 * Creates an Hls.js session using the Beekeepr loader-plugin
 */
function initHlsjsLoaderTestbench() {
    checkSessionAlreadyCreated();

    document.getElementById('vid').style.display = 'inline-block';

    var session = window.hlsjsSession = new BeekeeprHlsjsLoader.BKHlsjsSession(url);

    var hls = new BeekeeprHlsjsLoader.Hls({
        fLoader: session.getLoaderClass(),
        debug: false,
        liveSyncDurationCount: 10
    });
    hls.attachMedia(document.getElementById('vid'));
    hls.loadSource(url);

    const metricsConsumer = new BeekeeprMonitoring.BKProxyMetricsConsumer(
        session.getProxy(),
        url,
        '//metrics-rinkeby.livepeer.org/api/p2pevents');

    metricsConsumer.start();

    createMonitoringDOM(session.getProxy());
}

/**
 * Creates a standalone "headless" agent session
 */
function initStandaloneUEAgentTestbench() {
    checkSessionAlreadyCreated();

    var engine = window.p2pMediaEngine = engine = new BeekeeprHeadlessAgent.Engine();

    engine.setSource(url);

    createMonitoringDOM(engine.getProxy(), engine);
}

function createMonitoringDOM(proxy, engine) {
    BeekeeprMonitoring.BKProxyBaseMonitor
        .renderDOM("proxy-monitor-react-root", proxy);

    BeekeeprMonitoring.createP2pGraph(document.querySelector('#proxy-monitor-p2p-graph-root'), proxy);

    // engine? // TODO: abstract that
    if (engine) {
        BeekeeprMonitoring.BKProxyBaseController
        .renderDOM("proxy-controller-react-root", proxy, {
            play: () => engine.getPlayhead().play(),
            pause: () => engine.getPlayhead().pause(),
            start: () => engine.start(),
            getMediaClockTime: () => engine.getPlayhead().getCurrentTime(),
            eventEmitter: engine.getPlayhead(),
        });
    }

}
