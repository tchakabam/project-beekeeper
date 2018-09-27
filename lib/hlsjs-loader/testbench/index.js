
var url = 'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8';

var session = new BeekeeprHlsjsLoader.BKHlsjsSession(url);

var hls = new Hls({
    fLoader: session.getLoaderClass(),
    debug: true
});

hls.attachMedia(document.getElementById('vid'));
hls.loadSource(url);
