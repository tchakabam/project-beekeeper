
var url;

//url = 'https://video-dev.github.io/streams/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8';

//url = 'https://wowzaprodhd25-lh.akamaihd.net/i/9e329736_1@364238/master.m3u8';

url = 'https://zdf-msl4test.akamaized.net/hls/live/670887/zdf_ngp/df25d6b00fd1015db40b90a182f9f4fd/5.m3u8';

var session = new BeekeeprHlsjsLoader.BKHlsjsSession(url);

var hls = new Hls({
    fLoader: session.getLoaderClass(),
    debug: true,
    liveSyncDurationCount: 20
});

hls.attachMedia(document.getElementById('vid'));
hls.loadSource(url);
