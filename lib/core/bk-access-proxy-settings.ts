import { PeerTransportFilterFactory, DefaultPeerTransportFilter } from "./peer-transport";

const rtcDefaultConfig: RTCConfiguration = require('simple-peer').config;

const trackerDefaultAnounce = [
    'wss://tracker.btorrent.xyz/',
    'wss://tracker.openwebtorrent.com/'
];

export type BKAccessProxySettings = {
    /**
     * Max WebRTC message size. 64KiB - 1B should work with most of recent browsers. Set it to 16KiB for older browsers support.
     */
    webRtcMaxMessageSize: number;

    /**
     * Timeout to download a resource from a peer. If exceeded the peer is dropped.
     */
    p2pResourceTransmissionTimeout: number;

    /**
     * Torrent trackers (announcers) to use.
     */
    trackerAnnounce: string[];

    /**
     * An RTCConfiguration dictionary providing options to configure WebRTC connections.
     */
    rtcConfig: RTCConfiguration;

    /**
     * Inject a factory function to create own transport interface implementation
     * based on initial transport object create by ITrackerClient.
     *
     * Default: just returns the initial transport.
     */
    mediaPeerTransportFilterFactory: PeerTransportFilterFactory
};

export type BKOptAccessProxySettings = Partial<BKAccessProxySettings>;

export const defaultSettings: BKAccessProxySettings = {

    webRtcMaxMessageSize: 64 * 1024 - 1, // 64Kbytes (why the -1 ?)

    p2pResourceTransmissionTimeout: 60000,

    trackerAnnounce: trackerDefaultAnounce,

    rtcConfig: rtcDefaultConfig,

    //mediaPeerTransportFilterFactory: (transport) => transport
    mediaPeerTransportFilterFactory: (transport) => new DefaultPeerTransportFilter(transport)
};
