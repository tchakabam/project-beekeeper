import { BKMetricsConsumer, BKMetricsRecorder, BKMetricsEventType, BKMetricsPeerData, BKMetricsCDNData } from "./bk-metrics";
import { BK_IProxy, BKAccessProxyEvents, BKResource } from "../core";
import { BKResourceTransportMode } from "../core/bk-resource";
import { BKPeer } from "../core/peer";

export class BKProxyMetricsConsumer extends BKMetricsConsumer {

    constructor(proxy: BK_IProxy, contentUrl: string, metricsEndpointUrl: string) {

        super(metricsEndpointUrl, new BKMetricsRecorder(proxy.getPeerId(), contentUrl));

        proxy.on(BKAccessProxyEvents.ResourceFetched, (res: BKResource) => {

            let eventType: BKMetricsEventType;
            let data;

            switch(res.transportMode) {
            case BKResourceTransportMode.UNKNOWN:
                throw new Error('Resource should not have unknown transport mode');
            case BKResourceTransportMode.P2P:
                let p2pData: BKMetricsPeerData = {
                    remotePeerId: null,
                    resourceId: res.uri,
                    uploadRateKbps: 0,
                    downloadRateKbps: res.getRecordedTransmissionRateBps() / 1000,
                    numBytes: res.requestedBytesLoaded
                }
                eventType = BKMetricsEventType.PEER_DOWNLOAD_DONE;
                data = p2pData;
                break;
            case BKResourceTransportMode.HTTP:
                let cdnData: BKMetricsCDNData = {
                    remoteHost: res.getUrl(),
                    resourceId: res.uri,
                    uploadRateKbps: 0,
                    downloadRateKbps: res.getRecordedTransmissionRateBps() / 1000,
                    numBytes: res.requestedBytesLoaded,
                }
                eventType = BKMetricsEventType.CDN_DOWNLOAD_DONE;
                data = cdnData;
                break;
            }

            this.recorder.capture(eventType, data);
        });

        proxy.on(BKAccessProxyEvents.ResourceError, (res: BKResource) => {



        })

        proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: BKPeer) => {

        });
    }
}
