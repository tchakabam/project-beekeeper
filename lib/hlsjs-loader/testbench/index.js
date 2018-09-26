var session = new BeekeeprHlsjsLoader.BKHlsjsSession();

var hls = new Hls({
    fLoader: session.getLoaderClass(),
    debug: true
});

hls.attachMedia(document.getElementById('vid'));
hls.loadSource('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8');
