# Project Beekeeper

**Beekeepr** is an open-source JavaScript library that uses features of modern browsers (i.e. WebRTC) to deliver media over P2P. It doesn’t require any browser plugins or addons to function.

It allows to create Peer-to-Peer network (also called P2P CDN or P2PTV) for traffic sharing between users (peers) that are watching the same media stream live or VOD over HLS or DASH protocols.

It significantly reduces traditional CDN traffic and cost while delivering media streams to more users.

## Key features

- Supports live and VOD streams over HLS or DASH protocols.
- Supports multiple players and engines  
  Engines: Hls.js, ShakaPlayer  
  Players: JWPlayer, Clappr, Flowplayer, MediaElement, VideoJS
- Supports adaptive bitrate streaming of HLS and DASH protocols.
- No need in server side software. By default P2P Media Loader uses publicly available servers:
  - STUN servers - [Public STUN server list](https://gist.github.com/mondain/b0ec1cf5f60ae726202e)
  - WebTorrent trackers - [https://openwebtorrent.com/](https://openwebtorrent.com/)

## Key components of the peer-to-peer network

The whole stack of the P2P network is FOSS.

![P2P network](https://raw.githubusercontent.com/Novage/p2p-media-loader/gh-pages/images/p2p-media-loader-network.png)

Browser requirements are:<br>
- **WebRTC Data Channels** support to exchange data between peers
- **Media Source Extensions** are required by Hls.js and ShakaPlayer engines for media playback

[**STUN**](https://en.wikipedia.org/wiki/STUN) server is used by [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) to gather [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) candidates.
There are many running public servers available on [Public STUN server list](https://gist.github.com/mondain/b0ec1cf5f60ae726202e)

[**WebTorrent**](https://webtorrent.io/) tracker is used for WebRTC signaling and to create swarms of peers that download the same media stream.
Few running public trackers are available: [https://openwebtorrent.com/](https://openwebtorrent.com/).
It is possible to run personal WebTorrent tracker using open-source implementations: [bittorrent-tracker](https://github.com/webtorrent/bittorrent-tracker), [uWebTorrentTracker](https://github.com/DiegoRBaquero/uWebTorrentTracker)

Default is configured to use public **STUN** and **WebTorrent** servers by default. That means that it is not required to run any server-side software for the P2P network to function.
