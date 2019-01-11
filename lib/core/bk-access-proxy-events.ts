export enum BKAccessProxyEvents {
    ResourceRequested = 'resource:requested',

    ResourceEnqueuedHttp = 'resource:enqueued:http',

    ResourceEnqueuedP2p = 'resource:enqueued:p2p',

    /**
     * Emitted when resource has been downloaded.
     * Args: resource
     */
    ResourceFetched = 'resource:fetched',

    /**
     * Emitted when an error occurred while loading the resource.
     * Args: resource, error
     */
    ResourceError = 'resource:error',

    /**
     * Emitted for each resource that does not hit into a new resources queue when the load() method is called.
     * Args: resource
     */
    ResourceAbort = 'resource:abort',

    /**
     * Emitted when a peer is connected.
     * Args: peer
     */
    PeerConnect = 'peer:connect',

    /**
     * Emitted when a peer is disconnected.
     * Args: peerId
     */
    PeerClose = 'peer:close',

    PeerRequestReceived = 'peer:request',

    PeerResponseSent = 'peer:response-sent',
}
