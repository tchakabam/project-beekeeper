(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BeekeeprUniversalEngineNode"] = factory();
	else
		root["BeekeeprUniversalEngineNode"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/universal-engine/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ext-mod/emliri-es-libs/objec-ts/lib/es6-set.ts":
/*!********************************************************!*\
  !*** ./ext-mod/emliri-es-libs/objec-ts/lib/es6-set.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Set = __webpack_require__(/*! es6-set/polyfill */ "es6-set/polyfill");
exports.Set = Set;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client.ts":
/*!********************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var time_intervals_1 = __webpack_require__(/*! ./time-intervals */ "./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts");
//import { Scheduler } from "../../objec-ts/lib/scheduler";
var logger_1 = __webpack_require__(/*! ./logger */ "./ext-mod/emliri-es-libs/rialto/lib/logger.ts");
var _a = logger_1.getLogger("adaptive-media-client"), log = _a.log, error = _a.error;
var AdaptiveMediaClient = /** @class */ (function () {
    function AdaptiveMediaClient(mediaElement) {
        this.mediaEl = mediaElement;
    }
    Object.defineProperty(AdaptiveMediaClient.prototype, "mediaElement", {
        get: function () {
            return this.mediaEl;
        },
        enumerable: true,
        configurable: true
    });
    AdaptiveMediaClient.prototype.setMediaSource = function (source) {
        this.mediaEl.src = URL.createObjectURL(source);
    };
    return AdaptiveMediaClient;
}());
exports.AdaptiveMediaClient = AdaptiveMediaClient;
var AdaptiveMediaStreamConsumer = /** @class */ (function () {
    function AdaptiveMediaStreamConsumer(_adaptiveMedia, _onSegmentBufferedCb) {
        this._adaptiveMedia = _adaptiveMedia;
        this._onSegmentBufferedCb = _onSegmentBufferedCb;
        this._fetchTargetRanges = new time_intervals_1.TimeIntervalContainer();
        this._bufferedRanges = new time_intervals_1.TimeIntervalContainer();
    }
    AdaptiveMediaStreamConsumer.prototype.getMedia = function () {
        return this._adaptiveMedia;
    };
    AdaptiveMediaStreamConsumer.prototype.getBufferedRanges = function () {
        return this._bufferedRanges;
    };
    AdaptiveMediaStreamConsumer.prototype.getFetchTargetRanges = function () {
        return this._fetchTargetRanges;
    };
    AdaptiveMediaStreamConsumer.prototype.setFetchTarget = function (time) {
        this.setFetchTargetRange(new time_intervals_1.TimeInterval(0, time));
    };
    /**
     *
     * @param floor when passed negative number, floor is calculated from end of media (useful for live/DVR window)
     * @param ceiling
     */
    AdaptiveMediaStreamConsumer.prototype.setFetchFloorCeiling = function (floor, ceiling) {
        if (floor === void 0) { floor = 0; }
        if (ceiling === void 0) { ceiling = Infinity; }
        if (floor === 0) {
            floor = this._adaptiveMedia.getEarliestTimestamp();
        }
        else if (floor < 0) {
            floor = Math.max(this._adaptiveMedia.getWindowDuration() - Math.abs(floor), 0);
        }
        if (ceiling === Infinity) {
            ceiling = this._adaptiveMedia.getWindowDuration(); // when to use cummulated duration?
        }
        this.setFetchTargetRange(new time_intervals_1.TimeInterval(floor, ceiling));
    };
    /**
     *
     * @param range pass `null` to just reset to clear range container
     */
    AdaptiveMediaStreamConsumer.prototype.setFetchTargetRange = function (range) {
        this._fetchTargetRanges.clear();
        if (range) {
            this.addFetchTargetRange(range);
        }
    };
    AdaptiveMediaStreamConsumer.prototype.addFetchTargetRange = function (range) {
        this._fetchTargetRanges.add(range);
        this._fetchTargetRanges = this._fetchTargetRanges.flatten();
        this._onFetchTargetRangeChanged();
    };
    AdaptiveMediaStreamConsumer.prototype._onFetchTargetRangeChanged = function () {
        var mediaSeekableRange = this._adaptiveMedia.getSeekableTimeRanges();
        var fetchTargetRanges = this.getFetchTargetRanges();
        log('fetch-target ranges window duration:', fetchTargetRanges.getWindowDuration());
        if (!mediaSeekableRange.hasOverlappingRangesWith(fetchTargetRanges)) {
            error('fetch target range does not overlap with media seekable range');
            return;
        }
        this._fetchAllSegmentsInTargetRange();
    };
    AdaptiveMediaStreamConsumer.prototype._fetchAllSegmentsInTargetRange = function () {
        var _this = this;
        log('trying to retrieve data for fetch-range');
        var fetchTargetRanges = this.getFetchTargetRanges();
        fetchTargetRanges.ranges.forEach(function (range) {
            var mediaSegments = _this._adaptiveMedia.findSegmentsForTimeRange(range, true);
            mediaSegments.forEach(function (segment) {
                if (segment.isFetching || segment.hasData) {
                    return;
                }
                if (!segment.hasCustomRequestMaker()) {
                    throw new Error('Assertion failed: media segment should have custom request-maker');
                }
                log('going to request segment resource:', segment.getOrdinalIndex(), segment.getUrl());
                segment.fetch().then(function () {
                    var segmentInterval = segment.getTimeInterval();
                    log('adding time-interval to buffered range:', segmentInterval);
                    _this._bufferedRanges.add(segmentInterval).flatten(true);
                    if (_this._onSegmentBufferedCb) {
                        _this._onSegmentBufferedCb(segment);
                    }
                });
            });
        });
    };
    return AdaptiveMediaStreamConsumer;
}());
exports.AdaptiveMediaStreamConsumer = AdaptiveMediaStreamConsumer;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/adaptive-media.ts":
/*!*************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/adaptive-media.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cloneable_1 = __webpack_require__(/*! ./cloneable */ "./ext-mod/emliri-es-libs/rialto/lib/cloneable.ts");
var es6_set_1 = __webpack_require__(/*! ../../objec-ts/lib/es6-set */ "./ext-mod/emliri-es-libs/objec-ts/lib/es6-set.ts");
var media_container_info_1 = __webpack_require__(/*! ./media-container-info */ "./ext-mod/emliri-es-libs/rialto/lib/media-container-info.ts");
var time_intervals_1 = __webpack_require__(/*! ./time-intervals */ "./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts");
var logger_1 = __webpack_require__(/*! ./logger */ "./ext-mod/emliri-es-libs/rialto/lib/logger.ts");
var _a = logger_1.getLogger("adaptive-media-client"), log = _a.log, error = _a.error, warn = _a.warn;
/**
 * Essentially, a sequence of media segments that can be consumed as a stream.
 *
 * Represents what people refer to as rendition, quality level or representation, or media "variant" playlist.
 *
 * Contains an array of segments and the metadata in common about these.
 */
var AdaptiveMedia = /** @class */ (function (_super) {
    __extends(AdaptiveMedia, _super);
    function AdaptiveMedia(mediaEngine) {
        if (mediaEngine === void 0) { mediaEngine = null; }
        var _this = _super.call(this) || this;
        _this.mediaEngine = mediaEngine;
        _this._segments = [];
        _this._timeRanges = new time_intervals_1.TimeIntervalContainer();
        _this._lastRefreshAt = 0;
        _this._lastTimeRangesCreatedAt = 0;
        _this.isLive = false;
        _this.segmentIndexProvider = null;
        return _this;
    }
    Object.defineProperty(AdaptiveMedia.prototype, "segments", {
        /**
         * tamper-safe copy of internal data
         */
        get: function () {
            return this._segments.slice(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdaptiveMedia.prototype, "lastRefreshedAt", {
        get: function () {
            return this._lastRefreshAt;
        },
        enumerable: true,
        configurable: true
    });
    AdaptiveMedia.prototype.addSegment = function (mediaSegment, reorderAndDedupe) {
        if (reorderAndDedupe === void 0) { reorderAndDedupe = true; }
        if (reorderAndDedupe) {
            this._updateSegments([mediaSegment]);
        }
        else {
            this._segments.push(mediaSegment);
        }
    };
    AdaptiveMedia.prototype.getUrl = function () {
        return this.segmentIndexUri || null;
    };
    AdaptiveMedia.prototype.getEarliestTimestamp = function () {
        if (!this._segments.length) {
            return NaN;
        }
        return this._segments[0].startTime;
    };
    AdaptiveMedia.prototype.getMeanSegmentDuration = function () {
        return this._segments.reduce(function (accu, segment) {
            return accu + segment.duration;
        }, 0) / this._segments.length;
    };
    /**
     * @returns duration as sum of all segment durations. will be equal to window duration
     * if the media is gapless and has no time-plane discontinuities.
     */
    AdaptiveMedia.prototype.getCumulatedDuration = function () {
        return this.getSeekableTimeRanges().getCumulatedDuration();
    };
    /**
     * @returns duration as difference between last segment endTime and first segment startTime
     */
    AdaptiveMedia.prototype.getWindowDuration = function () {
        return this.getSeekableTimeRanges().getWindowDuration();
    };
    /**
     * Refresh/enrich media segments (e.g for external segment indices and for live)
     */
    AdaptiveMedia.prototype.refresh = function (autoReschedule, onSegmentsUpdate) {
        var _this = this;
        if (autoReschedule === void 0) { autoReschedule = false; }
        if (onSegmentsUpdate === void 0) { onSegmentsUpdate = null; }
        if (!this.segmentIndexProvider) {
            return Promise.reject("No segment index provider set");
        }
        this._lastRefreshAt = Date.now();
        var doAutoReschedule = function () {
            _this.scheduleUpdate(_this.getMeanSegmentDuration(), function () {
                if (onSegmentsUpdate) {
                    onSegmentsUpdate();
                }
                doAutoReschedule();
            });
        };
        log('going to refresh media index:', this.getUrl());
        return this.segmentIndexProvider()
            .then(function (newSegments) {
            // update segment-list models
            _this._updateSegments(newSegments);
            if (onSegmentsUpdate) {
                onSegmentsUpdate();
            }
            // we only call this once we have new segments so
            // we can actually calculate average segment duration.
            // when autoReschedule is true, this would be called once on the initial call to refresh
            // while scheduleUpdate doesn't set to true the autoReschedule flag
            // when it calls refresh.
            // rescheduling happens as we call reschedule() via the reentrant closure in the callback here.
            if (autoReschedule) {
                doAutoReschedule();
            }
            return _this;
        });
    };
    AdaptiveMedia.prototype.scheduleUpdate = function (timeSeconds, onRefresh) {
        var _this = this;
        if (onRefresh === void 0) { onRefresh = null; }
        if (!Number.isFinite(timeSeconds)) {
            warn('attempt to schedule media update with invalid time-value:', timeSeconds);
            return;
        }
        log('scheduling update of adaptive media index in:', timeSeconds);
        window.clearTimeout(this._updateTimer);
        this._updateTimer = window.setTimeout(function () {
            _this.refresh().then(function (result) {
                if (onRefresh) {
                    onRefresh();
                }
            });
        }, timeSeconds * 1000);
    };
    /**
     * Activates/enables this media with the attached engine
     */
    AdaptiveMedia.prototype.activate = function () {
        if (this.mediaEngine) {
            return this.mediaEngine.activateMediaStream(this);
        }
        return Promise.reject(false);
    };
    AdaptiveMedia.prototype.getSeekableTimeRanges = function () {
        if (this._lastRefreshAt > this._lastTimeRangesCreatedAt) {
            this._updateTimeRanges();
        }
        return this._timeRanges;
    };
    /**
     *
     * @param range
     * @param partial
     * @returns segments array which are fully contained inside `range` (or only overlap when `partial` is true)
     */
    AdaptiveMedia.prototype.findSegmentsForTimeRange = function (range, partial) {
        if (partial === void 0) { partial = false; }
        if (!partial) {
            return this._segments.filter(function (segment) { return range.contains(segment.getTimeInterval()); });
        }
        else {
            return this._segments.filter(function (segment) { return range.overlapsWith(segment.getTimeInterval()); });
        }
    };
    AdaptiveMedia.prototype._updateTimeRanges = function () {
        var _this = this;
        this._timeRanges = new time_intervals_1.TimeIntervalContainer();
        this._segments.forEach(function (segment) {
            _this._timeRanges.add(new time_intervals_1.TimeInterval(segment.startTime, segment.endTime));
        });
        this._lastTimeRangesCreatedAt = Date.now();
    };
    AdaptiveMedia.prototype._updateSegments = function (newSegments) {
        var _this = this;
        log('starting update of media segment - got new segments list of size:', newSegments.length);
        // pre-deduplicate new segments by ordinal-index
        // this is to make sure we are not throwing out any already existing
        // resources here which may have ongoing request state for example.
        newSegments = newSegments.filter(function (segment) {
            return _this._segments.findIndex(function (s) {
                if (!Number.isFinite(segment.getOrdinalIndex())) {
                    return false;
                }
                return s.getOrdinalIndex() === segment.getOrdinalIndex();
            }) < 0; // true when we didn't find any segment with that ordinal index yet
            // which means we should let it pass the filter function to be added
        });
        if (newSegments.length === 0) {
            log('no new segments found');
            return;
        }
        Array.prototype.push.apply(this._segments, newSegments);
        log('new deduplicated list size is:', this._segments.length);
        if (this._segments.length === 0) {
            return;
        }
        var startedAt = Date.now();
        var lastOrdinalIdx = -1;
        var lastSegmentEndTime = -1;
        log('first/last ordinal index is:', newSegments[0].getOrdinalIndex(), newSegments[newSegments.length - 1].getOrdinalIndex());
        var segments = [];
        // sort by ordinal index
        this._segments.sort(function (a, b) {
            var diff = a.getOrdinalIndex() - b.getOrdinalIndex();
            if (Number.isFinite(diff)) {
                return diff;
            }
            return 0;
        }).forEach(function (segment) {
            var index = segment.getOrdinalIndex();
            // remove redundant indices
            // if it's NaN we don't care about this (it means there are no indices)
            if (Number.isFinite(index)
                && index === lastOrdinalIdx) { // deduplicate
                return;
            }
            // TODO: handle discontinuity-markers in segments
            // apply offset to model continuous timeline
            if (segment.startTime < lastSegmentEndTime) {
                var offset = lastSegmentEndTime - segment.startTime;
                //debug('applying offset to segment to achieve timeplane continuity:', index, offset);
                segment.setTimeOffset(offset);
            }
            if (lastOrdinalIdx !== -1 // initial case
                && index !== lastOrdinalIdx + 1) {
                warn("ordinal indices should grow monitonically but diff is:", index - lastOrdinalIdx);
            }
            lastOrdinalIdx = index;
            lastSegmentEndTime = segment.endTime;
            segments.push(segment);
        });
        this._segments = segments;
        log('updated and reorder/deduped media segment list, new length is:', segments.length);
        log('first/last ordinal index is:', segments[0].getOrdinalIndex(), segments[segments.length - 1].getOrdinalIndex());
        log('new cummulated/window duration is:', this.getCumulatedDuration(), '/', this.getWindowDuration());
        log('updating segments done, processing took millis:', Date.now() - startedAt);
    };
    return AdaptiveMedia;
}(cloneable_1.CloneableScaffold));
exports.AdaptiveMedia = AdaptiveMedia;
/**
 * A set of segmented adaptive media stream representations with a given combination of content-types (see flags).
 *
 * This might be a valid playable combination of tracks (of which some might be optional).
 */
var AdaptiveMediaSet = /** @class */ (function (_super) {
    __extends(AdaptiveMediaSet, _super);
    function AdaptiveMediaSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mediaContainerInfo = new media_container_info_1.MediaContainerInfo();
        return _this;
    }
    /**
     * @returns The default media if advertised,
     * or falls back on first media representation of the first set
     */
    AdaptiveMediaSet.prototype.getDefaultMedia = function () {
        return Array.from(this.values())[0];
    };
    return AdaptiveMediaSet;
}(es6_set_1.Set));
exports.AdaptiveMediaSet = AdaptiveMediaSet;
/**
 * A queriable collection of adaptive media sets. For example, each set might be an adaptation state.
 */
var AdaptiveMediaPeriod = /** @class */ (function () {
    function AdaptiveMediaPeriod() {
        this.sets = [];
    }
    /**
     * @returns The default adaptive-media-set if advertised,
     * or falls back on first media representation of the first set
     */
    AdaptiveMediaPeriod.prototype.getDefaultSet = function () {
        if (this.sets[0].size === 0) {
            throw new Error('No default media set found');
        }
        return this.sets[0];
    };
    AdaptiveMediaPeriod.prototype.getMediaListFromSet = function (index) {
        return Array.from(this.sets[index]);
    };
    AdaptiveMediaPeriod.prototype.addSet = function (set) {
        if (set.parent) {
            throw new Error('Set already has a parent period');
        }
        set.parent = this;
        this.sets.push(set);
    };
    AdaptiveMediaPeriod.prototype.filterByContainedMediaTypes = function (mediaTypeFlags, identical) {
        if (identical === void 0) { identical = false; }
        return this.sets.filter(function (mediaSet) {
            return mediaSet.mediaContainerInfo.intersectsMediaTypeSet(mediaTypeFlags, identical);
        });
    };
    return AdaptiveMediaPeriod;
}());
exports.AdaptiveMediaPeriod = AdaptiveMediaPeriod;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/bytes-read-write.ts":
/*!***************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/bytes-read-write.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @module
 *
 * Functions to read & write coded types from/to bytes buffers in memory
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UINT_32 = 4294967296;
exports.MAX_UINT_16 = 65536;
exports.readUint16 = function (buffer, offset) {
    var val = buffer[offset] << 8 |
        buffer[offset + 1];
    return val < 0 ? exports.MAX_UINT_16 + val : val;
};
exports.readUint32 = function (buffer, offset) {
    var val = buffer[offset] << 24 |
        buffer[offset + 1] << 16 |
        buffer[offset + 2] << 8 |
        buffer[offset + 3];
    return val < 0 ? exports.MAX_UINT_32 + val : val;
};
exports.writeUint32 = function (buffer, offset, value) {
    buffer[offset] = value >> 24;
    buffer[offset + 1] = (value >> 16) & 0xff;
    buffer[offset + 2] = (value >> 8) & 0xff;
    buffer[offset + 3] = value & 0xff;
};
exports.utf8BytesToString = function (bytes) {
    return String.fromCharCode.apply(null, bytes);
};
exports.unicodeBytesToString = function (bytes) {
    return String.fromCharCode.apply(null, bytes);
};
function utf8StringToArray(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
exports.utf8StringToArray = utf8StringToArray;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/cloneable.ts":
/*!********************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/cloneable.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * Deep-clones an object.
 *
 * Uses JSON stringify-parse method
 * @see https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
 * "stringify" proven fastest method to do deep-cloning @see http://jsben.ch/bWfk9
 * @param o
 */
function deepCloneObject(o) {
    // Deep clone will fail if we have circular dependencies
    try {
        return JSON.parse(JSON.stringify(o));
    }
    catch (e) {
        throw new Error('Failed to deep-clone object. Inner error: ' + e.message);
    }
}
exports.deepCloneObject = deepCloneObject;
/**
 *
 * Copies all own enumarable properties of an object (map-dictionnary-like clone)
 *
 * Allows to specify wether the new object should be a plain map (prototype-less)
 *
 * Be aware that functions that are own properties will not change their bound context upon copying.
 *
 * @param o
 * @param asMap
 */
function shallowCloneObject(o, asMap) {
    return Object.assign(asMap ? Object.create(null) : {}, o);
}
exports.shallowCloneObject = shallowCloneObject;
/**
 * Copies all own enumarable properties of an object (map-dictionnary-like clone)
 * into a new instance with the given prototype and class properties.
 *
 * Be aware that functions that are own properties will not change their bound context upon copying.
 *
 * Methods of the passed prototype will obviously be bound to the instance as part of the object creation.
 *
 * @param o
 * @param proto
 */
function shallowCloneObjectWithPrototype(o, proto, properties) {
    return Object.assign(Object.create(proto, properties), o);
}
exports.shallowCloneObjectWithPrototype = shallowCloneObjectWithPrototype;
/**
 * Implements Cloneable interface with deep method
 */
var CloneableObject = /** @class */ (function () {
    function CloneableObject() {
    }
    CloneableObject.prototype.clone = function () {
        return deepCloneObject(this);
    };
    return CloneableObject;
}());
exports.CloneableObject = CloneableObject;
/**
 * Implements cloneable interface with shallow method.
 */
var CloneableScaffold = /** @class */ (function () {
    function CloneableScaffold() {
    }
    CloneableScaffold.prototype.clone = function () {
        return shallowCloneObject(this, true);
    };
    return CloneableScaffold;
}());
exports.CloneableScaffold = CloneableScaffold;
/**
 * Implements cloneable interface with shallow method.
 *
 * Constructs a prototype-less object (plain map)
 * and uses `asMap` flag for shallow-copy.
 */
var CloneableDictionnary = /** @class */ (function () {
    function CloneableDictionnary() {
        return Object.create(null);
    }
    CloneableDictionnary.prototype.clone = function () {
        return shallowCloneObject(this, true);
    };
    return CloneableDictionnary;
}());
exports.CloneableDictionnary = CloneableDictionnary;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/hls-m3u8.ts":
/*!*******************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/hls-m3u8.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var m3u8Parser = __webpack_require__(/*! m3u8-parser */ "m3u8-parser");
var resource_1 = __webpack_require__(/*! ./resource */ "./ext-mod/emliri-es-libs/rialto/lib/resource.ts");
var adaptive_media_1 = __webpack_require__(/*! ./adaptive-media */ "./ext-mod/emliri-es-libs/rialto/lib/adaptive-media.ts");
var logger_1 = __webpack_require__(/*! ./logger */ "./ext-mod/emliri-es-libs/rialto/lib/logger.ts");
var media_segment_1 = __webpack_require__(/*! ./media-segment */ "./ext-mod/emliri-es-libs/rialto/lib/media-segment.ts");
var media_locator_1 = __webpack_require__(/*! ./media-locator */ "./ext-mod/emliri-es-libs/rialto/lib/media-locator.ts");
var url_1 = __webpack_require__(/*! ./url */ "./ext-mod/emliri-es-libs/rialto/lib/url.ts");
var bytes_read_write_1 = __webpack_require__(/*! ./bytes-read-write */ "./ext-mod/emliri-es-libs/rialto/lib/bytes-read-write.ts");
var _a = logger_1.getLogger('hls-m3u8', logger_1.LoggerLevels.ON), log = _a.log, warn = _a.warn;
var HlsM3u8FileType;
(function (HlsM3u8FileType) {
    HlsM3u8FileType["MASTER"] = "master";
    HlsM3u8FileType["MEDIA"] = "media";
})(HlsM3u8FileType = exports.HlsM3u8FileType || (exports.HlsM3u8FileType = {}));
var HlsM3u8MediaPlaylistType;
(function (HlsM3u8MediaPlaylistType) {
    HlsM3u8MediaPlaylistType["LIVE"] = "live";
    HlsM3u8MediaPlaylistType["VOD"] = "vod";
})(HlsM3u8MediaPlaylistType = exports.HlsM3u8MediaPlaylistType || (exports.HlsM3u8MediaPlaylistType = {}));
var HlsM3u8File = /** @class */ (function (_super) {
    __extends(HlsM3u8File, _super);
    function HlsM3u8File(uri, fileType, baseUri) {
        if (fileType === void 0) { fileType = null; }
        var _this = _super.call(this, uri, null, baseUri) || this;
        _this._parsed = false;
        _this._fileType = null;
        _this._hlsMediaPlaylists = [];
        _this._periods = [new adaptive_media_1.AdaptiveMediaPeriod()];
        _this._adaptiveMediaSet = new adaptive_media_1.AdaptiveMediaSet();
        _this._fileType = fileType;
        _this._periods[0].sets.push(_this._adaptiveMediaSet);
        return _this;
    }
    HlsM3u8File.prototype.hasBeenParsed = function () {
        return this._parsed;
    };
    HlsM3u8File.prototype.parse = function () {
        var buf = this.buffer;
        if (!buf) {
            throw new Error('No data to parse');
        }
        if (this._parsed) {
            return Promise.resolve(this._periods);
        }
        var text = bytes_read_write_1.utf8BytesToString(new Uint8Array(buf));
        var parser = new m3u8Parser.Parser();
        parser.push(text);
        parser.end();
        //console.log(parser.manifest);
        var manifest = this._m3u8ParserResult = parser.manifest;
        if (manifest.playlists && manifest.playlists.length) {
            this._fileType = HlsM3u8FileType.MASTER;
            this._processMasterPlaylist();
        }
        else if (manifest.segments && manifest.segments.length) {
            this._fileType = HlsM3u8FileType.MEDIA;
            this._processMediaVariantPlaylist();
        }
        else {
            throw new Error('Could not determine type of HLS playlist');
        }
        this._parsed = true;
        return Promise.resolve(this._periods);
    };
    HlsM3u8File.prototype._processMasterPlaylist = function () {
        var _this = this;
        this._m3u8ParserResult.playlists.forEach(function (playlist) {
            var media = new adaptive_media_1.AdaptiveMedia();
            var a = playlist.attributes;
            media.bandwidth = a.BANDWIDTH; // || a.['AVERAGE-BANDWIDTH'];
            media.codecs = a.CODECS;
            media.videoInfo = {
                width: a.RESOLUTION.width,
                height: a.RESOLUTION.height
            };
            media.label = a.NAME;
            media.segmentIndexUri = url_1.resolveUri(playlist.uri, _this.getUrl());
            media.segmentIndexRange = null;
            var hlsMediaPlaylistFile = new HlsM3u8File(media.segmentIndexUri, HlsM3u8FileType.MEDIA, _this.getUrl());
            var hlsMediaPlaylist = new HlsM3u8MediaPlaylist(hlsMediaPlaylistFile);
            media.segmentIndexProvider = function () {
                return hlsMediaPlaylist.fetch()
                    .then(function () { return hlsMediaPlaylist.parse(); })
                    .then(function (adaptiveMedia) {
                    // pass back info from master-playlist to model created when parsing variant list
                    adaptiveMedia.bandwidth = media.bandwidth;
                    adaptiveMedia.codecs = media.codecs;
                    adaptiveMedia.videoInfo = media.videoInfo;
                    adaptiveMedia.label = media.label;
                    adaptiveMedia.segmentIndexUri = media.segmentIndexUri;
                    adaptiveMedia.segmentIndexRange = media.segmentIndexRange;
                    adaptiveMedia.segmentIndexProvider = media.segmentIndexProvider;
                    log('got master-playlist segment index provider result:', adaptiveMedia.getUrl());
                    // pass back info from variant list to master model
                    media.externalIndex = adaptiveMedia.externalIndex;
                    return adaptiveMedia.segments;
                });
            };
            _this._hlsMediaPlaylists.push(hlsMediaPlaylist);
            _this._adaptiveMediaSet.add(media);
        });
    };
    HlsM3u8File.prototype._processMediaVariantPlaylist = function () {
        var _this = this;
        log('parsing media playlist:', this.getUrl());
        var media = new adaptive_media_1.AdaptiveMedia();
        var hlsMediaPlaylist = new HlsM3u8MediaPlaylist(this);
        var mediaSequenceIndex = this._m3u8ParserResult.mediaSequence;
        var isLive = !this._m3u8ParserResult.playlistType
            || this._m3u8ParserResult.playlistType.toLowerCase() === 'live';
        // TODO handle discontinuities
        media.isLive = isLive;
        media.externalIndex = mediaSequenceIndex;
        media.segmentIndexProvider = function () {
            return hlsMediaPlaylist.fetch()
                .then(function () { return hlsMediaPlaylist.parse(); })
                .then(function (adaptiveMedia) { return adaptiveMedia.segments; });
        };
        var startTime = 0;
        var segmentIndex = 0;
        //console.log(this._m3u8ParserResult)
        this._m3u8ParserResult.segments.forEach(function (segment) {
            var endTime = startTime + segment.duration;
            var mediaSegment = new media_segment_1.MediaSegment(media_locator_1.MediaLocator.fromRelativeURI(segment.uri, _this.getUrl(), null, startTime, endTime));
            mediaSegment.setOrdinalIndex(mediaSequenceIndex + segmentIndex);
            mediaSegment.setTimeOffset(segment.timeline);
            // optimization: we dont' set the reorder/dedupe flag here since we know the media is "vanilla"
            media.addSegment(mediaSegment, false);
            startTime = endTime;
            segmentIndex++;
        });
        log('adding media to file:', this.getUrl());
        // if it's a variant playlist the file should only ever hold one model
        this._adaptiveMediaSet.clear();
        this._adaptiveMediaSet.add(media);
    };
    HlsM3u8File.prototype.fetch = function () {
        var _this = this;
        return _super.prototype.fetch.call(this).then(function (r) {
            log('data loaded');
            // reset parsed flag
            _this._parsed = false;
            return _this;
        }).then(function () {
            return _this;
        });
    };
    HlsM3u8File.prototype.getM3u8FileType = function () {
        return this._fileType;
    };
    HlsM3u8File.prototype.getM3u8ParserResult = function () {
        return this._m3u8ParserResult;
    };
    return HlsM3u8File;
}(resource_1.Resource));
exports.HlsM3u8File = HlsM3u8File;
var HlsM3u8MediaPlaylist = /** @class */ (function (_super) {
    __extends(HlsM3u8MediaPlaylist, _super);
    function HlsM3u8MediaPlaylist(m3u8File) {
        var _this = 
        // automatically resolve the inner resource if it has a base URI
        _super.call(this, m3u8File.getUrl()) || this;
        if (m3u8File.hasBeenParsed()) {
            if (m3u8File.getM3u8FileType() !== HlsM3u8FileType.MEDIA) {
                throw new Error('File is not a media playlist');
            }
        }
        _this._file = m3u8File;
        return _this;
    }
    HlsM3u8MediaPlaylist.prototype.hasBeenParsed = function () {
        return this._file.hasBeenParsed();
    };
    HlsM3u8MediaPlaylist.prototype.parse = function () {
        var _this = this;
        return this._file.parse()
            .then(function (adaptiveMediaPeriods) {
            var media = adaptiveMediaPeriods[0].getDefaultSet().getDefaultMedia();
            log('parsed media playlist:', _this.getUrl());
            // We assume that the embedded file object
            // only parsed exactly one adaptive-media list
            // and has one period - always the case with an HLS chunklist.
            return media;
        });
    };
    HlsM3u8MediaPlaylist.prototype.fetch = function () {
        return this._file.fetch();
    };
    return HlsM3u8MediaPlaylist;
}(resource_1.Resource));
exports.HlsM3u8MediaPlaylist = HlsM3u8MediaPlaylist;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/logger.ts":
/*!*****************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/logger.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Move to Objec-TS long-term
Object.defineProperty(exports, "__esModule", { value: true });
var PREFIX_ROOT = 'R14lt0';
// Disables all logs when false, overrides all local settings
// When true, logging levels are applied as expected per category
var GLOBAL_LOG_ENABLE = true;
var noop = function () { };
var getPrefix = function (type, category) {
    var prefix = "[" + PREFIX_ROOT + "]:[" + type + "]:[" + category + "]>";
    return prefix;
};
var LoggerLevels;
(function (LoggerLevels) {
    LoggerLevels[LoggerLevels["ON"] = Infinity] = "ON";
    LoggerLevels[LoggerLevels["LOG"] = 5] = "LOG";
    LoggerLevels[LoggerLevels["INFO"] = 4] = "INFO";
    LoggerLevels[LoggerLevels["DEBUG"] = 3] = "DEBUG";
    LoggerLevels[LoggerLevels["WARN"] = 2] = "WARN";
    LoggerLevels[LoggerLevels["ERROR"] = 1] = "ERROR";
    LoggerLevels[LoggerLevels["OFF"] = 0] = "OFF";
})(LoggerLevels = exports.LoggerLevels || (exports.LoggerLevels = {}));
exports.getLogger = function (category, level) {
    if (level === void 0) { level = LoggerLevels.ON; }
    if (!GLOBAL_LOG_ENABLE) {
        level = LoggerLevels.OFF;
    }
    return {
        info: level >= LoggerLevels.INFO ? console.info.bind(console, getPrefix('i', category)) : noop,
        log: level >= LoggerLevels.LOG ? console.log.bind(console, getPrefix('l', category)) : noop,
        debug: level >= LoggerLevels.DEBUG ? console.debug.bind(console, getPrefix('d', category)) : noop,
        warn: level >= LoggerLevels.WARN ? console.warn.bind(console, getPrefix('w', category)) : noop,
        error: level >= LoggerLevels.ERROR ? console.error.bind(console, getPrefix('e', category)) : noop
    };
};


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/media-container-info.ts":
/*!*******************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/media-container-info.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cloneable_1 = __webpack_require__(/*! ./cloneable */ "./ext-mod/emliri-es-libs/rialto/lib/cloneable.ts");
var MediaTypeFlag;
(function (MediaTypeFlag) {
    MediaTypeFlag[MediaTypeFlag["AUDIO"] = 1] = "AUDIO";
    MediaTypeFlag[MediaTypeFlag["VIDEO"] = 2] = "VIDEO";
    MediaTypeFlag[MediaTypeFlag["TEXT"] = 4] = "TEXT";
})(MediaTypeFlag = exports.MediaTypeFlag || (exports.MediaTypeFlag = {}));
/**
 * Human-readable `MediaTypeFlag`
 * @param type
 */
function getMediaTypeFlagName(type) {
    switch (type) {
        case MediaTypeFlag.AUDIO: return 'audio';
        case MediaTypeFlag.VIDEO: return 'video';
        case MediaTypeFlag.TEXT: return 'text';
        default: return null;
    }
}
exports.getMediaTypeFlagName = getMediaTypeFlagName;
var MediaContainerInfo = /** @class */ (function (_super) {
    __extends(MediaContainerInfo, _super);
    function MediaContainerInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.containedTypes = new Set();
        return _this;
    }
    MediaContainerInfo.prototype.containsMediaType = function (type) {
        return this.containedTypes.has(type);
    };
    MediaContainerInfo.prototype.intersectsMediaTypeSet = function (mediaTypeSet, indentical) {
        var _this = this;
        if (indentical === void 0) { indentical = false; }
        var hasOne = false;
        var hasAll = true;
        mediaTypeSet.forEach(function (mediaTypeFlag) {
            hasOne = _this.containedTypes.has(mediaTypeFlag);
            if (!hasOne && hasAll) {
                hasAll = false;
            }
        });
        return indentical ? hasAll : hasOne;
    };
    MediaContainerInfo.prototype.hasOneOf = function (mediaTypeSet) {
        return this.intersectsMediaTypeSet(mediaTypeSet, false);
    };
    MediaContainerInfo.prototype.hasAll = function (mediaTypeSet) {
        return this.intersectsMediaTypeSet(mediaTypeSet, true);
    };
    return MediaContainerInfo;
}(cloneable_1.CloneableScaffold));
exports.MediaContainerInfo = MediaContainerInfo;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/media-locator.ts":
/*!************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/media-locator.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __webpack_require__(/*! ./url */ "./ext-mod/emliri-es-libs/rialto/lib/url.ts");
var MediaLocator = /** @class */ (function () {
    function MediaLocator(uri, byteRange, startTime, endTime) {
        if (byteRange === void 0) { byteRange = null; }
        this.uri = uri;
        this.byteRange = byteRange;
        this.startTime = startTime;
        this.endTime = endTime;
        if (startTime > endTime) {
            throw new Error('Media-locator can not be created with startTime > endTime');
        }
        // FIXME: check that we have an absolute and valid URL here
    }
    MediaLocator.fromRelativeURI = function (relativeUri, baseUri, byteRange, startTime, endTime) {
        return new MediaLocator(url_1.resolveUri(relativeUri, baseUri), byteRange, startTime, endTime);
    };
    return MediaLocator;
}());
exports.MediaLocator = MediaLocator;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/media-segment.ts":
/*!************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/media-segment.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = __webpack_require__(/*! ./resource */ "./ext-mod/emliri-es-libs/rialto/lib/resource.ts");
var media_container_info_1 = __webpack_require__(/*! ./media-container-info */ "./ext-mod/emliri-es-libs/rialto/lib/media-container-info.ts");
var logger_1 = __webpack_require__(/*! ./logger */ "./ext-mod/emliri-es-libs/rialto/lib/logger.ts");
var time_intervals_1 = __webpack_require__(/*! ./time-intervals */ "./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts");
var log = logger_1.getLogger('media-segment').log;
/**
 *
 * Represents a time-bound segment of a media
 *
 * @fires fetch:aborted
 * @fires fetch:progress
 * @fires fetch:errored
 * @fires fetch:succeeded
 *
 * @fires buffer:set
 * @fires buffer:clear
 */
var MediaSegment = /** @class */ (function (_super) {
    __extends(MediaSegment, _super);
    function MediaSegment(locator, mimeType, cached) {
        if (mimeType === void 0) { mimeType = null; }
        if (cached === void 0) { cached = false; }
        var _this = _super.call(this, locator.uri, locator.byteRange, null, mimeType) || this;
        _this.timeOffset_ = 0;
        _this.mediaContainerInfo = new media_container_info_1.MediaContainerInfo();
        _this.cached = cached;
        _this.locator_ = locator;
        return _this;
    }
    MediaSegment.prototype.hasBeenParsed = function () { return false; };
    MediaSegment.prototype.parse = function () { return Promise.resolve(this); };
    MediaSegment.prototype.decrypt = function () {
        return null;
    };
    MediaSegment.prototype.getTimeInterval = function () {
        return new time_intervals_1.TimeInterval(this.startTime, this.endTime);
    };
    MediaSegment.prototype.setTimeOffset = function (o) {
        this.timeOffset_ = o;
    };
    MediaSegment.prototype.getTimeOffset = function () { return this.timeOffset_; };
    MediaSegment.prototype.setOrdinalIndex = function (i) {
        this.ordinalIndex_ = i;
    };
    MediaSegment.prototype.getOrdinalIndex = function () { return this.ordinalIndex_; };
    Object.defineProperty(MediaSegment.prototype, "duration", {
        get: function () {
            return this.endTime - this.startTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaSegment.prototype, "startTime", {
        get: function () {
            return this.locator_.startTime + this.timeOffset_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaSegment.prototype, "endTime", {
        get: function () {
            return this.locator_.endTime + this.timeOffset_;
        },
        enumerable: true,
        configurable: true
    });
    return MediaSegment;
}(resource_1.Resource));
exports.MediaSegment = MediaSegment;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/queue.ts":
/*!****************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/queue.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
var Queue = /** @class */ (function (_super) {
    __extends(Queue, _super);
    function Queue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._list = [];
        return _this;
    }
    /**
     * Returns a copy of the internal array
     */
    Queue.prototype.getArray = function () {
        return this._list.slice(0);
    };
    Object.defineProperty(Queue.prototype, "size", {
        get: function () {
            return this._list.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * First item
     */
    Queue.prototype.begin = function () {
        return this._list[0] || null;
    };
    /**
     * Last item
     */
    Queue.prototype.end = function () {
        return this._list[this._list.length - 1] || null;
    };
    /**
     * Adds to the end
     * @param item
     */
    Queue.prototype.add = function (item) {
        this._list.push(item);
        return this;
    };
    /**
     * Removes from the end
     */
    Queue.prototype.subtract = function () {
        return this._list.pop();
    };
    /**
     * Alias for subtract method
     */
    Queue.prototype.pop = function () {
        return this.subtract();
    };
    /**
     * Adds to the begin
     * @param item
     */
    Queue.prototype.enqueue = function (item) {
        this._list.unshift(item);
        return this;
    };
    /**
     * Removes from begin
     */
    Queue.prototype.dequeue = function () {
        return this._list.shift();
    };
    Queue.prototype.insertAt = function (index) {
        var _a;
        var items = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            items[_i - 1] = arguments[_i];
        }
        (_a = this._list).splice.apply(_a, [index, 0].concat(items));
        return this;
    };
    Queue.prototype.removeAll = function (item, limit) {
        if (limit === void 0) { limit = Infinity; }
        var rmCnt = 0;
        while (true) {
            var index = this._list.indexOf(item);
            if (index < 0 || rmCnt + 1 > limit) {
                break;
            }
            this._list.splice(index, 1);
            rmCnt++;
        }
        return rmCnt;
    };
    Queue.prototype.removeOne = function (item) {
        return !!this.removeAll(item, 1);
    };
    Queue.prototype.get = function (index) {
        return this._list[index] || null;
    };
    Queue.prototype.forEach = function (forEachFn) {
        this._list.forEach(forEachFn);
        return this;
    };
    Queue.prototype.containsAtLeastOnce = function (item) {
        return this._list.indexOf(item) >= 0;
    };
    return Queue;
}(eventemitter3_1.EventEmitter));
exports.Queue = Queue;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/resource-request.ts":
/*!***************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/resource-request.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xhr_1 = __webpack_require__(/*! ./xhr */ "./ext-mod/emliri-es-libs/rialto/lib/xhr.ts");
var bytes_read_write_1 = __webpack_require__(/*! ./bytes-read-write */ "./ext-mod/emliri-es-libs/rialto/lib/bytes-read-write.ts");
var ResourceRequestResponseData = /** @class */ (function () {
    function ResourceRequestResponseData(request, resource) {
        this.request = request;
        this.resource = resource;
    }
    ResourceRequestResponseData.prototype.isBinary = function () {
        return this.request.responseData === xhr_1.XHRResponseType.ARRAY_BUFFER
            || this.request.responseData === xhr_1.XHRResponseType.BLOB;
    };
    ResourceRequestResponseData.prototype.isChars = function () {
        return this.request.responseType === xhr_1.XHRResponseType.TEXT
            || this.request.responseType === xhr_1.XHRResponseType.JSON;
    };
    ResourceRequestResponseData.prototype.getArrayBuffer = function () {
        if (this.request.responseType === xhr_1.XHRResponseType.TEXT
            || this.request.responseType === xhr_1.XHRResponseType.JSON) {
            return bytes_read_write_1.utf8StringToArray(this.request.responseData);
        }
        else if (this.request.responseType === xhr_1.XHRResponseType.ARRAY_BUFFER) {
            return this.request.responseData;
        }
        else {
            console.error('Can not convert response data to arraybuffer for url: ' + this.resource.getUrl());
            return null;
        }
    };
    ResourceRequestResponseData.prototype.getString = function (unicode16) {
        if (unicode16 === void 0) { unicode16 = false; }
        if (this.request.responseType === xhr_1.XHRResponseType.TEXT
            || this.request.responseType === xhr_1.XHRResponseType.JSON) {
            return this.request.responseData;
        }
        else if (this.request.responseType === xhr_1.XHRResponseType.ARRAY_BUFFER) {
            if (unicode16) {
                return bytes_read_write_1.unicodeBytesToString(new Uint16Array(this.request.responseData));
            }
            else {
                return bytes_read_write_1.utf8BytesToString(new Uint8Array(this.request.responseData));
            }
        }
        else {
            console.error('Can not convert response data to string');
            return null;
        }
    };
    return ResourceRequestResponseData;
}());
exports.ResourceRequestResponseData = ResourceRequestResponseData;
exports.makeDefaultRequest = function (url, opts) { return new xhr_1.XHR(url, opts.requestCallback, opts.method, opts.responseType, opts.byteRange, opts.headers, opts.data, opts.withCredentials, opts.timeout, opts.forceXMLMimeType); };


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/resource.ts":
/*!*******************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/resource.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
var url_1 = __webpack_require__(/*! ./url */ "./ext-mod/emliri-es-libs/rialto/lib/url.ts");
var xhr_1 = __webpack_require__(/*! ./xhr */ "./ext-mod/emliri-es-libs/rialto/lib/xhr.ts");
var resource_request_1 = __webpack_require__(/*! ./resource-request */ "./ext-mod/emliri-es-libs/rialto/lib/resource-request.ts");
var ResourceEvents;
(function (ResourceEvents) {
    ResourceEvents["BUFFER_SET"] = "buffer:set";
    ResourceEvents["BUFFER_CLEAR"] = "buffer:clear";
    ResourceEvents["FETCH_PROGRESS"] = "fetch:progress";
    ResourceEvents["FETCH_ABORTED"] = "fetch:aborted";
    ResourceEvents["FETCH_ERRORED"] = "fetch:errored";
    ResourceEvents["FETCH_SUCCEEDED"] = "fetch:succeeded";
    ResourceEvents["FETCH_SUCCEEDED_NOT"] = "fetch:succeeded-not";
})(ResourceEvents = exports.ResourceEvents || (exports.ResourceEvents = {}));
var Resource = /** @class */ (function (_super) {
    __extends(Resource, _super);
    /**
     *
     * @param uri may be relative or absolute
     * @param byteRange
     * @param baseUri
     * @param mimeType
     */
    function Resource(uri, byteRange, baseUri, mimeType) {
        if (byteRange === void 0) { byteRange = null; }
        if (baseUri === void 0) { baseUri = null; }
        if (mimeType === void 0) { mimeType = null; }
        var _this = _super.call(this) || this;
        _this.requestMaker_ = null;
        _this.request_ = null;
        _this.requestResponseData_ = [];
        _this.requestBytesLoaded_ = NaN;
        _this.requestBytesTotal_ = NaN;
        _this.fetchLatency_ = NaN;
        _this.fetchResolve_ = null;
        _this.fetchReject_ = null;
        _this.uri_ = uri;
        _this.baseUri_ = baseUri;
        _this.byteRange_ = byteRange;
        _this.mimeType_ = mimeType;
        _this.ab_ = null;
        _this.abortedCnt_ = 0;
        _this.fetchAttemptCnt_ = 0;
        _this.request_ = null;
        return _this;
    }
    Object.defineProperty(Resource.prototype, "uri", {
        get: function () {
            return this.uri_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "baseUri", {
        get: function () {
            return this.baseUri_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "byteRange", {
        get: function () {
            return this.byteRange_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "mimeType", {
        get: function () {
            return this.mimeType_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "hasBuffer", {
        get: function () {
            return this.ab_ !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "hasRequestResponses", {
        get: function () {
            return this.requestResponseData_.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "hasData", {
        get: function () {
            return this.hasBuffer || this.hasRequestResponses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "buffer", {
        get: function () {
            return this.ab_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "timesAborted", {
        get: function () {
            return this.abortedCnt_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "timesFetchAttempted", {
        get: function () {
            return this.fetchAttemptCnt_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "isFetching", {
        get: function () {
            return !!this.request_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "fetchLatency", {
        get: function () {
            return this.fetchLatency_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "requestedBytesLoaded", {
        get: function () { return this.requestBytesLoaded_; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Resource.prototype, "requestedBytesTotal", {
        get: function () { return this.requestBytesTotal_; },
        enumerable: true,
        configurable: true
    });
    ;
    Resource.prototype.setBaseUri = function (baseUri) {
        this.baseUri_ = baseUri;
    };
    /**
     * Tries to resolve the resource's URI to an absolute URL,
     * with the given `baseUri` at construction or the optional argument
     * (which overrides the base of this instance for this resolution, but does not overwrite it).
     * Create a new resource object to do that.
     */
    Resource.prototype.getUrl = function (base) {
        return url_1.resolveUri(this.uri, base ? base : this.baseUri_);
    };
    /*
    getURLObject(): URLObject {
      return new URLObject(this.getUrl())
    }
    */
    Resource.prototype.setBuffer = function (ab) {
        this.ab_ = ab;
        this.emit(ResourceEvents.BUFFER_SET);
    };
    Resource.prototype.clearBuffer = function (ab) {
        this.ab_ = null;
        this.emit(ResourceEvents.BUFFER_CLEAR);
    };
    Resource.prototype.fetch = function () {
        var _this = this;
        this.fetchAttemptCnt_++;
        if (this.request_) {
            throw new Error('Assertion failed: resource already has request for ongoing fetch');
        }
        var fetchPromise = new Promise(function (resolve, reject) {
            _this.fetchResolve_ = resolve;
            _this.fetchReject_ = reject;
        });
        var url = this.getUrl();
        //console.log(url);
        var makeRequest = this.getRequestMaker();
        this.requestBytesLoaded_ = NaN;
        this.requestBytesTotal_ = NaN;
        this.request_ = makeRequest(url, {
            requestCallback: this.onRequestCallback_.bind(this),
            method: xhr_1.XHRMethod.GET,
            responseType: xhr_1.XHRResponseType.ARRAY_BUFFER,
            byteRange: this.byteRange
        });
        return fetchPromise;
    };
    Resource.prototype.abort = function () {
        if (!this.request_) {
            throw new Error('Assertion failed: can`t abort, resource has no ongoing request');
        }
        this.abortedCnt_++;
        this.request_.abort();
    };
    /**
     *
     * @param rm passing null means use default
     */
    Resource.prototype.setRequestMaker = function (rm) {
        this.requestMaker_ = rm;
    };
    Resource.prototype.getRequestMaker = function () {
        if (this.requestMaker_) {
            return this.requestMaker_;
        }
        return resource_request_1.makeDefaultRequest;
    };
    Resource.prototype.hasCustomRequestMaker = function () {
        return !!this.requestMaker_;
    };
    Resource.prototype.getRequestResponses = function () {
        return this.requestResponseData_;
    };
    Resource.prototype.flushAllRequestResponses = function () {
        this.requestResponseData_ = [];
    };
    Resource.prototype.getRequestResponse = function (pop) {
        if (pop === void 0) { pop = false; }
        if (pop) {
            return this.requestResponseData_.pop();
        }
        else {
            if (this.requestResponseData_.length === 0) {
                throw new Error('No response datas for resources');
            }
            return this.requestResponseData_[this.requestResponseData_.length - 1];
        }
    };
    Resource.prototype.setExternalyFetchedBytes = function (loaded, total, latency) {
        this.requestBytesLoaded_ = loaded;
        this.requestBytesTotal_ = total;
        this.fetchLatency_ = latency;
        this.emit(ResourceEvents.FETCH_PROGRESS);
    };
    Resource.prototype.onRequestCallback_ = function (request, isProgressUpdate) {
        //console.log('onRequestCallback', request.xhrState, XHRState.DONE)
        var reset = false;
        if (request !== this.request_) {
            throw new Error('Assertion failed: request-callback has invalid user-data reference');
        }
        if (request.xhrState === xhr_1.XHRState.DONE) {
            this.fetchLatency_ = request.secondsUntilDone;
            if (request.wasSuccessful()) {
                var response = new resource_request_1.ResourceRequestResponseData(request, this);
                this.requestResponseData_.push(response);
                //console.log('data', request.responseData)
                this.setBuffer(response.getArrayBuffer());
                //console.log('resolve')
                this.fetchResolve_(this);
                this.emit(ResourceEvents.FETCH_SUCCEEDED);
            }
            else {
                // this.fetchReject_(); // reject or just let time-out in case?
                this.emit(ResourceEvents.FETCH_SUCCEEDED_NOT);
            }
            reset = true;
        }
        else if (request.xhrState === xhr_1.XHRState.LOADING) {
            this.fetchLatency_ = request.secondsUntilLoading;
        }
        else if (request.xhrState === xhr_1.XHRState.HEADERS_RECEIVED) {
            this.fetchLatency_ = request.secondsUntilHeaders;
        }
        else if (request.xhrState === xhr_1.XHRState.OPENED) {
            //
        }
        if (isProgressUpdate) {
            this.requestBytesLoaded_ = request.loadedBytes;
            this.requestBytesTotal_ = request.totalBytes;
            this.emit(ResourceEvents.FETCH_PROGRESS, request.loadedBytes, request.totalBytes);
        }
        if (request.hasBeenAborted) {
            this.emit(ResourceEvents.FETCH_ABORTED);
            this.fetchReject_(new Error('Fetching media segment was aborted'));
        }
        if (request.hasErrored) {
            this.emit(ResourceEvents.FETCH_ERRORED);
            this.fetchReject_(request.error);
        }
        if (reset) {
            // reset fetch promise hooks
            this.fetchReject_ = null;
            this.fetchResolve_ = null;
            // XHR object is done and over, let's get rid of it
            this.request_ = null;
        }
    };
    return Resource;
}(eventemitter3_1.EventEmitter));
exports.Resource = Resource;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts":
/*!*************************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author Stephan Hesse (c) Copyright 2018 <stephan@emliri.com>
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TimeInterval = /** @class */ (function () {
    function TimeInterval(start, end) {
        this.start = start;
        this.end = end;
        this._props = {
            seekable: true,
            desired: false,
            fetched: false
        };
        if (!Number.isFinite(start) || !Number.isFinite(end)) {
            throw new Error('Interval is non-finite');
        }
        if (end <= start) {
            throw new Error("Time-range must have end (" + end + ") strictly larger than start (" + start + ")");
        }
    }
    Object.defineProperty(TimeInterval.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeInterval.prototype, "duration", {
        /**
         * @returns must be > 0
         */
        get: function () {
            return this.end - this.start;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param range
     * @returns positive if `range` starts after this starts
     */
    TimeInterval.prototype.compareStart = function (range) {
        return range.start - this.start;
    };
    /**
     *
     * @param range
     * @returns positive if `range` ends after this ends
     */
    TimeInterval.prototype.compareEnd = function (range) {
        return range.end - this.end;
    };
    /**
     *
     * @param time a value to compare this interval with
     * @param strict when true, uses strict comparison (boundaries not part of interval)
     * @returns true when time values lies within interval
     */
    TimeInterval.prototype.compareInterval = function (time, strict) {
        if (strict === void 0) { strict = false; }
        if (strict) {
            return time > this.start && time < this.end;
        }
        else {
            return time >= this.start && time <= this.end;
        }
    };
    /**
     *
     * @param range
     * @returns true when `range` is fully inside this
     */
    TimeInterval.prototype.contains = function (range) {
        return this.compareStart(range) >= 0 && this.compareEnd(range) <= 0;
    };
    /**
     *
     * @param range
     * @returns true when `range` interval is equal to this
     */
    TimeInterval.prototype.equals = function (range) {
        return this.compareStart(range) === 0 && this.compareEnd(range) === 0;
    };
    /**
     *
     * @param range
     * @returns true when ranges overlap somehow
     */
    TimeInterval.prototype.overlapsWith = function (range) {
        var _a = this._getOverlapRangeBoundaries(range), start = _a[0], end = _a[1];
        return start < end;
    };
    /**
     *
     * @param range
     * @returns true when `range` and this are continuous in their interval values
     */
    TimeInterval.prototype.touchesWith = function (range) {
        return (range.end === this.start || this.end === range.start);
    };
    /**
     *
     * @param range
     * @returns true when this is continued by `range`
     * See `touchesWith` but implies order, when this comes after `range`.
     */
    TimeInterval.prototype.continues = function (range) {
        return range.compareStart(this) === range.duration;
    };
    /**
     *
     * @param range
     * @returns a new range object that represents the overlapping range region (if any) or `null`
     */
    TimeInterval.prototype.getOverlappingRange = function (range) {
        var _a = this._getOverlapRangeBoundaries(range), start = _a[0], end = _a[1];
        // if both ranges don't overlap at all
        // we will obtain end <= start here
        // this is a shorthand to do this check built in our constructor
        var overlapRange;
        try {
            overlapRange = new TimeInterval(start, end);
        }
        catch (err) {
            overlapRange = null;
        }
        return overlapRange;
    };
    /**
     *
     * @param range
     * @returns a new range object that represents the merge of two ranges (that must overlap)
     */
    TimeInterval.prototype.getMergedRange = function (range) {
        if (!range.overlapsWith(this) && !range.touchesWith(this)) {
            return null;
        }
        // If both ranges already overlap (or touch) then the merge is
        // simply the range over the min of both starts and the max of both ends
        return new TimeInterval(Math.min(this.start, range.start), Math.max(this.end, range.end));
    };
    TimeInterval.prototype.getGapRange = function (range) {
        if (range.overlapsWith(this)) {
            return null;
        }
        // If both ranges don't overlap at all
        // simply the range over the min of both ends as start and the max of both starts as end
        return new TimeInterval(Math.min(this.end, range.end), Math.max(this.start, range.start));
    };
    /**
     *
     * @param range
     * @returns candidates for start/end points of overlapping ranges (when start > end then they don't overlap)
     */
    TimeInterval.prototype._getOverlapRangeBoundaries = function (range) {
        var startDiff = this.compareStart(range);
        var endDiff = this.compareEnd(range);
        var start;
        var end;
        // compute candidates for overlapping range boundaries
        if (startDiff > 0) {
            start = range.start;
        }
        else {
            start = this.start;
        }
        if (endDiff > 0) {
            end = this.end;
        }
        else {
            end = range.end;
        }
        return [start, end];
    };
    return TimeInterval;
}());
exports.TimeInterval = TimeInterval;
var TimeIntervalContainer = /** @class */ (function () {
    function TimeIntervalContainer(_ranges, _isFlat) {
        if (_ranges === void 0) { _ranges = []; }
        if (_isFlat === void 0) { _isFlat = false; }
        this._ranges = _ranges;
        this._isFlat = _isFlat;
    }
    TimeIntervalContainer.fromTimeRanges = function (ranges) {
        var timeIntervalContainer = new TimeIntervalContainer();
        timeIntervalContainer.addTimeRanges(ranges);
    };
    Object.defineProperty(TimeIntervalContainer.prototype, "ranges", {
        get: function () {
            return this._ranges;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeIntervalContainer.prototype, "size", {
        get: function () {
            return this._ranges.length;
        },
        enumerable: true,
        configurable: true
    });
    TimeIntervalContainer.prototype.add = function (range) {
        this._isFlat = false;
        this._ranges.push(range);
        return this;
    };
    TimeIntervalContainer.prototype.clear = function () {
        this._ranges = [];
        this._isFlat = false;
        return this;
    };
    /**
     * Flattens the time-ranges so that if they overlap or touch they get merged into one.
     * This can be used to avoid when we add overlapping time-ranges that the container elements number
     * grows while keeping the same necessary information for most use-cases.
     * @returns a flattened version of the time-intervals in this container
     */
    TimeIntervalContainer.prototype.flatten = function (inPlace) {
        if (inPlace === void 0) { inPlace = false; }
        if (this._isFlat) {
            return this;
        }
        var newRanges = [];
        var previousRange = null;
        this._ranges.forEach(function (range) {
            if (!previousRange) {
                newRanges.push(range);
                previousRange = range;
                return;
            }
            var overlap = previousRange.getMergedRange(range);
            if (overlap) {
                newRanges.pop(); // pop of the previous range since it overlaps/touches with current
                newRanges.push(overlap); // push in the merge of both
                range = overlap; // the current range becomes the merged range
            }
            else {
                newRanges.push(range);
            }
            previousRange = range; // the previous range might also be merged one (as it may overlap/touch with future ranges)
        });
        if (inPlace) {
            this._ranges = newRanges;
            this._isFlat = true;
            return this;
        }
        else {
            return new TimeIntervalContainer(newRanges, true);
        }
    };
    TimeIntervalContainer.prototype.sort = function (inPlace) {
        if (inPlace === void 0) { inPlace = false; }
        var newRanges = this._ranges.sort(function (a, b) {
            return a.start - b.start;
        });
        if (inPlace) {
            this._ranges = newRanges;
            return this;
        }
        else {
            return new TimeIntervalContainer(newRanges);
        }
    };
    /**
     * Cross-checks every range in this container with the ranges in other containers for overlaps.
     * Early-returns as soon as the first overlap is found.
     * @param ranges
     * @returns true if any range from this overlaps with a range from that
     */
    TimeIntervalContainer.prototype.hasOverlappingRangesWith = function (ranges) {
        var thisFlat = this.flatten().ranges;
        var otherFlat = ranges.flatten().ranges;
        for (var i = 0; i < thisFlat.length; i++) {
            for (var k = 0; k < otherFlat.length; k++) {
                if (thisFlat[i].overlapsWith(otherFlat[k])) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Checks one value against all intervals in this
     * @param value
     */
    TimeIntervalContainer.prototype.hasIntervalsWith = function (value) {
        var thisFlat = this.flatten().ranges;
        for (var i = 0; i < thisFlat.length; i++) {
            if (thisFlat[i].compareInterval(value)) {
                return true;
            }
        }
        return false;
    };
    TimeIntervalContainer.prototype.getEarliestRange = function () {
        if (this._ranges.length === 0) {
            return null;
        }
        return this.sort().ranges[0];
    };
    /**
     * @returns duration as sum of all interval durations. will be equal to window duration
     * if the media is gapless and has no time-plane discontinuities.
     */
    TimeIntervalContainer.prototype.getCumulatedDuration = function () {
        return this._ranges.reduce(function (accu, range) {
            return accu + range.duration;
        }, 0);
    };
    /**
     * @returns duration as difference between last interval end and first interval start
     */
    TimeIntervalContainer.prototype.getWindowDuration = function () {
        if (!this._ranges.length) {
            return 0;
        }
        var duration = this._ranges[this._ranges.length - 1].end - this._ranges[0].start;
        if (duration <= 0) {
            throw new Error('Window-duration should be larger than zero');
        }
        return duration;
    };
    TimeIntervalContainer.prototype.toTimeRanges = function () {
        // FIXME:
        throw new Error('Not implemented');
    };
    /**
     * For compatibility with HTML5 native TimeRanges object,
     * converts them internally to TimeInterval for each element in TimeRanges container.
     * @param ranges HTML5 TimeRanges object
     */
    TimeIntervalContainer.prototype.addTimeRanges = function (ranges) {
        for (var i = 0; i < ranges.length; i++) {
            this.add(new TimeInterval(ranges.start(i), ranges.end(i)));
        }
    };
    return TimeIntervalContainer;
}());
exports.TimeIntervalContainer = TimeIntervalContainer;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/time-scale.ts":
/*!*********************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/time-scale.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TimeScale = /** @class */ (function () {
    function TimeScale(_base) {
        if (_base === void 0) { _base = 1; }
        this._base = _base;
    }
    Object.defineProperty(TimeScale.prototype, "scale", {
        get: function () {
            return 1 / this._base;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeScale.prototype, "base", {
        get: function () {
            return this._base;
        },
        enumerable: true,
        configurable: true
    });
    TimeScale.prototype.normalize = function (value) {
        return value * this._base;
    };
    TimeScale.prototype.denormalize = function (normalValue) {
        return normalValue / this._base;
    };
    return TimeScale;
}());
exports.TimeScale = TimeScale;
function toNormalizedFromTimebase(value, base) {
    return value * base;
}
exports.toNormalizedFromTimebase = toNormalizedFromTimebase;
function toTimebaseFromNormal(value, base) {
    return value / base;
}
exports.toTimebaseFromNormal = toTimebaseFromNormal;
function toNormalizedFromTimescale(value, scale) {
    return toNormalizedFromTimebase(value, 1 / scale);
}
exports.toNormalizedFromTimescale = toNormalizedFromTimescale;
function toTimescaleFromNormal(value, scale) {
    return toTimebaseFromNormal(value, 1 / scale);
}
exports.toTimescaleFromNormal = toTimescaleFromNormal;
function toSecondsFromMillis(millis) {
    return toNormalizedFromTimebase(millis, 1 / 1000);
}
exports.toSecondsFromMillis = toSecondsFromMillis;
function toMillsFromSeconds(seconds) {
    return toTimebaseFromNormal(seconds, 1 / 1000);
}
exports.toMillsFromSeconds = toMillsFromSeconds;
function toSecondsFromMicros(millis) {
    return toNormalizedFromTimebase(millis, 1 / 1000000);
}
exports.toSecondsFromMicros = toSecondsFromMicros;
function toSecondsFromNanos(millis) {
    return toNormalizedFromTimebase(millis, 1 / 1000000000);
}
exports.toSecondsFromNanos = toSecondsFromNanos;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/url.ts":
/*!**************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/url.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// We may extend our own container classes with a few of these methods
// @see https://github.com/tjenkinson/url-toolkit
var url_toolkit_1 = __webpack_require__(/*! url-toolkit */ "url-toolkit");
/**
 * Idea is to extend from the URL W3C standard interface
 * (i.e implement it where not supported natively)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL
 * @see https://www.npmjs.com/package/url-polyfill (relying on this for now as implementation shim)
 */
/*
export class URLObject extends URL {
  constructor(uri: string, base: string = null) {
    super(uri, base || undefined)
  }
}
*/
function resolveUri(relativeUri, baseUri) {
    //console.log('resolveUri:', relativeUri, baseUri);
    if (!baseUri) {
        return relativeUri;
    }
    var resolvedUrl = url_toolkit_1.buildAbsoluteURL(baseUri, relativeUri, {
        alwaysNormalize: true
    });
    //console.log(resolvedUrl);
    return resolvedUrl;
}
exports.resolveUri = resolveUri;


/***/ }),

/***/ "./ext-mod/emliri-es-libs/rialto/lib/xhr.ts":
/*!**************************************************!*\
  !*** ./ext-mod/emliri-es-libs/rialto/lib/xhr.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author Stephan Hesse <disparat@gmail.com>
 * @module xhr An improvement over the standard XMLHttpRequest API (and with type-safety :)
 *
 * For usage in a Node.js base env (like ts-node) @see https://www.npmjs.com/package/node-http-xhr
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(/*! ./logger */ "./ext-mod/emliri-es-libs/rialto/lib/logger.ts");
var bytes_read_write_1 = __webpack_require__(/*! ./bytes-read-write */ "./ext-mod/emliri-es-libs/rialto/lib/bytes-read-write.ts");
var log = logger_1.getLogger('xhr').log;
var PROGRESS_UPDATES_ENABLED = true;
var createXHRHeadersMapFromString = function (rawHeaders) {
    var arr = rawHeaders.trim().split(/[\r\n]+/);
    // create an object without a prototype (a plain vanilla "dictionary")
    var map = Object.create(null);
    arr.forEach(function (line) {
        var parts = line.split(': ');
        var header = parts.shift();
        var value = parts.join(': ');
        map[header] = value;
    });
    return map;
};
var XHRMethod;
(function (XHRMethod) {
    XHRMethod["GET"] = "GET";
    XHRMethod["POST"] = "POST";
    XHRMethod["PUT"] = "PUT";
    XHRMethod["DELETE"] = "DELETE";
    XHRMethod["OPTIONS"] = "OPTIONS";
    XHRMethod["HEAD"] = "HEAD";
})(XHRMethod = exports.XHRMethod || (exports.XHRMethod = {}));
var XHRResponseType;
(function (XHRResponseType) {
    XHRResponseType["VOID"] = "";
    XHRResponseType["ARRAY_BUFFER"] = "arraybuffer";
    XHRResponseType["BLOB"] = "blob";
    XHRResponseType["DOCUMENT"] = "document";
    XHRResponseType["JSON"] = "json";
    XHRResponseType["TEXT"] = "text"; //	DOMString
})(XHRResponseType = exports.XHRResponseType || (exports.XHRResponseType = {}));
var XHRState;
(function (XHRState) {
    XHRState[XHRState["UNSENT"] = XMLHttpRequest.UNSENT || 0] = "UNSENT";
    XHRState[XHRState["OPENED"] = XMLHttpRequest.OPENED || 1] = "OPENED";
    XHRState[XHRState["HEADERS_RECEIVED"] = XMLHttpRequest.HEADERS_RECEIVED || 2] = "HEADERS_RECEIVED";
    XHRState[XHRState["LOADING"] = XMLHttpRequest.LOADING || 3] = "LOADING";
    XHRState[XHRState["DONE"] = XMLHttpRequest.DONE || 4] = "DONE";
})(XHRState = exports.XHRState || (exports.XHRState = {}));
var XHRStatusCategory;
(function (XHRStatusCategory) {
    XHRStatusCategory["VOID"] = "void";
    XHRStatusCategory["INFO"] = "info";
    XHRStatusCategory["SUCCESS"] = "success";
    XHRStatusCategory["REDIRECT"] = "redirect";
    XHRStatusCategory["REQUEST_ERROR"] = "request_error";
    XHRStatusCategory["SERVER_ERROR"] = "server_error";
    XHRStatusCategory["CUSTOME_SERVER_ERROR"] = "custom_server_error";
})(XHRStatusCategory = exports.XHRStatusCategory || (exports.XHRStatusCategory = {}));
/**
 *
 * Thin wrapper to keep state of one XHR.
 *
 * This class allows to perform requests, deal with their outcome and intermediate states.
 *
 * Requests are being sent out directly on construction (there is no state in between creating and sending a request).
 *
 * Any state change is signaled via the one callback function passed on construction.
 *
 * Request `xhrState` and HTTP `status` can be read via the respective instance properties.
 *
 * Check the values from within your callback.
 *
 * Same goes for response headers and body data, or eventual errors or abortion flags.
 *
 * The object is not recycleable (lives only for one single request, does not care about retrying and such).
 *
 * @class
 * @constructor
 */
var XHR = /** @class */ (function () {
    function XHR(url, xhrCallback, method, responseType, byteRange, headers, data, withCredentials, timeout, forceXMLMimeType) {
        if (xhrCallback === void 0) { xhrCallback = function () { }; }
        if (method === void 0) { method = XHRMethod.GET; }
        if (responseType === void 0) { responseType = XHRResponseType.VOID; }
        if (byteRange === void 0) { byteRange = null; }
        if (headers === void 0) { headers = null; }
        if (data === void 0) { data = null; }
        if (withCredentials === void 0) { withCredentials = false; }
        if (timeout === void 0) { timeout = 0; }
        if (forceXMLMimeType === void 0) { forceXMLMimeType = false; }
        this._responseHeadersMap = null;
        this._error = null;
        this._state = XHRState.UNSENT;
        this._aborted = false;
        this._loadedBytes = 0;
        this._totalBytes = 0;
        this._progressUpdatesEnabled = PROGRESS_UPDATES_ENABLED;
        this._timeUntilHeaders = NaN;
        this._timeUntilLoading = NaN;
        this._timeUntilDone = NaN;
        /**
         * Enables "Content-Range" request header from given `ByteRange` object in constructor
         */
        this.enableContentRange = false;
        this.encodeStringsToUtf8Buffer = false;
        this._createdAt = new Date();
        this._xhrCallback = xhrCallback;
        var xhr = this._xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.responseType = responseType;
        xhr.onreadystatechange = this.onReadyStateChange.bind(this);
        xhr.onerror = this.onError.bind(this);
        xhr.onabort = this.onAbort.bind(this);
        xhr.onprogress = this.onProgress.bind(this);
        if (byteRange) {
            //log('set byte-range:', byteRange.toHttpHeaderValue(), byteRange.toString())
            if (this.enableContentRange) {
                xhr.setRequestHeader('Content-Range', byteRange.toHttpHeaderValue(true));
            }
            xhr.setRequestHeader('Range', byteRange.toHttpHeaderValue(false));
        }
        if (headers) {
            headers.forEach(function (_a) {
                var header = _a[0], value = _a[1];
                xhr.setRequestHeader(header, value);
            });
        }
        if (data === null) {
            data = undefined;
        }
        xhr.timeout = timeout;
        xhr.withCredentials = withCredentials;
        if (forceXMLMimeType) {
            xhr.overrideMimeType('text/xml');
        }
        xhr.send(data);
    }
    XHR.prototype.setProgressUpdatesEnabled = function (enabled) {
        this._progressUpdatesEnabled = enabled;
    };
    Object.defineProperty(XHR.prototype, "isInfo", {
        get: function () {
            return this._xhr.status >= 100 && this._xhr.status <= 199;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isSuccess", {
        /**
         * @returns {boolean} Returns `true` when request status code is in range [200-299] (success)
         */
        get: function () {
            return this._xhr.status >= 200 && this._xhr.status <= 299;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isRedirect", {
        /**
         * @returns {boolean} Returns `true` when request status code is signaling redirection
         */
        get: function () {
            return this._xhr.status >= 300 && this._xhr.status <= 399;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isRequestError", {
        get: function () {
            return this._xhr.status >= 400 && this._xhr.status <= 499;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isServerError", {
        get: function () {
            return this._xhr.status >= 500 && this._xhr.status <= 599;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isCustomServerError", {
        get: function () {
            return this._xhr.status >= 900 && this._xhr.status <= 999;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isContentRange", {
        get: function () {
            return this._xhr.status === 206;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "isVoidStatus", {
        get: function () {
            return this._xhr.status === 0;
        },
        enumerable: true,
        configurable: true
    });
    XHR.prototype.getStatusCategory = function () {
        if (this.isInfo) {
            return XHRStatusCategory.INFO;
        }
        if (this.isSuccess) {
            return XHRStatusCategory.SUCCESS;
        }
        if (this.isRedirect) {
            return XHRStatusCategory.REDIRECT;
        }
        if (this.isRequestError) {
            return XHRStatusCategory.REQUEST_ERROR;
        }
        if (this.isServerError) {
            return XHRStatusCategory.SERVER_ERROR;
        }
        if (this.isCustomServerError) {
            return XHRStatusCategory.SERVER_ERROR;
        }
        return XHRStatusCategory.VOID;
    };
    Object.defineProperty(XHR.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "upload", {
        /**
         * Native Upload object
         * @readonly
         */
        get: function () {
            return this._xhr.upload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "xhr", {
        /**
         * Native XHR object
         * @readonly
         */
        get: function () {
            return this._xhr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "xhrState", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "status", {
        get: function () {
            return this._xhr.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "statusText", {
        get: function () {
            return this._xhr.statusText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "responseHeaders", {
        get: function () {
            return this._responseHeadersMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "responseType", {
        get: function () {
            switch (this._xhr.responseType) {
                case 'arraybuffer': return XHRResponseType.ARRAY_BUFFER;
                case 'blob': return XHRResponseType.BLOB;
                case 'document': return XHRResponseType.DOCUMENT;
                case 'json': return XHRResponseType.JSON;
                case '':
                case 'text': return XHRResponseType.TEXT;
            }
            throw new Error('No mapping for XHR response type: ' + this._xhr.responseType);
            /*
            console.error('No mapping for XHR response type: ' + this._xhr.responseType);
            return XHRResponseType.TEXT;
            */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "responseData", {
        get: function () {
            if (this._xhr.responseType === 'text') {
                if (this.encodeStringsToUtf8Buffer) {
                    return bytes_read_write_1.utf8StringToArray(this.responseText);
                }
                else {
                    return this.responseText;
                }
            }
            return this._xhr.response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "responseText", {
        get: function () {
            // when the response is not text and we call on the property, native XHR crashes
            try {
                return this._xhr.responseText;
            }
            catch (invalidStateError) {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "responseDocument", {
        get: function () {
            return this._xhr.responseXML;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "responseURL", {
        get: function () {
            return this._xhr.responseURL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "hasBeenAborted", {
        get: function () {
            return this._aborted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "hasErrored", {
        get: function () {
            return !!this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "loadedBytes", {
        get: function () {
            return this._loadedBytes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "totalBytes", {
        get: function () {
            return this._totalBytes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "secondsUntilHeaders", {
        get: function () {
            return this._timeUntilHeaders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "secondsUntilLoading", {
        get: function () {
            return this._timeUntilLoading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "secondsUntilDone", {
        get: function () {
            return this._timeUntilDone;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XHR.prototype, "loadedFraction", {
        /**
         * @returns {number}
         */
        get: function () {
            return this._loadedBytes / this._totalBytes;
        },
        enumerable: true,
        configurable: true
    });
    XHR.prototype.getSecondsSinceCreated = function () {
        return (new Date().getTime() - this._createdAt.getTime()) / 1000;
    };
    XHR.prototype.abort = function () {
        this._xhr.abort();
    };
    XHR.prototype.wasSuccessful = function () {
        return this.getStatusCategory() === XHRStatusCategory.SUCCESS;
    };
    XHR.prototype.onReadyStateChange = function () {
        var xhr = this._xhr;
        this._state = xhr.readyState;
        switch (xhr.readyState) {
            case XMLHttpRequest.UNSENT:
                break;
            case XMLHttpRequest.OPENED:
                break;
            case XMLHttpRequest.HEADERS_RECEIVED:
                this._timeUntilHeaders = this.getSecondsSinceCreated();
                var headers = xhr.getAllResponseHeaders();
                this._responseHeadersMap = createXHRHeadersMapFromString(headers);
                break;
            case XMLHttpRequest.LOADING:
                this._timeUntilLoading = this.getSecondsSinceCreated();
                break;
            case XMLHttpRequest.DONE:
                this._timeUntilDone = this.getSecondsSinceCreated();
                break;
        }
        this._xhrCallback(this, false);
    };
    XHR.prototype.onError = function (event) {
        this._error = event.error;
        this._xhrCallback(this, false);
    };
    XHR.prototype.onAbort = function (event) {
        this._aborted = true;
        this._xhrCallback(this, false);
    };
    XHR.prototype.onProgress = function (event) {
        this._loadedBytes = event.loaded;
        this._totalBytes = event.total;
        if (this._progressUpdatesEnabled) {
            this._xhrCallback(this, true);
        }
    };
    return XHR;
}());
exports.XHR = XHR;


/***/ }),

/***/ "./ext-mod/node-http-xhr/lib/index.js":
/*!********************************************!*\
  !*** ./ext-mod/node-http-xhr/lib/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Node.js `XMLHttpRequest` implementation using `http.request()`.
 *
 * @module node-http-xhr
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var url = __webpack_require__(/*! url */ "url");
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");

var NodeXHREventTarget = __webpack_require__(/*! ./node-xhr-event-target */ "./ext-mod/node-http-xhr/lib/node-xhr-event-target.js");

/**
 * Currently-supported response types.
 *
 * @private
 * @readonly
 * @type {Object<String, Boolean>}
 */
var supportedResponseTypes = Object.freeze({
  /** Text response (implicit) */
  '': true,
  /** Text response */
  'text': true,
  /** Binary-data response */
  'arraybuffer': true,
  /** JSON response */
  'json': true
});

/**
 * Makes a request using either `http.request` or `https.request`, depending
 * on the value of `opts.protocol`.
 *
 * @private
 * @param {Object} opts - Options for the request.
 * @param {Function} cb - Callback for request.
 * @returns {ClientRequest} The request.
 */
function makeRequest(opts, cb) {
  if (opts.protocol === 'http:') {
    return http.request(opts, cb);
  } else if (opts.protocol === 'https:') {
    return https.request(opts, cb);
  }

  throw new Error('Unsupported protocol "' + opts.protcol + '"');
}

/**
 * Creates a new `XMLHttpRequest`.
 *
 * @classdesc A wrapper around `http.request` that attempts to emulate the
 * `XMLHttpRequest` API.
 *
 * NOTE: Currently, some features are lacking:
 * - Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
 * - `responseType` values other than '' or 'text' and corresponding parsing
 *   - As a result of the above, `overrideMimeType()` isn't very useful
 * - `setRequestHeader()` doesn't check for forbidden headers.
 * - `withCredentials` is defined as an instance property, but doesn't do
 *   anything since there's no use case for CORS-like requests in `node.js`
 *   right now.
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * `XMLHttpRequest` on MDN
 * } for more details.
 *
 * @class
 * @extends module:node-xhr-event-target
 */
module.exports = function () {
  NodeXHREventTarget.call(this);

  /**
   * Current ready state.
   *
   * @private
   */
  this._readyState = this.UNSENT;

  /**
   * MIME type to use instead of the type specified by the response, or `null`
   * to use the response MIME type.
   *
   * @type {?String}
   * @private
   */
  this._mimetype = null;

  /**
   * Options for `http.request`.
   *
   * @see {@link
   * https://nodejs.org/dist/latest/docs/api/http.html
   * node.js `http` docs
   * }
   * @private
   * @type {Object}
   */
  this._reqOpts = {
    timeout: 0,
    headers: {}
  };

  /**
   * The request (instance of `http.ClientRequest`), or `null` if the request
   * hasn't been sent.
   *
   * @private
   * @type {?http.ClientRequest}
   */
  this._req = null;

  /**
   * The response (instance of `http.IncomingMessage`), or `null` if the
   * response has not arrived yet.
   *
   * @private
   * @type {?http.IncomingMessage}
   */
  this._resp = null;

  /**
   * The type of the response. Currently, only `''` and `'text'` are
   * supported, which both indicate the response should be a `String`.
   *
   * @private
   * @type {String}
   * @default ''
   */
  this._responseType = '';

  /**
   * The current response text, or `null` if the request hasn't been sent or
   * was unsuccessful.
   *
   * @private
   * @type {?String}
   */
  this._responseText = null;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
   *
   * @private
   * @type {ArrayBuffer | String | Object}
   */
  this._response = null;
};

/** @alias module:node-http-xhr */
var NodeHttpXHR = module.exports;

//
// Set up public API
//
NodeHttpXHR.prototype = Object.create(
  NodeXHREventTarget.prototype,
  /** @lends module:node-http-xhr.prototype */
  {
    /**
     * Ready state indicating the request has been created, but `open()` has not
     * been called yet.
     *
     * @type {Number}
     * @default 0
     * @readonly
     */
    UNSENT: { value: 0 },
    /**
     * Ready state indicating that `open()` has been called, but the headers
     * have not been received yet.
     *
     * @type {Number}
     * @default 1
     * @readonly
     */
    OPENED: { value: 1 },
    /**
     * Ready state indicating that `send()` has been called and the response
     * headers have been received.
     *
     * @type {Number}
     * @default 2
     * @readonly
     */
    HEADERS_RECEIVED: { value: 2 },
    /**
     * Ready state indicating that the response body is being loaded.
     *
     * @type {Number}
     * @default 3
     * @readonly
     */
    LOADING: { value: 3 },
    /**
     * Ready state indicating that the response has completed, or the request
     * was aborted/encountered an error.
     *
     * @type {Number}
     * @default 4
     * @readonly
     */
    DONE: { value: 4 },
    /**
     * The current ready state.
     *
     * @type {Number}
     * @readonly
     */
    readyState: {
      get: function getReadyState() { return this._readyState; }
    },
    /**
     * The status code for the response, or `0` if the response headers have
     * not been received yet.
     *
     * @type {Number}
     * @example 200
     * @readonly
     */
    status: {
      get: function getStatus() {
        if (!this._resp) {
          return 0;
        }

        return this._resp.statusCode;
      }
    },
    /**
     * The status text for the response, or `''` if the response headers have
     * not been received yet.
     *
     * @type {String}
     * @example 'OK'
     * @readonly
     */
    statusText: {
      get: function getStatusText() {
        if (!this._resp) {
          return '';
        }

        return this._resp.statusMessage;
      }
    },
    /**
     * The timeout for the request, in milliseconds. `0` means no timeout.
     *
     * @type {Number}
     * @default 0
     */
    timeout: {
      get: function getTimeout() { return this._reqOpts.timeout; },
      set: function setTimeout(timeout) {
        this._reqOpts.timeout = timeout;
        if (this._req) {
          this._req.setTimeout(timeout);
        }
      }
    },
    /**
     * The type of the response. Currently, only `''` and `'text'` are
     * supported, which both indicate the response should be a `String`.
     *
     * @see {@link
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
     * `XMLHttpRequest.responseType` on MDN
     * }
     *
     * @type {String}
     * @default ''
     */
    responseType: {
      get: function () { return this._responseType; },
      set: function (responseType) {
        if (!(responseType in supportedResponseTypes)) {
          return;
        }

        this._responseType = responseType;
      }
    },
    /**
     * The response, encoded according to {@link
     * module:node-http-xhr#responseType
     * `responseType`
     * }.
     *
     * If `send()` has not been called yet, this is `null`.
     *
     * If `responseType` is `''` or `'text'`, this is a `String` and will be
     * be incomplete until the response actually finishes.
     *
     * @type {?*}
     * @default ''
     * @readonly
     */
    response: {
      get: function getResponse() {
        var type = this.responseType;
        if (!(type in supportedResponseTypes)) {
          throw new Error('Unsupported responseType "' + type + '"');
        }

        switch (type) {
        case '':
        case 'text':
          return this._responseText;
        case 'json':
          return JSON.parse(this._responseText);
        case 'arraybuffer':
          return this._response.buffer;
        default:
          throw new Error('Assertion failed: unsupported response-type: ' + type);
        }
      }
    },
    /**
     * The response body as a string.
     *
     * If `send()` has not been called yet, this is `null`.
     *
     * This will be incomplete until the response actually finishes.
     *
     * @type {?String}
     * @throws when `response` not a String
     * @readonly
     */
    responseText: {
      get: function getResponseText() {

        // @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText#Exceptions
        if (this._responseType !== 'text' && this._responseType !== '') {
          throw new Error('InvalidStateError: Response-type is ' + this._responseType);
        }

        return this._responseText;
      }
    },
    /**
     * Indicates whether or not cross-site `Access-Control` requests should be
     * made using credentials such as cookies, authorization headers, or TLS
     * client certificates.
     *
     * This flag doesn't do anything at the moment because there isn't much of
     * a use case for doing CORS-like requests in Node.js at the moment.
     *
     * @type {Boolean}
     * @default false
     */
    withCredentials: { value: false, writable: true }
  }
);

/**
 * Sets the ready state and emits the `readystatechange` event.
 *
 * @private
 * @param {Number} readyState - The new ready state.
 */
NodeHttpXHR.prototype._setReadyState = function (readyState) {
  this._readyState = readyState;
  this.dispatchEvent({
    type: 'readystatechange'
  });
};

/**
 * Aborts the request if it has already been sent.
 */
NodeHttpXHR.prototype.abort = function () {
  if (this.readyState === this.UNSENT || this.readyState === this.DONE) {
    return;
  }

  if (this._req) {
    this._req.abort();
  }
};

/**
 * Returns all the response headers, separated by CRLF, as a string.
 *
 * @returns {?String} The response headers, or `null` if no response yet.
 */
NodeHttpXHR.prototype.getAllResponseHeaders = function () {
  if (this.readyState < this.HEADERS_RECEIVED) {
    return null;
  }

  var headers = this._resp.headers;
  return Object.keys(headers).reduce(function (str, name) {
    return str.concat(name + ': ' + headers[name] + '\r\n');
  }, '');
};

/**
 * Returns the string containing the text of the specified header.
 *
 * @param {String} name - The header's name.
 * @returns {?String} The header's value, or `null` if no response yet or
 * the header does not exist in the response.
 */
NodeHttpXHR.prototype.getResponseHeader = function (name) {
  if (this.readyState < this.HEADERS_RECEIVED) {
    return null;
  }

  return this._resp.headers[name.toLowerCase()] || null;
};

/**
 * Initializes a request.
 *
 * @param {String} method - The HTTP method to use.
 * @param {String} reqUrl - The URL to send the request to.
 * @param {Boolean} [async=true] - Whether or not the request is asynchronous.
 */
NodeHttpXHR.prototype.open = function (method, reqUrl, async) {
  if (async === false) {
    throw new Error('Synchronous requests not implemented');
  }

  if (this._readyState > this.UNSENT) {
    this.abort();
    return;
  }

  var opts = this._reqOpts;
  opts.method = method;

  var urlObj = url.parse(reqUrl);
  ['protocol', 'hostname', 'port', 'path'].forEach(function (key) {
    if (key in urlObj) {
      opts[key] = urlObj[key];
    }
  });

  this._setReadyState(this.OPENED);
};

/**
 * Overrides the MIME type returned by the server.
 *
 * Must be called before `#send()`.
 *
 * @param {String} mimetype - The MIME type to use.
 */
NodeHttpXHR.prototype.overrideMimeType = function (mimetype) {
  if (this._req) {
    throw new Error('overrideMimeType() called after send()');
  }

  this._mimetype = mimetype;
};

/**
 * Sets the value of a request header.
 *
 * Must be called before `#send()`.
 *
 * @param {String} header - The header's name.
 * @param {String} value - The header's value.
 */
NodeHttpXHR.prototype.setRequestHeader = function (header, value) {
  if (this.readyState < this.OPENED) {
    throw new Error('setRequestHeader() called before open()');
  }

  if (this._req) {
    throw new Error('setRequestHeader() called after send()');
  }

  this._reqOpts.headers[header] = value;
};

/**
 * Sends the request.
 *
 * @param {*} [data] - The request body.
 */
NodeHttpXHR.prototype.send = function (data) {
  var onAbort = function onAbort() {
    this._setReadyState(this.DONE);

    this.dispatchEvent({
      type: 'abort'
    });
  }.bind(this);

  var opts = this._reqOpts;
  var req = makeRequest(opts, function onResponse(resp) {
    this._resp = resp;
    this._responseText = '';

    // var contentType = resp.headers['content-type'];
    // TODO: adjust responseType from content-type header if applicable

    // from Node API docs: The encoding argument is optional and only applies when chunk is a string. Defaults to 'utf8'.
    if (this._responseType === 'text' || this._responseType === '') {
      resp.setEncoding('utf8');
    }

    resp.on('data', function onData(chunk) {

      if (typeof chunk === 'string') {
        this._responseText += chunk;
      } else if (typeof chunk === 'object') {
        if (!(chunk instanceof Buffer)) {
          throw new Error('Assertion failed: Response-data should be of `Buffer` type');
        }
        if (this._response) {
          this._response = Buffer.concat([this._response, chunk]);
        } else {
          this._response = chunk;
        }
      }

      if (this.readyState !== this.LOADING) {
        this._setReadyState(this.LOADING);
      }

    }.bind(this));

    resp.on('end', function onEnd() {
      this._setReadyState(this.DONE);
      this.dispatchEvent({
        type: 'load'
      });
    }.bind(this));

    this._setReadyState(this.HEADERS_RECEIVED);
  }.bind(this));

  // Passing `opts.timeout` doesn't actually seem to set the timeout sometimes,
  // so it is set manually here.
  req.setTimeout(opts.timeout);

  req.on('abort', onAbort);
  req.on('aborted', onAbort);

  req.on('timeout', function onTimeout() {
    this._setReadyState(this.DONE);
    this.dispatchEvent({
      type: 'timeout'
    });
  }.bind(this));

  req.on('error', function onError(err) {
    if (this._listenerCount('error') < 1) {
      // Uncaught error; throw something more meaningful
      throw err;
    }

    // Dispatch an error event. The specification does not provide for any way
    // to communicate the failure reason with the event object.
    this.dispatchEvent({
      type: 'error'
    });

    this._setReadyState(this.DONE);
  }.bind(this));

  if (data) {
    req.write(data);
  }
  req.end();

  this._req = req;
};



/***/ }),

/***/ "./ext-mod/node-http-xhr/lib/node-event-target.js":
/*!********************************************************!*\
  !*** ./ext-mod/node-http-xhr/lib/node-event-target.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Node.js `EventTarget` implementation using Node's `EventEmitter`.
 *
 * @module node-event-target
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var EventEmitter = __webpack_require__(/*! events */ "events").EventEmitter;

/**
 * Creates a new `EventTarget`.
 *
 * @classdesc The interface implemented by objects that can receive events and
 * may have listeners for them.
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 * `EventTarget` on MDN
 * } for more details.
 *
 * @class
 */
module.exports = function () {
  EventEmitter.call(this);
};

/** @alias module:node-event-target */
var EventTarget = module.exports;

//
// Inherit some EventEmitter functions as private functions
//
['on', 'removeListener', 'emit', 'listeners'].forEach(function (key) {
  Object.defineProperty(EventTarget.prototype, '_' + key, {
    value: EventEmitter.prototype[key]
  });
});

Object.defineProperty(EventTarget.prototype, '_listenerCount', {
  value: 'listenerCount' in EventEmitter.prototype
  ? EventEmitter.prototype.listenerCount
  // Shim `EventEmitter#listenerCount` support
  : function (event) {
    return this._listeners(event).length;
  }
});

//
// Wrap the event listener methods so that the `EventEmitter` events are not
// exposed.
//

/**
 * Adds an event listener.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * `EventTarget.addEventListener` on MDN
 * }
 * @param {String} type - The event type.
 * @param {Function} listener - The callback.
 * @param {Object} [options] - Options for the listener.
 * @param {Boolean} [options.once=false] - Invoke listener once.
 */
EventTarget.prototype.addEventListener = function (type, listener, options) {
  // Re-implement `#once()` behavior
  // This is necessary because the built-in `#once()` calls functions that we've
  // renamed on the prototype.
  var fired = false;

  /** @this NodeHttpXHR */
  function onceListener() {
    this._removeListener(type, onceListener);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  this._on(type, options && options.once
    ? onceListener
    : listener
  );
};

/**
 * Removes an event listener.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
 * `EventTarget.removeEventListener` on MDN
 * }
 * @param {String} type - The event type.
 * @param {Function} listener - The callback.
 */
EventTarget.prototype.removeEventListener = function (type, listener) {
  this._removeListener(type, listener);
};

/**
 * Dispatches an event.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
 * `EventTarget.dispatchEvent` on MDN
 * }
 * @param {Object} event - The event to dispatch.
 */
EventTarget.prototype.dispatchEvent = function (event) {
  event.target = this;
  this._emit(event.type, event);
};



/***/ }),

/***/ "./ext-mod/node-http-xhr/lib/node-xhr-event-target.js":
/*!************************************************************!*\
  !*** ./ext-mod/node-http-xhr/lib/node-xhr-event-target.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Node.js `XMLHttpRequestEventTarget` implementation.
 *
 * @module node-xhr-event-target
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var EventTarget = __webpack_require__(/*! ./node-event-target */ "./ext-mod/node-http-xhr/lib/node-event-target.js");

var events = [
  /**
   * The {@link
   * module:node-http-xhr#readyState
   * `readyState`
   * } changed.
   *
   * @event module:node-xhr-event-target#readystatechange
   */
  'readystatechange',
  /**
   * The request was aborted.
   *
   * @event module:node-xhr-event-target#abort
   */
  'abort',
  /**
   * An error was encountered.
   *
   * @event module:node-xhr-event-target#error
   * @type {Error}
  */
  'error',
  /**
   * The request timed out.
   *
   * @event module:node-xhr-event-target#timeout
   */
  'timeout',
  /**
   * The response finished loading.
   *
   * @event module:node-xhr-event-target#load
   */
  'load'
];

/**
 * Creates a new `XMLHttpRequestEventTarget`.
 *
 * @classdesc The interface that describes the event handlers for an
 * `XMLHttpRequest`.
 *
 * NOTE: Currently, some features are lacking:
 * - Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget
 * `XMLHttpRequestEventTarget` on MDN
 * } for more details.
 *
 * @class
 * @extends module:node-event-target
 */
module.exports = function () {
  EventTarget.call(this);

  var props = {};

  // Add private event handler properties
  events.forEach(function (type) {
    props['_on' + type] = { value: null, writable: true };
  });

  Object.defineProperties(this, props);
};

/** @alias module:node-xhr-event-target */
var NodeXHREventTarget = module.exports;

var protoProps = {};

//
// Set up event handler properties
//
events.forEach(function (type) {
  var key = 'on' + type;
  protoProps[key] = {
    get: function getHandler() { return this['_' + key]; },
    set: function setHandler(handler) {
      if (typeof handler === 'function') {
        this.addEventListener(type, handler);
        this['_' + key] = handler;
      } else {
        var old = this['_' + key];
        if (old) {
          this.removeEventListener(type, old);
        }

        this['_' + key] = null;
      }
    }
  };
});

NodeXHREventTarget.prototype = Object.create(
  EventTarget.prototype, protoProps
);



/***/ }),

/***/ "./lib/core/bandwidth-estimator.ts":
/*!*****************************************!*\
  !*** ./lib/core/bandwidth-estimator.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var SMOOTHING_INTERVAL = 4 * 1000;
var MEASURE_INTERVAL = 60 * 1000;
var NumberWithTime = /** @class */ (function () {
    function NumberWithTime(value, timeStamp) {
        this.value = value;
        this.timeStamp = timeStamp;
    }
    return NumberWithTime;
}());
var BandwidthEstimator = /** @class */ (function () {
    function BandwidthEstimator() {
        this.lastBytes = [];
        this.currentBytesSum = 0;
        this.lastSpeed = [];
    }
    BandwidthEstimator.prototype.addBytes = function (bytes, timeStamp) {
        this.lastBytes.push(new NumberWithTime(bytes, timeStamp));
        this.currentBytesSum += bytes;
        while (timeStamp - this.lastBytes[0].timeStamp > SMOOTHING_INTERVAL) {
            this.currentBytesSum -= this.lastBytes.shift().value;
        }
        this.lastSpeed.push(new NumberWithTime(this.currentBytesSum / SMOOTHING_INTERVAL, timeStamp));
    };
    // in bytes per millisecond (SH: kbyte/s ..? :))
    BandwidthEstimator.prototype.getSpeed = function (timeStamp) {
        while (this.lastSpeed.length != 0 && timeStamp - this.lastSpeed[0].timeStamp > MEASURE_INTERVAL) {
            this.lastSpeed.shift();
        }
        var maxSpeed = 0;
        for (var _i = 0, _a = this.lastSpeed; _i < _a.length; _i++) {
            var speed = _a[_i];
            if (speed.value > maxSpeed) {
                maxSpeed = speed.value;
            }
        }
        return maxSpeed;
    };
    return BandwidthEstimator;
}());
exports.BandwidthEstimator = BandwidthEstimator;


/***/ }),

/***/ "./lib/core/bk-access-proxy.ts":
/*!*************************************!*\
  !*** ./lib/core/bk-access-proxy.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = __webpack_require__(/*! debug */ "debug");
var eventemitter3_1 = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
var http_download_queue_1 = __webpack_require__(/*! ./http-download-queue */ "./lib/core/http-download-queue.ts");
var peer_agent_1 = __webpack_require__(/*! ./peer-agent */ "./lib/core/peer-agent.ts");
var bandwidth_estimator_1 = __webpack_require__(/*! ./bandwidth-estimator */ "./lib/core/bandwidth-estimator.ts");
var peer_transport_1 = __webpack_require__(/*! ./peer-transport */ "./lib/core/peer-transport.ts");
var bk_resource_1 = __webpack_require__(/*! ./bk-resource */ "./lib/core/bk-resource.ts");
var perf_now_1 = __webpack_require__(/*! ./perf-now */ "./lib/core/perf-now.ts");
var getBrowserRtc = __webpack_require__(/*! get-browser-rtc */ "get-browser-rtc");
var rtcDefaultConfig = __webpack_require__(/*! simple-peer */ "simple-peer").config;
var trackerDefaultAnounce = [
    'wss://tracker.btorrent.xyz/',
    'wss://tracker.openwebtorrent.com/'
];
exports.defaultSettings = {
    webRtcMaxMessageSize: 64 * 1024 - 1,
    p2pSegmentDownloadTimeout: 60000,
    trackerAnnounce: trackerDefaultAnounce,
    rtcConfig: rtcDefaultConfig,
    //mediaPeerTransportFilterFactory: (transport) => transport
    mediaPeerTransportFilterFactory: function (transport) { return new peer_transport_1.DefaultPeerTransportFilter(transport); }
};
var BKAccessProxyEvents;
(function (BKAccessProxyEvents) {
    BKAccessProxyEvents["ResourceRequested"] = "resource:requested";
    BKAccessProxyEvents["ResourceEnqueuedHttp"] = "resource:enqueued:http";
    BKAccessProxyEvents["ResourceEnqueuedP2p"] = "resource:enqueued:p2p";
    /**
     * Emitted when segment has been downloaded.
     * Args: segment
     */
    BKAccessProxyEvents["ResourceFetched"] = "resource:fetched";
    /**
     * Emitted when an error occurred while loading the segment.
     * Args: segment, error
     */
    BKAccessProxyEvents["ResourceError"] = "resource:error";
    /**
     * Emitted for each segment that does not hit into a new segments queue when the load() method is called.
     * Args: segment
     */
    BKAccessProxyEvents["ResourceAbort"] = "resource:abort";
    /**
     * Emitted when a peer is connected.
     * Args: peer
     */
    BKAccessProxyEvents["PeerConnect"] = "peer:connect";
    /**
     * Emitted when a peer is disconnected.
     * Args: peerId
     */
    BKAccessProxyEvents["PeerClose"] = "peer:close";
    BKAccessProxyEvents["PeerRequestReceived"] = "peer:request";
    BKAccessProxyEvents["PeerResponseSent"] = "peer:response-sent";
})(BKAccessProxyEvents = exports.BKAccessProxyEvents || (exports.BKAccessProxyEvents = {}));
var BKAccessProxy = /** @class */ (function (_super) {
    __extends(BKAccessProxy, _super);
    function BKAccessProxy(settings) {
        if (settings === void 0) { settings = {}; }
        var _this = _super.call(this) || this;
        _this.debug = Debug('bk:core:access-proxy');
        _this._storedSegments = new Map();
        _this._bandwidthEstimator = new bandwidth_estimator_1.BandwidthEstimator();
        _this.settings = Object.assign(exports.defaultSettings, settings);
        _this.debug('loader settings', _this.settings);
        _this._httpDownloader = new http_download_queue_1.HttpDownloadQueue(_this.onResourceLoaded.bind(_this), _this.onResourceError.bind(_this));
        //this._httpDownloader.on('bytes-downloaded', (bytes: number) => this.onChunkBytesDownloaded('http', bytes));
        _this._peerAgent = new peer_agent_1.PeerAgent(_this._storedSegments, _this.settings);
        _this._peerAgent.on('resource-fetched', _this.onResourceLoaded.bind(_this));
        _this._peerAgent.on('resource-error', _this.onResourceError.bind(_this));
        _this._peerAgent.on('bytes-downloaded', function (bytes) { return _this.onChunkBytesDownloaded('p2p', bytes); });
        _this._peerAgent.on('bytes-uploaded', function (bytes) { return _this.onChunkBytesUploaded('p2p', bytes); });
        _this._peerAgent.on('peer-connected', _this.onPeerConnect.bind(_this));
        _this._peerAgent.on('peer-closed', _this.onPeerClose.bind(_this));
        _this._peerAgent.on('peer-data-updated', _this.onPeerDataUpdated.bind(_this));
        _this._peerAgent.on('peer-request-received', _this.onPeerRequestReceived.bind(_this));
        _this._peerAgent.on('peer-response-sent', _this.onPeerResponseSent.bind(_this));
        return _this;
    }
    BKAccessProxy.isSupported = function () {
        var browserRtc = getBrowserRtc();
        return (browserRtc && (browserRtc.RTCPeerConnection.prototype.createDataChannel !== undefined));
    };
    BKAccessProxy.prototype.enqueue = function (resource) {
        this.debug('enqueueing:', resource.getUrl());
        this.emit(BKAccessProxyEvents.ResourceRequested, resource);
        // update Swarm ID
        this._peerAgent.setSwarmId(resource.swarmId);
        if (this._peerAgent.enqueue(resource)) {
            this.debug('enqueued to p2p downloader');
            this.emit(BKAccessProxyEvents.ResourceEnqueuedP2p, resource);
        }
        else {
            this.debug('falling back to http downloader');
            this._httpDownloader.enqueue(resource);
            this.emit(BKAccessProxyEvents.ResourceEnqueuedHttp, resource);
        }
    };
    BKAccessProxy.prototype.abort = function (resource) {
        this._httpDownloader.abort(resource);
    };
    BKAccessProxy.prototype.setSwarmId = function (swarmId) {
        this._peerAgent.setSwarmId(swarmId);
    };
    BKAccessProxy.prototype.getSwarmId = function () {
        return this._peerAgent.getSwarmId();
    };
    BKAccessProxy.prototype.getPeerId = function () {
        return this._peerAgent.getPeerId();
    };
    BKAccessProxy.prototype.getWRTCConfig = function () {
        return this.settings.rtcConfig;
    };
    BKAccessProxy.prototype.getPeerConnections = function () {
        return this._peerAgent.getPeerConnections();
    };
    BKAccessProxy.prototype.terminate = function () {
        this._httpDownloader.destroy();
        this._peerAgent.destroy();
        this._storedSegments.clear();
    };
    BKAccessProxy.prototype._createSegmentsMap = function () {
        var segmentsMap = [];
        this._storedSegments.forEach(function (res) { return segmentsMap.push([res.id, bk_resource_1.BKResourceStatus.Loaded]); });
        this._httpDownloader.getQueuedList().forEach(function (res) { return segmentsMap.push([res.id, bk_resource_1.BKResourceStatus.LoadingViaHttp]); });
        return segmentsMap;
    };
    // Event handlers
    BKAccessProxy.prototype.onChunkBytesDownloaded = function (method, bytes) {
        this._bandwidthEstimator.addBytes(bytes, perf_now_1.getPerfNow());
    };
    BKAccessProxy.prototype.onChunkBytesUploaded = function (method, bytes) {
        this._bandwidthEstimator.addBytes(bytes, perf_now_1.getPerfNow());
    };
    BKAccessProxy.prototype.onResourceLoaded = function (segment) {
        this.debug('resource loaded', segment.id, segment.data);
        if (!segment.data || segment.data.byteLength === 0) {
            throw new Error('No data in resource loaded');
        }
        this._storedSegments.set(segment.id, segment);
        segment.lastAccessedAt = perf_now_1.getPerfNow();
        this.emit(BKAccessProxyEvents.ResourceFetched, segment);
        this._peerAgent.sendSegmentsMapToAll(this._createSegmentsMap());
    };
    BKAccessProxy.prototype.onResourceError = function (segment, event) {
        this.emit(BKAccessProxyEvents.ResourceError, segment, event);
    };
    BKAccessProxy.prototype.onPeerConnect = function (peer) {
        this._peerAgent.sendSegmentsMap(peer.id, this._createSegmentsMap());
        this.emit(BKAccessProxyEvents.PeerConnect, peer);
    };
    BKAccessProxy.prototype.onPeerClose = function (peerId) {
        this.emit(BKAccessProxyEvents.PeerClose, peerId);
    };
    BKAccessProxy.prototype.onPeerDataUpdated = function () {
        this.debug('peer data updated');
    };
    BKAccessProxy.prototype.onPeerRequestReceived = function (resource, peer) {
        if (resource) {
            this.debug('peer request received resource', resource.id);
        }
        else {
            this.debug('peer request received for absent resource');
        }
        this.emit(BKAccessProxyEvents.PeerRequestReceived, resource, peer);
    };
    BKAccessProxy.prototype.onPeerResponseSent = function (resource, peer) {
        if (resource) {
            this.debug('peer response sent for resource id:', resource.id);
        }
        else {
            this.debug('peer response sent with absent resource');
        }
        this.emit(BKAccessProxyEvents.PeerResponseSent, resource, peer);
    };
    return BKAccessProxy;
}(eventemitter3_1.EventEmitter));
exports.BKAccessProxy = BKAccessProxy;


/***/ }),

/***/ "./lib/core/bk-resource-request.ts":
/*!*****************************************!*\
  !*** ./lib/core/bk-resource-request.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Debug = __webpack_require__(/*! debug */ "debug");
var xhr_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/xhr */ "./ext-mod/emliri-es-libs/rialto/lib/xhr.ts");
var perf_now_1 = __webpack_require__(/*! ../core/perf-now */ "./lib/core/perf-now.ts");
var core_1 = __webpack_require__(/*! ../core */ "./lib/core/index.ts");
var debug = Debug('bk:engine:universal:resource-request');
var BKResourceRequest = /** @class */ (function () {
    function BKResourceRequest(proxy, swarmId, url, options) {
        if (options === void 0) { options = {}; }
        this.proxy = proxy;
        this.swarmId = swarmId;
        this.url = url;
        this.options = options;
        this.xhrState = xhr_1.XHRState.UNSENT;
        this.responseData = null;
        this.responseHeaders = {};
        this.loadedBytes = 0;
        this.totalBytes = NaN;
        this.hasBeenAborted = false;
        this.hasErrored = false;
        this.error = null;
        this.secondsUntilLoading = NaN;
        this.secondsUntilDone = NaN;
        this.secondsUntilHeaders = NaN;
        this._wasSuccessful = false;
        this._requestCreated = null;
        debug("new p2p media downloader request for " + url);
        this.proxy.on(core_1.BKProxyEvents.ResourceFetched, this.onResourceLoaded.bind(this));
        this.proxy.on(core_1.BKProxyEvents.ResourceError, this.onResourceError.bind(this));
        this.proxy.on(core_1.BKProxyEvents.ResourceAbort, this.onResourceAbort.bind(this));
        debug("creating new p2p resource: " + url + " with swarm-ID \"" + swarmId + "\"");
        var res = this._resource = new core_1.BKResource(url, this.options.byteRange);
        res.swarmId = this.swarmId;
        this.proxy.enqueue(res);
        this._resourceRequestCallback = this.options.requestCallback;
        this._requestCreated = perf_now_1.getPerfNow();
        this.responseType = xhr_1.XHRResponseType.ARRAY_BUFFER;
    }
    BKResourceRequest.prototype.abort = function () {
        this.hasBeenAborted = true;
    };
    BKResourceRequest.prototype.wasSuccessful = function () {
        return this._wasSuccessful;
    };
    BKResourceRequest.prototype.getResource = function () {
        return this._resource;
    };
    BKResourceRequest.prototype._invokeRequestCallback = function () {
        if (this._resourceRequestCallback) {
            debug('invoke resource request callback');
            this._resourceRequestCallback(this, false);
        }
    };
    BKResourceRequest.prototype.onResourceLoaded = function (res) {
        if (res.id !== this._resource.id) {
            return;
        }
        if (this.hasBeenAborted) {
            return;
        }
        this._wasSuccessful = true;
        this.xhrState = xhr_1.XHRState.DONE;
        this.secondsUntilHeaders = 0;
        this.secondsUntilDone = (perf_now_1.getPerfNow() - this._requestCreated) / 1000;
        this.secondsUntilLoading = this.secondsUntilDone;
        this.loadedBytes = res.data.byteLength;
        this.totalBytes = res.data.byteLength;
        this.responseData = res.data;
        debug("segment loaded: " + this.url, res.getUrl());
        this._invokeRequestCallback();
    };
    BKResourceRequest.prototype.onResourceError = function (segment, err) {
        if (segment.id !== this._resource.id) {
            return;
        }
        if (this.hasBeenAborted) {
            return;
        }
        debug("segment error: " + this.url);
    };
    BKResourceRequest.prototype.onResourceAbort = function (segment) {
        if (segment.id !== this._resource.id) {
            return;
        }
        if (this.hasBeenAborted) {
            return;
        }
        debug("segment aborted: " + this.url);
        this.hasBeenAborted = true;
    };
    return BKResourceRequest;
}());
exports.BKResourceRequest = BKResourceRequest;


/***/ }),

/***/ "./lib/core/bk-resource-tx-monitor.ts":
/*!********************************************!*\
  !*** ./lib/core/bk-resource-tx-monitor.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/resource */ "./ext-mod/emliri-es-libs/rialto/lib/resource.ts");
var bk_access_proxy_1 = __webpack_require__(/*! ../core/bk-access-proxy */ "./lib/core/bk-access-proxy.ts");
var html = __webpack_require__(/*! html-tag */ "html-tag");
var domify = __webpack_require__(/*! domify */ "domify");
var BKResourceTransferView = /** @class */ (function () {
    function BKResourceTransferView(_resource) {
        this._resource = _resource;
        this.isUpload = false;
        this.isP2P = false;
    }
    BKResourceTransferView.prototype.getTxBytes = function () {
        return this._resource.requestedBytesLoaded;
    };
    return BKResourceTransferView;
}());
var BKResourceUploadView = /** @class */ (function (_super) {
    __extends(BKResourceUploadView, _super);
    function BKResourceUploadView(_resource, _peer, _monitor) {
        var _this = _super.call(this, _resource) || this;
        _this._peer = _peer;
        _this._monitor = _monitor;
        _this.isUpload = true;
        _this.isP2P = true;
        return _this;
    }
    BKResourceUploadView.prototype.getHTML = function () {
        var loaded = this._resource.requestedBytesLoaded;
        var total = this._resource.requestedBytesTotal;
        var txKbps = (8 * this._resource.requestedBytesLoaded
            / this._resource.fetchLatency) / 1000;
        //console.log('fetch-latency', this._resource.fetchLatency);
        return "<div class=\"resource-ul\">Direction: UPLOAD<br><span><label>URL:</label> " + this._resource.getUrl() + "</span><br>\n            | <span><label>Peer</label>: " + this._peer.id + " / " + this._peer.remoteAddress + "</span>\n            | <span>" + (true ? 'P2P' : undefined) + "</span>\n            | <span><label>Transferred (bytes):</label> " + loaded + " / " + total + "</span></div>";
    };
    return BKResourceUploadView;
}(BKResourceTransferView));
var BKResourceDownloadView = /** @class */ (function (_super) {
    __extends(BKResourceDownloadView, _super);
    function BKResourceDownloadView(resource, _isP2p, _monitor) {
        var _this = _super.call(this, resource) || this;
        _this._isP2p = _isP2p;
        _this._monitor = _monitor;
        _this.isUpload = false;
        _this.isP2P = false;
        _this.isP2P = _isP2p;
        _this._resource.on(resource_1.ResourceEvents.FETCH_PROGRESS, function () {
            _this._onFetchProgress();
        });
        _this._resource.on(resource_1.ResourceEvents.FETCH_SUCCEEDED, function () {
            _this._onFetchSucceeded();
        });
        _this._resource.on(resource_1.ResourceEvents.BUFFER_SET, function () {
            _this._onFetchSucceeded();
        });
        _this._resource.on(resource_1.ResourceEvents.FETCH_ABORTED, function () {
            _this._onFetchAborted();
        });
        _this._resource.on(resource_1.ResourceEvents.FETCH_ERRORED, function () {
            _this._onFetchErrored();
        });
        return _this;
    }
    BKResourceDownloadView.prototype.getHTML = function () {
        var loaded = this._resource.requestedBytesLoaded;
        var total = this._resource.requestedBytesTotal;
        var txKbps = (8 * this._resource.requestedBytesLoaded
            / this._resource.fetchLatency) / 1000;
        //console.log('fetch-latency', this._resource.fetchLatency);
        return "<div class=\"resource-dl\">\n                Direction: DOWNLOAD<br>\n                <span><label>URL:</label> " + this._resource.getUrl() + "</span><br>\n                | <span>" + (this._isP2p ? 'P2P' : 'HTTP') + "</span>\n                | <span><label>Transferred (bytes):</label> " + loaded + " / " + total + "</span>\n                | <span><label>Bitrate (kbits/sec): </label> " + txKbps.toFixed(1) + "</span></div>";
    };
    BKResourceDownloadView.prototype._onFetchProgress = function () {
        this._monitor.update();
    };
    BKResourceDownloadView.prototype._onFetchSucceeded = function () {
        this._monitor.update();
    };
    BKResourceDownloadView.prototype._onFetchErrored = function () { };
    BKResourceDownloadView.prototype._onFetchAborted = function () { };
    return BKResourceDownloadView;
}(BKResourceTransferView));
var BKResourceTransferMonitorDomView = /** @class */ (function () {
    function BKResourceTransferMonitorDomView(_proxy, domRootId) {
        var _this = this;
        this._proxy = _proxy;
        this._resourceTransfers = [];
        this._proxy.on(bk_access_proxy_1.BKAccessProxyEvents.ResourceEnqueuedHttp, function (res) {
            _this.addResourceDownload(res, false);
        });
        this._proxy.on(bk_access_proxy_1.BKAccessProxyEvents.ResourceEnqueuedP2p, function (res) {
            _this.addResourceDownload(res, true);
        });
        this._proxy.on(bk_access_proxy_1.BKAccessProxyEvents.PeerResponseSent, function (res, peer) {
            _this.addResourceUpload(res, peer);
        });
        this._domRootEl = document.getElementById(domRootId);
        if (!this._domRootEl) {
            throw new Error("No root element found with id \"" + domRootId + "\"");
        }
    }
    BKResourceTransferMonitorDomView.prototype.addResourceDownload = function (res, isP2p) {
        this._resourceTransfers.push(new BKResourceDownloadView(res, isP2p, this));
        this.update();
    };
    BKResourceTransferMonitorDomView.prototype.addResourceUpload = function (res, peer) {
        this._resourceTransfers.push(new BKResourceUploadView(res, peer, this));
        this.update();
    };
    BKResourceTransferMonitorDomView.prototype.getOverallStats = function () {
        var cdnDownloadedBytes = 0;
        var peerDownloadedBytes = 0;
        var peerUploadedBytes = 0;
        var p2pDownloadRatio = 0;
        var p2pUploadRatio = 0;
        this._resourceTransfers.forEach(function (resourceTx) {
            if (resourceTx.isUpload) {
                peerUploadedBytes += resourceTx.getTxBytes();
            }
            else {
                if (resourceTx.isP2P) {
                    peerDownloadedBytes += resourceTx.getTxBytes();
                }
                else {
                    cdnDownloadedBytes += resourceTx.getTxBytes();
                }
            }
        });
        p2pDownloadRatio = Math.round(100 * peerDownloadedBytes / (cdnDownloadedBytes + peerDownloadedBytes)) / 100;
        p2pUploadRatio = Math.round(100 * peerUploadedBytes / (cdnDownloadedBytes + peerDownloadedBytes)) / 100;
        return {
            p2pDownloadRatio: p2pDownloadRatio,
            p2pUploadRatio: p2pUploadRatio,
            cdnDownloadedBytes: cdnDownloadedBytes,
            peerDownloadedBytes: peerDownloadedBytes,
            peerUploadedBytes: peerUploadedBytes
        };
    };
    BKResourceTransferMonitorDomView.prototype.update = function () {
        // use JSX / React
        var stats = this.getOverallStats();
        var html = '';
        html += "<div>\n            <label>Overall stats:</label><p><pre>" + JSON.stringify(stats, null, 2) + "</pre></p>\n        </div>";
        html += '<div>';
        this._resourceTransfers.forEach(function (resourceTransfer) {
            html += "<div class=\"resource-tx\"><i>RESOURCE TX STATS</i><p>" + resourceTransfer.getHTML() + "</p></div>";
            html += '<hr />';
        });
        html += '</div>';
        this._domRootEl.innerHTML = '';
        this._domRootEl.appendChild(domify(html));
    };
    return BKResourceTransferMonitorDomView;
}());
exports.BKResourceTransferMonitorDomView = BKResourceTransferMonitorDomView;


/***/ }),

/***/ "./lib/core/bk-resource.ts":
/*!*********************************!*\
  !*** ./lib/core/bk-resource.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/resource */ "./ext-mod/emliri-es-libs/rialto/lib/resource.ts");
// https://github.com/Microsoft/TypeScript/issues/10853#issuecomment-246175061
var BKResourceMap = /** @class */ (function (_super) {
    __extends(BKResourceMap, _super);
    function BKResourceMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BKResourceMap.create = function (array) {
        var inst = new Map(array);
        inst['__proto__'] = BKResourceMap.prototype;
        return inst;
    };
    return BKResourceMap;
}(Map));
exports.BKResourceMap = BKResourceMap;
var BKResourceStatus;
(function (BKResourceStatus) {
    BKResourceStatus["Void"] = "void";
    BKResourceStatus["Loaded"] = "loaded";
    BKResourceStatus["LoadingViaP2p"] = "loading_via_p2p";
    BKResourceStatus["LoadingViaHttp"] = "loading_via_http";
})(BKResourceStatus = exports.BKResourceStatus || (exports.BKResourceStatus = {}));
var BKResource = /** @class */ (function (_super) {
    __extends(BKResource, _super);
    function BKResource() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastAccessedAt = 0;
        _this.status = BKResourceStatus.Void;
        return _this;
    }
    Object.defineProperty(BKResource.prototype, "id", {
        get: function () { return this.uri; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BKResource.prototype, "data", {
        get: function () { return this.buffer; },
        enumerable: true,
        configurable: true
    });
    return BKResource;
}(resource_1.Resource));
exports.BKResource = BKResource;


/***/ }),

/***/ "./lib/core/bk-swarm-id.ts":
/*!*********************************!*\
  !*** ./lib/core/bk-swarm-id.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __webpack_require__(/*! crypto */ "crypto");
var Debug = __webpack_require__(/*! debug */ "debug");
var SWARM_URN_PREFIX = 'urn:livepeer:beekeeper:bittorrent:swarm-id';
var debug = Debug('bk:swarm-id');
var swarmIdCache = {};
function getSwarmIdForVariantPlaylist(manifestUrl) {
    if (swarmIdCache[manifestUrl]) {
        //debug(`swarm-ID cache hit: ${swarmIdCache[manifestUrl]}`);
        return swarmIdCache[manifestUrl];
    }
    debug("creating swarm ID for manifest URL: " + manifestUrl);
    var swarmId = SWARM_URN_PREFIX + ':' + crypto_1.createHash('sha1').update(manifestUrl).digest('hex');
    debug("created swarm ID: " + swarmId);
    swarmIdCache[manifestUrl] = swarmId;
    return swarmId;
}
exports.getSwarmIdForVariantPlaylist = getSwarmIdForVariantPlaylist;


/***/ }),

/***/ "./lib/core/detect-safari-11.ts":
/*!**************************************!*\
  !*** ./lib/core/detect-safari-11.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isSafari11_0 = false;
var hasRun = false;
function detectSafari11_0() {
    if (!hasRun) {
        var userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
        var isSafari = userAgent.indexOf('Safari') != -1 && userAgent.indexOf('Chrome') == -1;
        if (isSafari) {
            var match = userAgent.match(/version\/(\d+(\.\d+)?)/i);
            var version = (match && match.length > 1 && match[1]) || '';
            if (version === '11.0') {
                isSafari11_0 = true;
            }
        }
    }
    return isSafari11_0;
}
exports.detectSafari11_0 = detectSafari11_0;


/***/ }),

/***/ "./lib/core/http-download-queue.ts":
/*!*****************************************!*\
  !*** ./lib/core/http-download-queue.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = __webpack_require__(/*! debug */ "debug");
var queue_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/queue */ "./ext-mod/emliri-es-libs/rialto/lib/queue.ts");
var resource_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/resource */ "./ext-mod/emliri-es-libs/rialto/lib/resource.ts");
var debug = Debug('bk:core:http-download-queue');
var HttpDownloadQueue = /** @class */ (function () {
    function HttpDownloadQueue(_onLoaded, _onError) {
        this._onLoaded = _onLoaded;
        this._onError = _onError;
        this._queue = new queue_1.Queue();
        this._fetching = false;
    }
    HttpDownloadQueue.prototype.enqueue = function (res) {
        debug('enqueue', res.getUrl());
        if (this._queue.containsAtLeastOnce(res)) {
            throw new Error('Already enqueued resource object: ' + res.getUrl());
        }
        this._queue.forEach(function (resource) {
            if (res.uri === resource.uri) { // FIXME: check byterange
                throw new Error('Found a resource in download queue with same URI');
            }
        });
        this._queue.enqueue(res);
        if (!this._fetching) {
            this._fetchNext();
        }
        res.on(resource_1.ResourceEvents.FETCH_PROGRESS, function () {
            // TODO
        });
    };
    HttpDownloadQueue.prototype.abort = function (resource) {
        this._queue.forEach(function (res) {
            if (res.uri === resource.uri) {
                res.abort();
            }
        });
    };
    HttpDownloadQueue.prototype.destroy = function () {
        // abort all
        this._queue.forEach(function (res) {
            res.abort();
        });
        this._queue = null;
    };
    HttpDownloadQueue.prototype.getQueuedList = function () {
        return this._queue.getArray();
    };
    HttpDownloadQueue.prototype._fetchNext = function () {
        var _this = this;
        var nextResource = this._queue.pop();
        if (!nextResource) {
            this._fetching = false;
            return;
        }
        this._fetching = true;
        nextResource.fetch().then(function (res) {
            console.log('segment-loaded');
            //debug('segment-loaded');
            _this._onLoaded(res);
            _this._fetchNext();
        }).catch(function (err) {
            _this._onError(nextResource, err);
        });
    };
    return HttpDownloadQueue;
}());
exports.HttpDownloadQueue = HttpDownloadQueue;


/***/ }),

/***/ "./lib/core/index.ts":
/*!***************************!*\
  !*** ./lib/core/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLHttpRequest = __webpack_require__(/*! ../../ext-mod/node-http-xhr/lib */ "./ext-mod/node-http-xhr/lib/index.js");
if (global) {
    global.XMLHttpRequest = exports.XMLHttpRequest;
}
var bk_access_proxy_1 = __webpack_require__(/*! ./bk-access-proxy */ "./lib/core/bk-access-proxy.ts");
exports.BKAccessProxy = bk_access_proxy_1.BKAccessProxy;
exports.BKAccessProxyEvents = bk_access_proxy_1.BKAccessProxyEvents;
exports.BKProxyEvents = bk_access_proxy_1.BKAccessProxyEvents;
var bk_resource_1 = __webpack_require__(/*! ./bk-resource */ "./lib/core/bk-resource.ts");
exports.BKResource = bk_resource_1.BKResource;
exports.version = !global ? "0.0.0" : '';


/***/ }),

/***/ "./lib/core/network-channel-emulator.ts":
/*!**********************************************!*\
  !*** ./lib/core/network-channel-emulator.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_WINDOW_TIME_MS = 40;
var NetworkChannelEmulatorDataItem = /** @class */ (function () {
    function NetworkChannelEmulatorDataItem(data, createdAt) {
        this.data = data;
        this.createdAt = createdAt;
    }
    Object.defineProperty(NetworkChannelEmulatorDataItem.prototype, "byteLength", {
        get: function () {
            if (typeof this.data === 'string') {
                return this.data.length;
            }
            return this.data.byteLength;
        },
        enumerable: true,
        configurable: true
    });
    return NetworkChannelEmulatorDataItem;
}());
exports.NetworkChannelEmulatorDataItem = NetworkChannelEmulatorDataItem;
var NetworkChannelEmulator = /** @class */ (function () {
    function NetworkChannelEmulator(_onData) {
        this._onData = _onData;
        this._latencyMs = 0;
        this._maxBandwidthBps = Infinity;
        this._queue = [];
        this._windowTimeMs = exports.MIN_WINDOW_TIME_MS;
        this._pollInterval = null;
        this._isFrozen = true;
        this._lastPolledAt = NaN;
        this._outputRate = NaN;
        this.setFrozen(false);
    }
    NetworkChannelEmulator.prototype.setFrozen = function (frozen, immediateRun) {
        if (immediateRun === void 0) { immediateRun = true; }
        if (frozen === this._isFrozen) {
            return;
        }
        this._isFrozen = frozen;
        if (this._isFrozen) {
            window.clearInterval(this._pollInterval);
            this._pollInterval = null;
            this._lastPolledAt = NaN;
        }
        else {
            this._pollInterval
                = window.setInterval(this._onPoll.bind(this), this._windowTimeMs);
            if (immediateRun) {
                window.setTimeout(this._onPoll.bind(this), 0);
            }
        }
    };
    NetworkChannelEmulator.prototype.push = function (data, unfreeze) {
        if (unfreeze === void 0) { unfreeze = true; }
        var now = window.performance.now();
        this._queue.push(new NetworkChannelEmulatorDataItem(data, now));
        if (unfreeze) {
            this.setFrozen(false);
        }
        if (this._queue.length - 1 === 0) {
            this._onPoll();
        }
    };
    NetworkChannelEmulator.prototype.flush = function (drop) {
        if (drop === void 0) { drop = false; }
        while (this._queue.length > 0) {
            var item = this._queue.shift();
            if (drop) {
                return;
            }
            this._onData(item.data);
        }
    };
    Object.defineProperty(NetworkChannelEmulator.prototype, "windowTimeMs", {
        get: function () { return this._windowTimeMs; },
        set: function (timeMs) { this._windowTimeMs = timeMs; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkChannelEmulator.prototype, "maxBandwidthBps", {
        get: function () { return this._maxBandwidthBps; },
        set: function (bwKbps) { this._maxBandwidthBps = bwKbps; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkChannelEmulator.prototype, "latencyMs", {
        get: function () { return this._latencyMs; },
        set: function (latencyMs) { this._latencyMs = latencyMs; },
        enumerable: true,
        configurable: true
    });
    NetworkChannelEmulator.prototype._getQueuedBandwidth = function () {
        if (!this._queue.length) {
            return 0;
        }
        var now = window.performance.now();
        var timeDiffMs = now - this._queue[0].createdAt;
        var bytesTotal = this._queue.reduce(function (previousValue, currentValue) {
            previousValue += currentValue.byteLength;
            return previousValue;
        }, 0);
        return 8 * bytesTotal / (timeDiffMs / 1000);
    };
    NetworkChannelEmulator.prototype._onPoll = function () {
        //console.log('_onPoll');
        var queueBw = this._getQueuedBandwidth();
        var now = window.performance.now();
        var queue = this._queue;
        var latencyMs = this._latencyMs;
        var maxBandwidthBps = this._maxBandwidthBps;
        var windowTimeEffectiveMs = this._windowTimeMs;
        this._lastPolledAt = now;
        var maxBytesInWindow = (this._maxBandwidthBps / 8) * (windowTimeEffectiveMs / 1000);
        /*
        console.log('window ms:', windowTimeEffectiveMs);
        console.log('max bytes in window:', maxBytesInWindow);
        console.log('queue bw:', queueBw);
        */
        var pushedBytes = 0;
        function shouldPushNext() {
            if (!queue.length) {
                return false;
            }
            return (maxBytesInWindow >= pushedBytes + queue[0].byteLength
                && latencyMs <= now - queue[0].createdAt)
                || queueBw <= maxBandwidthBps;
        }
        while (shouldPushNext()) {
            var item = this._queue.shift();
            pushedBytes += item.byteLength;
            // dispatch this so we don't block
            //setTimeout(() => this._onData(item.data), 0);
            this._onData(item.data);
        }
        if (queue.length === 0) {
            this.setFrozen(true);
        }
        this._outputRate = pushedBytes / (windowTimeEffectiveMs / 1000);
        //console.log('output rate:', this._outputRate);
    };
    return NetworkChannelEmulator;
}());
exports.NetworkChannelEmulator = NetworkChannelEmulator;


/***/ }),

/***/ "./lib/core/peer-agent.ts":
/*!********************************!*\
  !*** ./lib/core/peer-agent.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../decl/bittorrent.d.ts" />
var uuidv4 = __webpack_require__(/*! uuid/v4 */ "uuid/v4");
var Debug = __webpack_require__(/*! debug */ "debug");
var bittorrent_tracker_1 = __webpack_require__(/*! bittorrent-tracker */ "bittorrent-tracker");
var crypto_1 = __webpack_require__(/*! crypto */ "crypto");
var stringly_typed_event_emitter_1 = __webpack_require__(/*! ./stringly-typed-event-emitter */ "./lib/core/stringly-typed-event-emitter.ts");
var peer_1 = __webpack_require__(/*! ./peer */ "./lib/core/peer.ts");
var bk_resource_1 = __webpack_require__(/*! ./bk-resource */ "./lib/core/bk-resource.ts");
var perf_now_1 = __webpack_require__(/*! ./perf-now */ "./lib/core/perf-now.ts");
var PEER_PROTOCOL_VERSION = 1;
// implement actual IResourceRequest
var PeerResourceTransfer = /** @class */ (function () {
    function PeerResourceTransfer(peerId, resource) {
        this.peerId = peerId;
        this.resource = resource;
        this.createdAt = perf_now_1.getPerfNow();
    }
    return PeerResourceTransfer;
}());
var PeerAgent = /** @class */ (function (_super) {
    __extends(PeerAgent, _super);
    function PeerAgent(cachedSegments, settings) {
        var _this = _super.call(this) || this;
        _this.cachedSegments = cachedSegments;
        _this.settings = settings;
        _this._trackerClient = null;
        _this._peers = new Map();
        _this._peerCandidates = new Map();
        _this._peerResourceTransfers = new Map();
        _this._swarmId = null;
        _this.debug = Debug('bk:core:peer-agent');
        _this._onBytesDownloaded = function (bytes) {
            _this.emit('bytes-downloaded', bytes);
        };
        _this._onBytesUploaded = function (bytes) {
            _this.emit('bytes-uploaded', bytes);
        };
        _this._onPeerConnect = function (peer) {
            var connectedPeer = _this._peers.get(peer.id);
            if (connectedPeer) {
                _this.debug('tracker peer already connected (in peer connect)', peer.id, peer);
                peer.destroy();
                return;
            }
            // First peer with the ID connected
            _this._peers.set(peer.id, peer);
            // Destroy all other peer candidates
            var peerCandidatesById = _this._peerCandidates.get(peer.id);
            if (peerCandidatesById) {
                for (var _i = 0, peerCandidatesById_1 = peerCandidatesById; _i < peerCandidatesById_1.length; _i++) {
                    var peerCandidate = peerCandidatesById_1[_i];
                    if (peerCandidate != peer) {
                        peerCandidate.destroy();
                    }
                }
                _this._peerCandidates.delete(peer.id);
            }
            _this.emit('peer-connected', { id: peer.id, remoteAddress: peer.remoteAddress });
        };
        _this._onPeerClose = function (peer) {
            if (_this._peers.get(peer.id) != peer) {
                // Try to delete the peer candidate
                var peerCandidatesById = _this._peerCandidates.get(peer.id);
                if (!peerCandidatesById) {
                    return;
                }
                var index = peerCandidatesById.indexOf(peer);
                if (index != -1) {
                    peerCandidatesById.splice(index, 1);
                }
                if (peerCandidatesById.length == 0) {
                    _this._peerCandidates.delete(peer.id);
                }
                return;
            }
            _this._peerResourceTransfers.forEach(function (value, key) {
                if (value.peerId == peer.id) {
                    _this._peerResourceTransfers.delete(key);
                }
            });
            _this._peers.delete(peer.id);
            _this.emit('peer-data-updated');
            _this.emit('peer-closed', peer.id);
        };
        _this._onPeerDataUpdated = function () {
            _this.emit('peer-data-updated');
        };
        _this._onResourceRequest = function (peer, resourceId) {
            var resource = _this.cachedSegments.get(resourceId);
            _this.emit('peer-request-received', resource, peer);
            if (resource) {
                // assert: that the resource objects are consistent
                if (!resource.data || resource.data.byteLength === 0) {
                    throw new Error('No data in segment: ' + resource.id);
                }
                peer.sendSegmentData(resourceId, resource.data);
            }
            else {
                _this.debug('request received for absent resource with id:', resourceId);
                peer.sendSegmentAbsent(resourceId);
            }
            _this.emit('peer-response-sent', resource, peer);
        };
        _this._onResourceFetched = function (peer, segmentId, data) {
            _this.debug("resource \"" + segmentId + "\" loaded from peer (id=" + peer.id + ")");
            var peerResourceRequest = _this._peerResourceTransfers.get(segmentId);
            if (peerResourceRequest) {
                _this._peerResourceTransfers.delete(segmentId);
                var res = peerResourceRequest.resource;
                var responseLatencySeconds = (perf_now_1.getPerfNow() - peerResourceRequest.createdAt) / 1000;
                res.setExternalyFetchedBytes(data.byteLength, data.byteLength, responseLatencySeconds);
                res.setBuffer(data);
                _this.emit('resource-fetched', peerResourceRequest.resource, data);
            }
        };
        _this._onResourceAbsent = function (peer, segmentId) {
            _this._peerResourceTransfers.delete(segmentId);
            _this.emit('peer-data-updated');
        };
        _this._onResourceError = function (peer, segmentId, description) {
            var peerResourceRequest = _this._peerResourceTransfers.get(segmentId);
            if (peerResourceRequest) {
                _this._peerResourceTransfers.delete(segmentId);
                _this.emit('resource-error', peerResourceRequest.resource, description);
            }
        };
        _this._onResourceTimeout = function (peer, segmentId) {
            var peerResourceRequest = _this._peerResourceTransfers.get(segmentId);
            if (peerResourceRequest) {
                _this._peerResourceTransfers.delete(segmentId);
                peer.destroy();
                if (_this._peers.delete(peerResourceRequest.peerId)) {
                    _this.emit('peer-data-updated');
                }
            }
        };
        //const peerIdSource = (Date.now() + Math.random()).toFixed(12);
        // FIXED: using a real UUID is better at scale :)
        var peerIdSource = uuidv4(); // see https://www.npmjs.com/package/uuid
        _this._peerId = crypto_1.createHash('sha1').update(peerIdSource).digest('hex');
        _this.debug('peer ID', _this._peerId);
        return _this;
    }
    PeerAgent.prototype.destroy = function () {
        this._swarmId = null;
        if (this._trackerClient) {
            this._trackerClient.stop();
            this._trackerClient.destroy();
            this._trackerClient = null;
        }
        this._peers.forEach(function (peer) { return peer.destroy(); });
        this._peers.clear();
        this._peerResourceTransfers.clear();
        this._peerCandidates.forEach(function (peerCandidateById) {
            for (var _i = 0, peerCandidateById_1 = peerCandidateById; _i < peerCandidateById_1.length; _i++) {
                var peerCandidate = peerCandidateById_1[_i];
                peerCandidate.destroy();
            }
        });
        this._peerCandidates.clear();
    };
    PeerAgent.prototype.enqueue = function (resource) {
        if (this.isDownloading(resource)) {
            console.warn();
            return false;
        }
        var entries = this._peers.values();
        for (var entry = entries.next(); !entry.done; entry = entries.next()) {
            var peer = entry.value;
            if ((peer.getDownloadingSegmentId() == null) &&
                (peer.getSegmentsMap().get(resource.id) === bk_resource_1.BKResourceStatus.Loaded)) {
                this._peerResourceTransfers.set(resource.id, new PeerResourceTransfer(peer.id, resource));
                peer.sendSegmentRequest(resource.id);
                return true;
            }
        }
        return false;
    };
    PeerAgent.prototype.abort = function (segment) {
        var peerSegmentRequest = this._peerResourceTransfers.get(segment.id);
        if (peerSegmentRequest) {
            var peer = this._peers.get(peerSegmentRequest.peerId);
            if (peer) {
                peer.sendCancelSegmentRequest();
            }
            this._peerResourceTransfers.delete(segment.id);
        }
    };
    PeerAgent.prototype.isDownloading = function (segment) {
        return this._peerResourceTransfers.has(segment.id);
    };
    PeerAgent.prototype.getActiveDownloadsCount = function () {
        return this._peerResourceTransfers.size;
    };
    PeerAgent.prototype.sendSegmentsMapToAll = function (segmentsMap) {
        this.debug('sending chunk-map to all');
        this._peers.forEach(function (peer) { return peer.sendSegmentsMap(segmentsMap); });
    };
    PeerAgent.prototype.sendSegmentsMap = function (peerId, segmentsMap) {
        var peer = this._peers.get(peerId);
        if (peer) {
            peer.sendSegmentsMap(segmentsMap);
        }
    };
    PeerAgent.prototype.getOverallSegmentsMap = function () {
        var overallSegmentsMap = new Map();
        this._peers.forEach(function (peer) { return peer.getSegmentsMap().forEach(function (segmentStatus, segmentId) {
            if (segmentStatus === bk_resource_1.BKResourceStatus.Loaded) {
                overallSegmentsMap.set(segmentId, bk_resource_1.BKResourceStatus.Loaded);
            }
            else if (!overallSegmentsMap.get(segmentId)) {
                overallSegmentsMap.set(segmentId, bk_resource_1.BKResourceStatus.LoadingViaHttp);
            }
        }); });
        return overallSegmentsMap;
    };
    PeerAgent.prototype.getPeerId = function () {
        return this._peerId;
    };
    PeerAgent.prototype.getSwarmId = function () {
        return this._swarmId;
    };
    PeerAgent.prototype.setSwarmId = function (swarmId) {
        if (this._swarmId === swarmId) {
            return;
        }
        this._swarmId = swarmId;
        this.debug('swarm ID', this._swarmId);
        // Q: check what this hash is really about
        this._createClient(crypto_1.createHash('sha1').update(PEER_PROTOCOL_VERSION + this._swarmId).digest('hex'));
    };
    PeerAgent.prototype.getPeerConnections = function () {
        return Array.from(this._peers.values());
    };
    PeerAgent.prototype._createClient = function (infoHash) {
        var clientOptions = {
            infoHash: infoHash,
            peerId: this._peerId,
            announce: this.settings.trackerAnnounce,
            rtcConfig: this.settings.rtcConfig,
            port: 19699,
            wrtc: global ? global.wrtc : null
        };
        this._trackerClient = new bittorrent_tracker_1.Client(clientOptions);
        if (!this._trackerClient) {
            throw new Error('Tracker client instance does not exist');
        }
        // TODO: Add better handling here
        this._trackerClient.on('error', this._onTrackerError.bind(this));
        this._trackerClient.on('warning', this._onTrackerWarning.bind(this));
        this._trackerClient.on('update', this._onTrackerUpdate.bind(this));
        this._trackerClient.on('peer', this._onTrackerPeer.bind(this));
        this._trackerClient.start();
    };
    PeerAgent.prototype._onTrackerError = function (data) {
        console.error('Tracker-client error:', data);
        throw new Error('Unhandled Beekeepr error');
    };
    PeerAgent.prototype._onTrackerWarning = function (data) {
        console.warn('Tracker-client warning:', data);
    };
    PeerAgent.prototype._onTrackerUpdate = function (data) {
        this.debug('Tracker-client update data received');
    };
    PeerAgent.prototype._onTrackerPeer = function (trackerPeer) {
        this.debug('Peer added from tracker:', trackerPeer.id, trackerPeer);
        if (this._peers.has(trackerPeer.id)) {
            this.debug('tracker peer already connected', trackerPeer.id, trackerPeer);
            trackerPeer.destroy();
            return;
        }
        var getTransportWrapper = this.settings.mediaPeerTransportFilterFactory;
        var mediaPeerTransport = getTransportWrapper(trackerPeer);
        var peer = new peer_1.Peer(mediaPeerTransport, this.settings);
        peer.on('connect', this._onPeerConnect);
        peer.on('close', this._onPeerClose);
        peer.on('data-updated', this._onPeerDataUpdated);
        peer.on('resource-request', this._onResourceRequest);
        peer.on('resource-fetched', this._onResourceFetched);
        peer.on('resource-absent', this._onResourceAbsent);
        peer.on('resource-error', this._onResourceError);
        peer.on('resource-timeout', this._onResourceTimeout);
        peer.on('bytes-downloaded', this._onBytesDownloaded);
        peer.on('bytes-uploaded', this._onBytesUploaded);
        var peerCandidatesById = this._peerCandidates.get(peer.id);
        if (!peerCandidatesById) {
            peerCandidatesById = [];
            this._peerCandidates.set(peer.id, peerCandidatesById);
        }
        peerCandidatesById.push(peer);
    };
    return PeerAgent;
}(stringly_typed_event_emitter_1.StringlyTypedEventEmitter));
exports.PeerAgent = PeerAgent;


/***/ }),

/***/ "./lib/core/peer-transport.ts":
/*!************************************!*\
  !*** ./lib/core/peer-transport.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stringly_typed_event_emitter_1 = __webpack_require__(/*! ./stringly-typed-event-emitter */ "./lib/core/stringly-typed-event-emitter.ts");
var network_channel_emulator_1 = __webpack_require__(/*! ./network-channel-emulator */ "./lib/core/network-channel-emulator.ts");
var Debug = __webpack_require__(/*! debug */ "debug");
var bytes_read_write_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/bytes-read-write */ "./ext-mod/emliri-es-libs/rialto/lib/bytes-read-write.ts");
var debug = Debug('bk:core:peer-transport');
var PeerCommandType;
(function (PeerCommandType) {
    PeerCommandType["SegmentData"] = "segment_data";
    PeerCommandType["SegmentAbsent"] = "segment_absent";
    PeerCommandType["SegmentsMap"] = "segments_map";
    PeerCommandType["SegmentRequest"] = "segment_request";
    PeerCommandType["CancelSegmentRequest"] = "cancel_segment_request";
})(PeerCommandType = exports.PeerCommandType || (exports.PeerCommandType = {}));
// TODO: marshall parsed data
function decodeMediaPeerTransportCommand(data) {
    var bytes = new Uint8Array(data);
    // Serialized JSON string check by first, second and last characters: '{" .... }'
    //if (bytes[0] == 123 && bytes[1] == 34 && bytes[data.byteLength - 1] == 125) {
    try {
        return JSON.parse(bytes_read_write_1.utf8BytesToString(bytes));
        // BROKEN: doesn't work in Node, this does ^
        //return JSON.parse(new TextDecoder('utf-8').decode(data));
    }
    catch (_a) {
        throw new Error('Failed to decode message');
    }
    //}
    return null;
}
exports.decodeMediaPeerTransportCommand = decodeMediaPeerTransportCommand;
var DefaultPeerTransportFilter = /** @class */ (function (_super) {
    __extends(DefaultPeerTransportFilter, _super);
    function DefaultPeerTransportFilter(_transport) {
        var _this = _super.call(this) || this;
        _this._transport = _transport;
        _this._netEmIn = new network_channel_emulator_1.NetworkChannelEmulator(_this._onNetChannelInData.bind(_this));
        _this._netEmOut = new network_channel_emulator_1.NetworkChannelEmulator(_this._onNetChannelOutData.bind(_this));
        _this._transport.on('connect', function () { return _this._onConnect(); });
        _this._transport.on('close', function () { return _this._onClose(); });
        _this._transport.on('error', function (error) { return _this._onError(error); });
        _this._transport.on('data', function (data) { return _this._onData(data); });
        return _this;
    }
    Object.defineProperty(DefaultPeerTransportFilter.prototype, "id", {
        get: function () {
            return this._transport.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultPeerTransportFilter.prototype, "remoteAddress", {
        get: function () {
            return this._transport.remoteAddress;
        },
        enumerable: true,
        configurable: true
    });
    DefaultPeerTransportFilter.prototype.write = function (buffer) {
        if (typeof buffer === 'string') {
            debug("writing data to remote peer (id='" + this.id + "') with string: " + buffer);
        }
        else {
            debug("writing data to remote peer (id='" + this.id + "') with Buffer object, byte-length is " + buffer.byteLength);
        }
        this._netEmOut.push(buffer);
    };
    DefaultPeerTransportFilter.prototype.destroy = function () {
        this._transport.destroy();
    };
    DefaultPeerTransportFilter.prototype.setMaxBandwidthBps = function (n) {
        debug("setting peer-transport " + this.id + " max-bandwidth to " + n + " bps");
        this._netEmIn.maxBandwidthBps = n;
        this._netEmOut.maxBandwidthBps = n;
        return true;
    };
    DefaultPeerTransportFilter.prototype.setMinLatencyMs = function (n) {
        this._netEmIn.maxBandwidthBps = n;
        this._netEmOut.maxBandwidthBps = n;
        return true;
    };
    DefaultPeerTransportFilter.prototype._onConnect = function () {
        debug('connect');
        this.emit('connect');
    };
    DefaultPeerTransportFilter.prototype._onClose = function () {
        debug('close');
        this.emit('close');
    };
    DefaultPeerTransportFilter.prototype._onError = function (error) {
        debug('error');
        this.emit('error', error);
    };
    DefaultPeerTransportFilter.prototype._onData = function (data) {
        debug('input data');
        this._netEmIn.push(data);
    };
    DefaultPeerTransportFilter.prototype._onNetChannelInData = function (data) {
        debug('input netem data');
        this.emit('data', data);
    };
    DefaultPeerTransportFilter.prototype._onNetChannelOutData = function (data) {
        this._transport.write(data);
    };
    return DefaultPeerTransportFilter;
}(stringly_typed_event_emitter_1.StringlyTypedEventEmitter));
exports.DefaultPeerTransportFilter = DefaultPeerTransportFilter;


/***/ }),

/***/ "./lib/core/peer.ts":
/*!**************************!*\
  !*** ./lib/core/peer.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = __webpack_require__(/*! debug */ "debug");
var stringly_typed_event_emitter_1 = __webpack_require__(/*! ./stringly-typed-event-emitter */ "./lib/core/stringly-typed-event-emitter.ts");
var detect_safari_11_1 = __webpack_require__(/*! ./detect-safari-11 */ "./lib/core/detect-safari-11.ts");
var peer_transport_1 = __webpack_require__(/*! ./peer-transport */ "./lib/core/peer-transport.ts");
var bk_resource_1 = __webpack_require__(/*! ./bk-resource */ "./lib/core/bk-resource.ts");
// TODO: Make this ResourceRequest
var PeerDataTransmission = /** @class */ (function () {
    function PeerDataTransmission(id, size) {
        this.id = id;
        this.size = size;
        this.bytesDownloaded = 0;
        this.chunks = [];
    }
    return PeerDataTransmission;
}());
var Peer = /** @class */ (function (_super) {
    __extends(Peer, _super);
    function Peer(_peerTransport, settings) {
        var _this = _super.call(this) || this;
        _this._peerTransport = _peerTransport;
        _this.settings = settings;
        _this._remoteAddress = null;
        _this.debug = Debug('bk:core:peer');
        _this._downloadingSegmentId = null;
        _this._downloadingSegment = null;
        _this._segmentsMap = bk_resource_1.BKResourceMap.create();
        _this._timer = null;
        _this._isSafari11_0 = false;
        _this._peerTransport.on('connect', function () { return _this._onPeerConnect(); });
        _this._peerTransport.on('close', function () { return _this._onPeerClose(); });
        _this._peerTransport.on('error', function (error) { return _this.debug('peer error', _this._id, error, _this); });
        _this._peerTransport.on('data', _this._onPeerData.bind(_this));
        _this._id = _peerTransport.id;
        _this._isSafari11_0 = detect_safari_11_1.detectSafari11_0();
        return _this;
    }
    Object.defineProperty(Peer.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Peer.prototype, "remoteAddress", {
        get: function () {
            return this._remoteAddress;
        },
        enumerable: true,
        configurable: true
    });
    Peer.prototype.getInfo = function () {
        return {
            id: this.id,
            remoteAddress: this.remoteAddress
        };
    };
    Peer.prototype.destroy = function () {
        this.debug("destroying local handle for remote peer (id='" + this._id + "') -> goodbye mate :)");
        this._terminateSegmentRequest();
        this._peerTransport.destroy();
    };
    Peer.prototype.getDownloadingSegmentId = function () {
        return this._downloadingSegmentId;
    };
    Peer.prototype.getSegmentsMap = function () {
        return this._segmentsMap;
    };
    Peer.prototype.sendSegmentsMap = function (segments) {
        this._sendCommand({ 'type': peer_transport_1.PeerCommandType.SegmentsMap, 'segments': segments });
    };
    Peer.prototype.sendSegmentData = function (segmentId, data) {
        this._sendCommand({
            type: peer_transport_1.PeerCommandType.SegmentData,
            segment_id: segmentId,
            segment_size: data.byteLength
        });
        var bytesLeft = data.byteLength;
        while (bytesLeft > 0) {
            var bytesToSend = (bytesLeft >= this.settings.webRtcMaxMessageSize
                ? this.settings.webRtcMaxMessageSize : bytesLeft);
            var buffer = this._isSafari11_0 ?
                Buffer.from(data.slice(data.byteLength - bytesLeft, data.byteLength - bytesLeft + bytesToSend)) : // workaround for Safari 11.0 bug: https://bugs.webkit.org/show_bug.cgi?id=173052
                Buffer.from(data, data.byteLength - bytesLeft, bytesToSend); // avoid memory copying
            this._peerTransport.write(buffer);
            bytesLeft -= bytesToSend;
        }
        this.emit('bytes-uploaded', data.byteLength);
    };
    Peer.prototype.sendSegmentAbsent = function (segmentId) {
        this._sendCommand({ type: peer_transport_1.PeerCommandType.SegmentAbsent, segment_id: segmentId });
    };
    Peer.prototype.sendSegmentRequest = function (segmentId) {
        if (this._downloadingSegmentId) {
            throw new Error('A segment is already downloading: ' + this._downloadingSegmentId);
        }
        this._sendCommand({ type: peer_transport_1.PeerCommandType.SegmentRequest, segment_id: segmentId });
        this._downloadingSegmentId = segmentId;
        this._scheduleResponseTimeout();
    };
    Peer.prototype.sendCancelSegmentRequest = function () {
        if (this._downloadingSegmentId) {
            var segmentId = this._downloadingSegmentId;
            this._terminateSegmentRequest();
            this._sendCommand({ type: peer_transport_1.PeerCommandType.CancelSegmentRequest, segment_id: segmentId });
        }
    };
    Peer.prototype.getTransportInterface = function () {
        return this._peerTransport;
    };
    Peer.prototype._sendCommand = function (command) {
        this.debug("sending command \"" + command.type + "\" to remote peer (id='" + this._id + "') ");
        this._peerTransport.write(JSON.stringify(command));
    };
    Peer.prototype._scheduleResponseTimeout = function () {
        var _this = this;
        this._timer = window.setTimeout(function () {
            _this._timer = null;
            if (!_this._downloadingSegmentId) {
                return;
            }
            var segmentId = _this._downloadingSegmentId;
            _this.sendCancelSegmentRequest();
            _this.emit('resource-timeout', _this, segmentId); // TODO: send peer not responding event
        }, this.settings.p2pSegmentDownloadTimeout);
    };
    Peer.prototype._cancelResponseTimeout = function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    };
    Peer.prototype._terminateSegmentRequest = function () {
        this._downloadingSegmentId = null;
        this._downloadingSegment = null;
        this._cancelResponseTimeout();
    };
    Peer.prototype._handleSegmentChunk = function (data) {
        this.debug("received resource data from remote peer (id='" + this._id + "')");
        if (!this._downloadingSegment) {
            // The segment was not requested or canceled
            this.debug("received data from remote peer (id='" + this._id + "') for non-requested or canceled segment :(");
            //return;
            console.log(data);
            throw new Error('Runtime self-check failed: unexpected data received from peer');
        }
        this._downloadingSegment.bytesDownloaded += data.byteLength;
        this._downloadingSegment.chunks.push(data);
        this.emit('bytes-downloaded', data.byteLength);
        var segmentId = this._downloadingSegment.id;
        if (this._downloadingSegment.bytesDownloaded == this._downloadingSegment.size) {
            var segmentData = new Uint8Array(this._downloadingSegment.size);
            var offset = 0;
            for (var _i = 0, _a = this._downloadingSegment.chunks; _i < _a.length; _i++) {
                var chunk = _a[_i];
                segmentData.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
            }
            this.debug('peer resource transfer done', this._id, segmentId, this);
            this._terminateSegmentRequest();
            this.emit('resource-fetched', this, segmentId, segmentData.buffer);
        }
        else if (this._downloadingSegment.bytesDownloaded > this._downloadingSegment.size) {
            this.debug("remote peer (id='" + this._id + "'): transferred resource bytes mismatch!!!", segmentId);
            console.error('There was a fatal peer transaction error :(');
            this._terminateSegmentRequest();
            this.emit('resource-error', this, segmentId, 'Too many bytes received for segment');
        }
    };
    Peer.prototype._onPeerData = function (data) {
        ///*
        if (data instanceof Buffer) {
            data = data.buffer;
        }
        //*/
        if (!(data instanceof ArrayBuffer)) {
            console.log(data);
            throw new Error('Assertion failed: data not an ArrayBuffer');
        }
        var command = peer_transport_1.decodeMediaPeerTransportCommand(data);
        if (!command) {
            this._handleSegmentChunk(data);
            return;
        }
        if (this._downloadingSegment) {
            this.debug('peer segment download is interrupted by a command', this._id, this);
            var segmentId = this._downloadingSegment.id;
            this._terminateSegmentRequest();
            this.emit('resource-error', this, segmentId, 'Segment download is interrupted by a command');
            return;
        }
        this.debug('peer receive command', this._id, command, this);
        switch (command.type) {
            case peer_transport_1.PeerCommandType.SegmentsMap:
                if (!command.segments) {
                    throw new Error('No `segments` found in data');
                }
                this._segmentsMap = bk_resource_1.BKResourceMap.create(command.segments);
                this.emit('data-updated');
                break;
            case peer_transport_1.PeerCommandType.SegmentRequest:
                this.emit('resource-request', this, command.segment_id);
                break;
            case peer_transport_1.PeerCommandType.SegmentData:
                if (this._downloadingSegmentId === command.segment_id) {
                    if (!command.segment_size) {
                        throw new Error('No `segment_size` found in data');
                    }
                    this._downloadingSegment = new PeerDataTransmission(command.segment_id, command.segment_size);
                    this._cancelResponseTimeout();
                }
                break;
            case peer_transport_1.PeerCommandType.SegmentAbsent:
                if (this._downloadingSegmentId === command.segment_id) {
                    this._terminateSegmentRequest();
                    this._segmentsMap.delete(command.segment_id);
                    this.emit('resource-absent', this, command.segment_id);
                }
                break;
            case peer_transport_1.PeerCommandType.CancelSegmentRequest:
                // TODO: peer stop sending buffer
                break;
            default:
                break;
        }
    };
    Peer.prototype._onPeerConnect = function () {
        this.debug("remote peer (id='" + this._id + "') connection open");
        this._remoteAddress = this._peerTransport.remoteAddress;
        this.emit('connect', this);
    };
    Peer.prototype._onPeerClose = function () {
        this.debug("remote peer (id='" + this._id + "') connection closed");
        this._terminateSegmentRequest();
        this.emit('close', this);
    };
    return Peer;
}(stringly_typed_event_emitter_1.StringlyTypedEventEmitter));
exports.Peer = Peer;


/***/ }),

/***/ "./lib/core/perf-now.ts":
/*!******************************!*\
  !*** ./lib/core/perf-now.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var performance;
if (!global) {
    performance = window.performance;
}
function getPerfNow() {
    if (!performance) {
        return Date.now();
    }
    return performance.now();
}
exports.getPerfNow = getPerfNow;


/***/ }),

/***/ "./lib/core/stringly-typed-event-emitter.ts":
/*!**************************************************!*\
  !*** ./lib/core/stringly-typed-event-emitter.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __webpack_require__(/*! eventemitter3 */ "eventemitter3");
var StringlyTypedEventEmitter = /** @class */ (function (_super) {
    __extends(StringlyTypedEventEmitter, _super);
    function StringlyTypedEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringlyTypedEventEmitter.prototype.on = function (event, listener) { return _super.prototype.on.call(this, event, listener); };
    StringlyTypedEventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, [event].concat(args));
    };
    return StringlyTypedEventEmitter;
}(eventemitter3_1.EventEmitter));
exports.StringlyTypedEventEmitter = StringlyTypedEventEmitter;


/***/ }),

/***/ "./lib/universal-engine/engine.ts":
/*!****************************************!*\
  !*** ./lib/universal-engine/engine.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! ../core */ "./lib/core/index.ts");
var hls_access_proxy_1 = __webpack_require__(/*! ./hls-access-proxy */ "./lib/universal-engine/hls-access-proxy.ts");
var Debug = __webpack_require__(/*! debug */ "debug");
var virtual_playhead_1 = __webpack_require__(/*! ./virtual-playhead */ "./lib/universal-engine/virtual-playhead.ts");
var bk_resource_tx_monitor_1 = __webpack_require__(/*! ../core/bk-resource-tx-monitor */ "./lib/core/bk-resource-tx-monitor.ts");
var bk_swarm_id_1 = __webpack_require__(/*! ../core/bk-swarm-id */ "./lib/core/bk-swarm-id.ts");
var debug = Debug('bk:engine:universal:engine');
var Engine = /** @class */ (function () {
    function Engine(settings) {
        //super();
        if (settings === void 0) { settings = {}; }
        var _this = this;
        this._sourceUrl = null;
        this._gotEarliestRequestedRangeBuffered = false;
        this._monitorDomView = null;
        debug('created universal adaptive media p2p engine', settings);
        /**
         * Access proxy for HTTP resources
         */
        this._proxy = new core_1.BKAccessProxy(settings);
        /**
         * Accces proxy for HLS media (uses HTTP proxy)
         */
        this._hlsProxy = new hls_access_proxy_1.HlsAccessProxy(this._proxy);
        this._hlsProxy.on('buffered-range-change', function () {
            _this._playhead.setBufferedRanges(_this._hlsProxy.getBufferedRanges());
            if (!_this._gotEarliestRequestedRangeBuffered) {
                var earliestRangeRequested = _this._hlsProxy.getRequestedRanges().getEarliestRange();
                var earliestRangeBuffered = _this._hlsProxy.getBufferedRanges().getEarliestRange();
                if (earliestRangeRequested && earliestRangeBuffered) {
                    if (earliestRangeBuffered.start === earliestRangeRequested.start) {
                        _this._gotEarliestRequestedRangeBuffered = true;
                        _this._playhead.setCurrentTime(earliestRangeBuffered.start);
                    }
                }
            }
        });
        /**
         * VirtualPlayhead clock control
         */
        this._playhead = new virtual_playhead_1.VirtualPlayhead(function () {
            // TODO: add to monitor
            //console.log('media-engine virtual clock time:', playhead.getCurrentTime())
            _this._hlsProxy.updateFetchTargetRange(_this._playhead.getCurrentTime());
        });
        /**
         * Monitoring view
         */
        this._monitorDomView = window && window.document ?
            new bk_resource_tx_monitor_1.BKResourceTransferMonitorDomView(this.getProxy(), 'root') : null;
    }
    Engine.isSupported = function () {
        return core_1.BKAccessProxy.isSupported();
    };
    Engine.prototype.getProxy = function () {
        return this._proxy;
    };
    Engine.prototype.getPlayhead = function () {
        return this._playhead;
    };
    Engine.prototype.getPeerId = function () {
        return this._proxy.getPeerId();
    };
    Engine.prototype.getSwarmId = function () {
        return this._proxy.getSwarmId();
    };
    Engine.prototype.destroy = function () {
        this._proxy.terminate();
    };
    Engine.prototype.setSource = function (url) {
        if (this._sourceUrl) {
            throw new Error('Source URL already set');
        }
        this._sourceUrl = url;
        debug('set source', url);
        // FIXME: this is a hack, should only be used if running directly on a media-variant playlist (not master)
        this._proxy.setSwarmId(bk_swarm_id_1.getSwarmIdForVariantPlaylist(url));
    };
    Engine.prototype.start = function () {
        if (!this._sourceUrl) {
            throw new Error('No source URL set');
        }
        this._hlsProxy.setSource(this._sourceUrl);
    };
    Engine.prototype.setMaxLiveDelaySeconds = function (maxLiveDelaySeconds) {
        this._hlsProxy.liveDelaySeconds = maxLiveDelaySeconds;
    };
    Engine.prototype.setMaxPlayheadLookaheadSeconds = function (maxPlayheadLookaheadSeconds) {
        this._hlsProxy.playheadLookaheadSeconds = maxPlayheadLookaheadSeconds;
    };
    Engine.prototype.setNetemPeerMaxKbps = function (kbpsMaxBw) {
        this._proxy.getPeerConnections().forEach(function (peer) {
            peer.getTransportInterface().setMaxBandwidthBps(1000 * kbpsMaxBw);
        });
    };
    return Engine;
}());
exports.Engine = Engine;


/***/ }),

/***/ "./lib/universal-engine/hls-access-proxy.ts":
/*!**************************************************!*\
  !*** ./lib/universal-engine/hls-access-proxy.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = __webpack_require__(/*! debug */ "debug");
var hls_m3u8_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/hls-m3u8 */ "./ext-mod/emliri-es-libs/rialto/lib/hls-m3u8.ts");
var adaptive_media_client_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client */ "./ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client.ts");
var time_intervals_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/time-intervals */ "./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts");
var bk_resource_request_1 = __webpack_require__(/*! ../core/bk-resource-request */ "./lib/core/bk-resource-request.ts"); // TODO: move to core
var bk_swarm_id_1 = __webpack_require__(/*! ../core/bk-swarm-id */ "./lib/core/bk-swarm-id.ts");
var stringly_typed_event_emitter_1 = __webpack_require__(/*! ../core/stringly-typed-event-emitter */ "./lib/core/stringly-typed-event-emitter.ts");
var debug = Debug('bk:engine:universal:hls-access-proxy');
var DEFAULT_PLAYHEAD_LOOK_AHEAD = 30;
var DEFAULT_LIVE_DELAY = 30;
var HlsAccessProxy = /** @class */ (function (_super) {
    __extends(HlsAccessProxy, _super);
    function HlsAccessProxy(proxy) {
        var _this = _super.call(this) || this;
        _this.liveDelaySeconds = DEFAULT_LIVE_DELAY;
        _this.playheadLookaheadSeconds = DEFAULT_PLAYHEAD_LOOK_AHEAD;
        _this._mediaStreamConsumer = null;
        debug('created HLS access-proxy');
        _this._bkProxy = proxy;
        return _this;
    }
    HlsAccessProxy.prototype.setSource = function (url) {
        debug("processing playlist (parsing) for url: " + url);
        this._processM3u8File(url);
    };
    HlsAccessProxy.prototype.updateFetchTargetRange = function (playheadPositionSeconds) {
        if (!this._mediaStreamConsumer) {
            return;
        }
        if (this._mediaStreamConsumer.getMedia().isLive) {
            this._mediaStreamConsumer.setFetchFloorCeiling(-1 * this.liveDelaySeconds);
        }
        else {
            this._mediaStreamConsumer.setFetchFloorCeiling(0, playheadPositionSeconds + this.playheadLookaheadSeconds);
        }
    };
    HlsAccessProxy.prototype.getBufferedRanges = function () {
        if (!this._mediaStreamConsumer) {
            return new time_intervals_1.TimeIntervalContainer();
        }
        return this._mediaStreamConsumer.getBufferedRanges();
    };
    HlsAccessProxy.prototype.getRequestedRanges = function () {
        return this._mediaStreamConsumer.getFetchTargetRanges();
    };
    HlsAccessProxy.prototype.isLiveSource = function () {
        return this._mediaStreamConsumer.getMedia().isLive;
    };
    HlsAccessProxy.prototype._createResourceRequestMaker = function (swarmId) {
        var _this = this;
        //debug(`new ResourceRequestMaker for ${swarmId}`);
        return (function (url, requestOpts) {
            return _this._createResourceRequest(swarmId, url, requestOpts);
        });
    };
    HlsAccessProxy.prototype._createResourceRequest = function (swarmId, url, requestOpts) {
        return new bk_resource_request_1.BKResourceRequest(this._bkProxy, swarmId, url, requestOpts);
    };
    HlsAccessProxy.prototype._processM3u8File = function (url) {
        var _this = this;
        var m3u8 = new hls_m3u8_1.HlsM3u8File(url);
        m3u8.fetch().then(function () {
            m3u8.parse().then(function (adaptiveMediaPeriods) {
                _this._onAdaptiveMediaPeriodsParsed(url, adaptiveMediaPeriods);
            });
        });
    };
    HlsAccessProxy.prototype._onAdaptiveMediaPeriodsParsed = function (url, adaptiveMediaPeriods) {
        var _this = this;
        // may get the first media of the first set in this period
        var media = adaptiveMediaPeriods[0].getDefaultSet().getDefaultMedia();
        media.refresh(media.isLive, function () {
            debug('setting request-makers on new segments', media.segments.length);
            media.segments.forEach(function (segment) {
                if (segment.hasCustomRequestMaker()) {
                    return;
                }
                debug('setting request-maker for:', segment.getUrl());
                var swarmId = bk_swarm_id_1.getSwarmIdForVariantPlaylist(url);
                segment.setRequestMaker(_this._createResourceRequestMaker(swarmId));
            });
        }).then(function (media) {
            _this._mediaStreamConsumer
                = new adaptive_media_client_1.AdaptiveMediaStreamConsumer(media, function (segment) {
                    _this._onSegmentBuffered(segment);
                });
        }).catch(function (err) {
            debug('no adaptive media refresh:', err);
        });
    };
    HlsAccessProxy.prototype._onSegmentBuffered = function (segment) {
        debug('segment buffered:', segment.getUrl());
        this.emit('buffered-range-change', this.getBufferedRanges());
    };
    return HlsAccessProxy;
}(stringly_typed_event_emitter_1.StringlyTypedEventEmitter));
exports.HlsAccessProxy = HlsAccessProxy;


/***/ }),

/***/ "./lib/universal-engine/index.ts":
/*!***************************************!*\
  !*** ./lib/universal-engine/index.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = __webpack_require__(/*! ./engine */ "./lib/universal-engine/engine.ts");
exports.Engine = engine_1.Engine;
var core_1 = __webpack_require__(/*! ../core */ "./lib/core/index.ts");
exports.BKAccessProxy = core_1.BKAccessProxy;
exports.BKAccessProxyEvents = core_1.BKAccessProxyEvents;
exports.BKResource = core_1.BKResource;


/***/ }),

/***/ "./lib/universal-engine/virtual-playhead.ts":
/*!**************************************************!*\
  !*** ./lib/universal-engine/virtual-playhead.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stringly_typed_event_emitter_1 = __webpack_require__(/*! ../core/stringly-typed-event-emitter */ "./lib/core/stringly-typed-event-emitter.ts");
var time_intervals_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/time-intervals */ "./ext-mod/emliri-es-libs/rialto/lib/time-intervals.ts");
var time_scale_1 = __webpack_require__(/*! ../../ext-mod/emliri-es-libs/rialto/lib/time-scale */ "./ext-mod/emliri-es-libs/rialto/lib/time-scale.ts");
var Debug = __webpack_require__(/*! debug */ "debug");
var debug = Debug('bk:engine:universal:virtual-playhead');
var perf = window.performance;
exports.UPDATE_PERIOD_MS = 500;
var VirtualPlayhead = /** @class */ (function (_super) {
    __extends(VirtualPlayhead, _super);
    function VirtualPlayhead(_onUpdate) {
        if (_onUpdate === void 0) { _onUpdate = null; }
        var _this = _super.call(this) || this;
        _this._onUpdate = _onUpdate;
        _this._clockTime = 0;
        _this._updateIntervalTimer = null;
        _this._isPlaying = false;
        _this._updateCalledAt = null;
        _this._isSpinning = false;
        _this._bufferedTimeRanges = new time_intervals_1.TimeIntervalContainer();
        _this._timeScale = new time_scale_1.TimeScale(1 / 1000);
        return _this;
    }
    VirtualPlayhead.prototype.play = function () {
        var _this = this;
        if (this._isPlaying) {
            return;
        }
        this._isPlaying = true;
        this._onUpdateTimer();
        this._updateIntervalTimer = window.setInterval(function () { return _this._onUpdateTimer(); }, exports.UPDATE_PERIOD_MS);
    };
    VirtualPlayhead.prototype.pause = function () {
        if (!this._isPlaying) {
            return;
        }
        this._isPlaying = false;
        this._updateCalledAt = null;
        window.clearInterval(this._updateIntervalTimer);
        this._updateIntervalTimer = null;
        this._onUpdateTimer();
    };
    /**
     *
     * @param time clock time in seconds
     */
    VirtualPlayhead.prototype.setCurrentTime = function (time) {
        this._clockTime = this._timeScale.denormalize(time);
    };
    /**
     * @returns clock time in seconds
     */
    VirtualPlayhead.prototype.getCurrentTime = function () {
        return this._timeScale.normalize(this._clockTime);
    };
    /**
     * Should be understood as `isPlaying()´, indicating the intention of spinning
     * while it can be pushed, while not spinning because data is lacking.
     */
    VirtualPlayhead.prototype.isPushed = function () {
        return this._isPlaying;
    };
    /**
     * Whether the tape is moving
     */
    VirtualPlayhead.prototype.isSpinning = function () {
        return this._isSpinning;
    };
    VirtualPlayhead.prototype.getBufferedRanges = function () {
        return this._bufferedTimeRanges;
    };
    VirtualPlayhead.prototype.setBufferedRanges = function (ranges) {
        debug('update buffered time-ranges');
        this._bufferedTimeRanges = ranges;
        if (!this._isSpinning) {
            this._onUpdateTimer();
        }
    };
    VirtualPlayhead.prototype._onUpdateTimer = function () {
        var lastCalledAt = this._updateCalledAt;
        this._updateCalledAt = perf.now();
        if (!this._isPlaying) {
            this._isSpinning = false;
            return;
        }
        if (lastCalledAt !== null && this._isSpinning) {
            this._clockTime += (this._updateCalledAt - lastCalledAt);
        }
        if (!this._isSpinning) {
            this._updateCalledAt = null;
        }
        this._isSpinning
            = this._bufferedTimeRanges.hasIntervalsWith(this.getCurrentTime());
        if (this._onUpdate) {
            this._onUpdate(this);
        }
        this.emit('update');
    };
    return VirtualPlayhead;
}(stringly_typed_event_emitter_1.StringlyTypedEventEmitter));
exports.VirtualPlayhead = VirtualPlayhead;


/***/ }),

/***/ "bittorrent-tracker":
/*!*************************************!*\
  !*** external "bittorrent-tracker" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bittorrent-tracker");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "domify":
/*!*************************!*\
  !*** external "domify" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("domify");

/***/ }),

/***/ "es6-set/polyfill":
/*!***********************************!*\
  !*** external "es6-set/polyfill" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("es6-set/polyfill");

/***/ }),

/***/ "eventemitter3":
/*!********************************!*\
  !*** external "eventemitter3" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "get-browser-rtc":
/*!**********************************!*\
  !*** external "get-browser-rtc" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("get-browser-rtc");

/***/ }),

/***/ "html-tag":
/*!***************************!*\
  !*** external "html-tag" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("html-tag");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "m3u8-parser":
/*!******************************!*\
  !*** external "m3u8-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("m3u8-parser");

/***/ }),

/***/ "simple-peer":
/*!******************************!*\
  !*** external "simple-peer" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("simple-peer");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "url-toolkit":
/*!******************************!*\
  !*** external "url-toolkit" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url-toolkit");

/***/ }),

/***/ "uuid/v4":
/*!**************************!*\
  !*** external "uuid/v4" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid/v4");

/***/ })

/******/ });
});
//# sourceMappingURL=BeekeeprUniversalEngineNode.umd.js.map