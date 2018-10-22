//import React = require("react");

const Graph = require('p2p-graph');

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
