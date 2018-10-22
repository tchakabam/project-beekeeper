import * as React from "react";
import * as ReactDOM from "react-dom";

import { BK_IProxy, BKAccessProxyEvents } from "../core";
import { printObject } from "./print-object";

import { Peer } from "../core/peer";

export type BKProxyBaseControllerProps = {
    proxy: BK_IProxy,
    controller: {
        start: () => void,
        play: () => void,
        pause: () => void,
        eventEmitter: { on: (event: string, handler: () => void) => void },
        getMediaClockTime: () => number
    }
};

export class BKProxyBaseController extends React.Component<BKProxyBaseControllerProps> {

    static renderDOM(elRootId, proxy, controller) {
        ReactDOM.render(
            <BKProxyBaseController proxy={proxy} controller={controller} ></BKProxyBaseController>,
            document.getElementById(elRootId)
        );
    }

    constructor(props: BKProxyBaseControllerProps) {
        super(props);

        props.controller.eventEmitter.on('update', () => this.forceUpdate());
    }

    onUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.controller.start();
    }

    onPeerBwChange(e: React.ChangeEvent<HTMLInputElement>): void {
        throw new Error("Method not implemented.");
    }

    render(): React.ReactNode {

        return(
            <div className="controls">
                <p>
                    <label>Media-URL:&nbsp;</label>
                    <input onChange={(e) => this.onUrlChange(e)}/>
                </p>

                <p>
                    <label>Peer-ID:&nbsp;</label>
                    <input readOnly value={this.props.proxy.getPeerId()}/>
                </p>

                <p>
                    <label>Swarm-ID:&nbsp;</label>
                    <input readOnly value={this.props.proxy.getSwarmId()}/>
                </p>

                <p>
                    <label>RTC-configuration:&nbsp;</label>
                    <textarea readOnly value={printObject(this.props.proxy.getWRTCConfig())}></textarea>
                </p>

                <p>
                    <label>Tracker-connection:&nbsp;</label>
                    <input readOnly value={this.props.proxy.settings.trackerAnnounce}/>
                </p>

                <p>
                    <label>Peer connections:&nbsp;</label>
                    <textarea readOnly value={printObject(this.props.proxy.getPeerConnections().map((peer) => peer.getInfo()))}></textarea>
                </p>

                <p>
                    <button onClick={this.props.controller.start}>Enter URL &#10026;</button>
                    <button onClick={this.props.controller.play}>Play ►</button>
                    <button onClick={this.props.controller.pause}>Pause &#10074;&#10074;</button>
                    <img />
                </p>

                <div>
                    <label>Media-clock time (seconds):&nbsp;</label>
                    <input readOnly value={this.props.controller.getMediaClockTime().toFixed(3)} />
                </div>

                <p>
                    <label>Max. Peer-Bandwidth (kbps):&nbsp;</label>
                    <input onChange={(e) => this.onPeerBwChange(e)} className="slider" type="range" min="256" max="16000" value="8000" />
                </p>

                <p className="p2p-graph-root"></p>

            </div>
        )
    }
};
