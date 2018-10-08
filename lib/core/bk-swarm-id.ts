import { createHash } from 'crypto';
import * as Debug from 'debug';

const SWARM_URN_PREFIX = 'urn:livepeer:beekeeper:bittorrent:swarm-id';

const debug = Debug('bk:swarm-id');

const swarmIdCache: {[url: string]: string} = {};

export function getSwarmIdForVariantPlaylist(manifestUrl: string): string {
    if (swarmIdCache[manifestUrl]) {
        //debug(`swarm-ID cache hit: ${swarmIdCache[manifestUrl]}`);
        return swarmIdCache[manifestUrl];
    }

    debug(`creating swarm ID for manifest URL: ${manifestUrl}`);
    const swarmId = SWARM_URN_PREFIX + ':' + createHash('sha1').update(manifestUrl).digest('hex');
    debug(`created swarm ID: ${swarmId}`);
    swarmIdCache[manifestUrl] = swarmId;
    return swarmId;
}
