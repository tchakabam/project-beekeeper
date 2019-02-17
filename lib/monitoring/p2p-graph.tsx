/// <reference path="../../decl/p2p-graph.d.ts" />

import P2pGraph = require("p2p-graph");

import { BK_IProxy } from "../core/bk-access-proxy";
import { BKAccessProxyEvents } from "../core/bk-access-proxy-events";

export function createP2pGraph(elRoot: HTMLElement, proxy: BK_IProxy): {graph: P2pGraph, updateInterval: number} {
    const g: P2pGraph = new P2pGraph(elRoot);

    const id = proxy.getPeerId();

    g.add({
        me: true,
        id,
        name: proxy.getPeerId().substr(0, 8) + '@local'
    });

    proxy.on(BKAccessProxyEvents.PeerConnect, () => {
        update();
    })

    proxy.on(BKAccessProxyEvents.PeerClose, () => {
        update();
    });

    function update() {
        const peers = proxy.getPeerConnections();

        peers.forEach((peer) => {
            if (!g.hasPeer(peer.id)) {
                g.add({
                    me: false,
                    id: peer.id,
                    name: peer.getShortName()
                });
                g.connect(peer.id, id);
            }
        });

        g.list().slice().forEach((gPeer) => { // we make a copy just to be sure we're not messing up internals
            if (!gPeer.me && !peers.find((peer) => peer.id === gPeer.id)) {
                //
                //g.disconnect(gPeer.id); // FIXME: CRASHES
                g.remove(gPeer.id);
                //
            }
        })
    }

    const updateInterval = window.setInterval(update, 1000);

    return {graph: g, updateInterval};
}

/*

/// <reference path="../../decl/p2p-graph.d.ts" />

export type P2pGraphPeer = {
    id: string // must be unique for this graph
    me: true, // reference
    name: string // display name
}

export type P2pGraphEvent = 'select';

export class P2pGraph {

    private _graph: typeof Graph;

    constructor() {

    }

    add(peer: P2pGraphPeer) {

    }

    connect(id1: string, id2: string) {

    }

    disconnect(id: string) {

    }

    areConnected(id1: string, id2: string) {

    }

    getLink(i1: string, id2: string) {

    }

    hasPeer(...ids: string[]): boolean {

    }

    hasLink(id1: string, id2: string) {

    }

    remove(id: string) {

    }

    seed(id: string, isSeeding: boolean) {

    }

    rate(id1: string, id2: string, avgRate: number) {

    }

    list(): P2pGraphPeer[] {

    }

    destroy() {

    }

    on(event: P2pGraphEvent, callback: (id: string) => void) {

    }
}

/*
export class ReactP2pGraph extends React.Component<{
    graphRootElId: string
}> {
    private _graph: P2pGraph;

    getGraph(): P2pGraph {
        return this._graph;
    }

    repaint() {
        this._graph = new P2pGraph(this.props.graphRootElId);
    }

    render(): React.ReactNode {
        const jsx = (
            <div id={this.props.graphRootElId}></div>
        );
        setTimeout(() => this.repaint(), 0);
        return jsx;
    }
}
*/
