var engine = new P2pMediaLoaderUniversalEngine.Engine()

window.p2pEngine = engine;

function initSource() {
    engine.setSource("https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8");
}

function loadSource() {
    engine.loadSource();
}

initSource();

