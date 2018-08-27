/**
 * Copyright 2018 Novage LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es2015.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.dom.d.ts" />

/// <reference path="../../decl/bittorrent.d.ts" />

import {HttpMediaDownloader} from "../lib/http-media-downloader";
import {MediaSegment, MediaAccessProxy} from "../lib/media-access-proxy"
import {anyFunction, anyOfClass, instance, mock, verify, when} from "ts-mockito";
import * as assert from "assert";
import {P2pMediaDownloader} from "../lib/p2p-media-downloader";
import {MediaPeerSegmentStatus} from "../lib/media-peer";

describe("MediaAccessProxy", () => {
    // HttpMediaManager mock
    const httpMediaManger = mock(HttpMediaDownloader);
    const httpDownloads: Map<string, MediaSegment> = new Map();

    when(httpMediaManger.download(anyOfClass(MediaSegment))).thenCall((segment) => {
        httpDownloads.set(segment.id, segment);
    });
    when(httpMediaManger.abort(anyOfClass(MediaSegment))).thenCall((segment) => {
        httpDownloads.delete(segment.id);
    });
    when(httpMediaManger.getActiveDownloads()).thenCall(() => {
        return httpDownloads;
    });
    when(httpMediaManger.isDownloading(anyOfClass(MediaSegment))).thenCall((segment) => {
        return httpDownloads.has(segment.id);
    });
    let httpSegmentLoadedListener: Function = () => {};
    when(httpMediaManger.on("segment-loaded", anyFunction())).thenCall((event, listener) => {
        httpSegmentLoadedListener = listener;
    });

    // P2PMediaManager mock
    const p2pMediaManager = mock(P2pMediaDownloader);
    const p2pAvailableFiles: MediaSegment[] = [];
    const p2pDownloads: MediaSegment[] = [];

    when(p2pMediaManager.download(anyOfClass(MediaSegment))).thenCall((segment) => {
        if (p2pDownloads.indexOf(segment) === -1 && p2pAvailableFiles.filter((p) => p.id == segment.id).length === 1) {
            p2pDownloads.push(segment);
        }
    });
    when(p2pMediaManager.abort(anyOfClass(MediaSegment))).thenCall((segment) => {
        const index = p2pDownloads.indexOf(segment);
        if (index !== -1) {
            p2pDownloads.splice(index, 1);
        }
    });
    when(p2pMediaManager.getActiveDownloadsCount()).thenCall(() => {
        return p2pDownloads.length;
    });
    when(p2pMediaManager.isDownloading(anyOfClass(MediaSegment))).thenCall((segment) => {
        return p2pDownloads.indexOf(segment) !== -1;
    });
    when(p2pMediaManager.getOvrallSegmentsMap()).thenCall(() => {
        return new Map<string, MediaPeerSegmentStatus>();
    });

    MediaAccessProxy.prototype["createHttpManager"] = () => instance(httpMediaManger);
    MediaAccessProxy.prototype["createP2PManager"] = () => instance(p2pMediaManager);
    MediaAccessProxy.prototype["now"] = () => Date.now();

    it("load", () => {

        const settings = {
            segmentIdGenerator: (url: string): string => url,
            cachedSegmentExpiration: 5 * 60 * 1000,
            cachedSegmentsCount: 20,
            requiredSegmentsPriority: 1,
            useP2P: false,
            simultaneousP2PDownloads: 3,
            lastSegmentProbability: 0.05,
            lastSegmentProbabilityInterval: 1000,
            bufferedSegmentsCount: 20,
            trackerAnnounce: [ "wss://tracker.btorrent.xyz/", "wss://tracker.openwebtorrent.com/" ]
        };
        const hybridLoader = new MediaAccessProxy(settings);
        verify(httpMediaManger.on("segment-loaded", anyFunction())).once();

        const segments: MediaSegment[] = [
            new MediaSegment("uu1", "u1", undefined, 0),
            new MediaSegment("uu2", "u2", undefined, 1),
            new MediaSegment("uu3", "u3", undefined, 2),
            new MediaSegment("uu5", "u4", undefined, 3),
            new MediaSegment("uu4", "u5", undefined, 4)
        ];
        const swarmId = "swarmId";

        // load
        hybridLoader.load(segments, swarmId);
        assert.equal(httpDownloads.size, 1);
        let segment = httpDownloads.values().next().value;
        verify(httpMediaManger.download(segment)).once();
        assert.deepEqual(segment, {id: segments[0].id, url: segments[0].url, range: undefined, priority: segments[0].priority, data: undefined, downloadSpeed: 0});

        // file loaded via http
        httpDownloads.clear();
        httpSegmentLoadedListener(segments[0], new ArrayBuffer(1));
        assert.equal(httpDownloads.size, 1);
        segment = httpDownloads.values().next().value;
        verify(httpMediaManger.download(segment)).once();
        assert.deepEqual(segment, {id: segments[1].id, url: segments[1].url, range: undefined, priority: segments[1].priority, data: undefined, downloadSpeed: 0});

        // load same files
        hybridLoader.load(segments, swarmId);
        assert.equal(httpDownloads.size, 1);
        segment = httpDownloads.values().next().value;
        verify(httpMediaManger.download(segment)).once();
        assert.deepEqual(segment, {id: segments[1].id, url: segments[1].url, range: undefined, priority: segments[1].priority, data: undefined, downloadSpeed: 0});
    });

});
