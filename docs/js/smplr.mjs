var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/player/connect.ts
function connectSerial(nodes) {
  const _nodes = nodes.filter((x) => !!x);
  _nodes.reduce((a, b) => {
    const left = "output" in a ? a.output : a;
    const right = "input" in b ? b.input : b;
    left.connect(right);
    return b;
  });
  return () => {
    _nodes.reduce((a, b) => {
      const left = "output" in a ? a.output : a;
      const right = "input" in b ? b.input : b;
      left.disconnect(right);
      return b;
    });
  };
}

// src/player/signals.ts
function createControl(initialValue) {
  let current = initialValue;
  const listeners = /* @__PURE__ */ new Set();
  function subscribe(listener) {
    listeners.add(listener);
    listener(current);
    return () => {
      listeners.delete(listener);
    };
  }
  function set(value) {
    current = value;
    listeners.forEach((listener) => listener(current));
  }
  function get() {
    return current;
  }
  return { subscribe, set, get };
}
function createTrigger() {
  const listeners = /* @__PURE__ */ new Set();
  function subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
  function trigger(value) {
    listeners.forEach((listener) => listener(value));
  }
  return { subscribe, trigger };
}
function unsubscribeAll(unsubscribe) {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    unsubscribe.forEach((cb) => cb == null ? void 0 : cb());
  };
}

// src/player/volume.ts
function midiVelToGain(vel) {
  return vel * vel / 16129;
}
function dbToGain(decibels) {
  return Math.pow(10, decibels / 20);
}

// src/player/channel.ts
var _volume, _sends, _inserts, _disconnect, _unsubscribe, _config, _disconnected;
var Channel = class {
  constructor(context, options) {
    this.context = context;
    __privateAdd(this, _volume);
    __privateAdd(this, _sends);
    __privateAdd(this, _inserts);
    __privateAdd(this, _disconnect);
    __privateAdd(this, _unsubscribe);
    __privateAdd(this, _config);
    __privateAdd(this, _disconnected, false);
    var _a, _b, _c;
    __privateSet(this, _config, {
      destination: (_a = options == null ? void 0 : options.destination) != null ? _a : context.destination,
      volume: (_b = options == null ? void 0 : options.volume) != null ? _b : 100,
      volumeToGain: (_c = options == null ? void 0 : options.volumeToGain) != null ? _c : midiVelToGain
    });
    this.input = context.createGain();
    __privateSet(this, _volume, context.createGain());
    __privateSet(this, _disconnect, connectSerial([
      this.input,
      __privateGet(this, _volume),
      __privateGet(this, _config).destination
    ]));
    const volume = createControl(__privateGet(this, _config).volume);
    this.setVolume = volume.set;
    __privateSet(this, _unsubscribe, volume.subscribe((volume2) => {
      __privateGet(this, _volume).gain.value = __privateGet(this, _config).volumeToGain(volume2);
    }));
  }
  addInsert(effect) {
    var _a;
    if (__privateGet(this, _disconnected)) {
      throw Error("Can't add insert to disconnected channel");
    }
    (_a = __privateGet(this, _inserts)) != null ? _a : __privateSet(this, _inserts, []);
    __privateGet(this, _inserts).push(effect);
    __privateGet(this, _disconnect).call(this);
    __privateSet(this, _disconnect, connectSerial([
      this.input,
      ...__privateGet(this, _inserts),
      __privateGet(this, _volume),
      __privateGet(this, _config).destination
    ]));
  }
  addEffect(name, effect, mixValue) {
    var _a;
    if (__privateGet(this, _disconnected)) {
      throw Error("Can't add effect to disconnected channel");
    }
    const mix = this.context.createGain();
    mix.gain.value = mixValue;
    const input = "input" in effect ? effect.input : effect;
    const disconnect = connectSerial([__privateGet(this, _volume), mix, input]);
    (_a = __privateGet(this, _sends)) != null ? _a : __privateSet(this, _sends, []);
    __privateGet(this, _sends).push({ name, mix, disconnect });
  }
  sendEffect(name, mix) {
    var _a;
    if (__privateGet(this, _disconnected)) {
      throw Error("Can't send effect to disconnected channel");
    }
    const send = (_a = __privateGet(this, _sends)) == null ? void 0 : _a.find((send2) => send2.name === name);
    if (send) {
      send.mix.gain.value = mix;
    } else {
      console.warn("Send bus not found: " + name);
    }
  }
  disconnect() {
    var _a;
    if (__privateGet(this, _disconnected)) return;
    __privateSet(this, _disconnected, true);
    __privateGet(this, _disconnect).call(this);
    __privateGet(this, _unsubscribe).call(this);
    (_a = __privateGet(this, _sends)) == null ? void 0 : _a.forEach((send) => send.disconnect());
    __privateSet(this, _sends, void 0);
  }
};
_volume = new WeakMap();
_sends = new WeakMap();
_inserts = new WeakMap();
_disconnect = new WeakMap();
_unsubscribe = new WeakMap();
_config = new WeakMap();
_disconnected = new WeakMap();

// src/player/sorted-queue.ts
var _items;
var SortedQueue = class {
  constructor(compare) {
    this.compare = compare;
    __privateAdd(this, _items, []);
  }
  push(item) {
    const len = __privateGet(this, _items).length;
    let left = 0;
    let right = len - 1;
    let index = len;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.compare(item, __privateGet(this, _items)[mid]) < 0) {
        index = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    __privateGet(this, _items).splice(index, 0, item);
  }
  pop() {
    return __privateGet(this, _items).shift();
  }
  peek() {
    return __privateGet(this, _items)[0];
  }
  removeAll(predicate) {
    const len = __privateGet(this, _items).length;
    __privateSet(this, _items, __privateGet(this, _items).filter((item) => !predicate(item)));
    return __privateGet(this, _items).length !== len;
  }
  clear() {
    __privateSet(this, _items, []);
  }
  size() {
    return __privateGet(this, _items).length;
  }
};
_items = new WeakMap();

// src/player/queued-player.ts
function compose(a, b) {
  return a && b ? (x) => {
    a(x);
    b(x);
  } : a != null ? a : b;
}
function getConfig(options) {
  var _a, _b, _c;
  const config = {
    disableScheduler: (_a = options.disableScheduler) != null ? _a : false,
    scheduleLookaheadMs: (_b = options.scheduleLookaheadMs) != null ? _b : 200,
    scheduleIntervalMs: (_c = options.scheduleIntervalMs) != null ? _c : 50,
    onStart: options.onStart,
    onEnded: options.onEnded
  };
  if (config.scheduleLookaheadMs < 1) {
    throw Error("scheduleLookaheadMs must be greater than 0");
  }
  if (config.scheduleIntervalMs < 1) {
    throw Error("scheduleIntervalMs must be greater than 0");
  }
  if (config.scheduleLookaheadMs < config.scheduleIntervalMs) {
    throw Error("scheduleLookaheadMs must be greater than scheduleIntervalMs");
  }
  return config;
}
var _config2, _queue, _intervalId;
var QueuedPlayer = class {
  constructor(player, options = {}) {
    __privateAdd(this, _config2);
    __privateAdd(this, _queue);
    __privateAdd(this, _intervalId);
    __privateSet(this, _config2, getConfig(options));
    __privateSet(this, _queue, new SortedQueue(
      (a, b) => a.time - b.time
    ));
    this.player = player;
  }
  get context() {
    return this.player.context;
  }
  get buffers() {
    return this.player.buffers;
  }
  get isRunning() {
    return __privateGet(this, _intervalId) !== void 0;
  }
  start(sample) {
    var _a;
    if (__privateGet(this, _config2).disableScheduler) {
      return this.player.start(sample);
    }
    const context = this.player.context;
    const now = context.currentTime;
    const startAt = (_a = sample.time) != null ? _a : now;
    const lookAhead = __privateGet(this, _config2).scheduleLookaheadMs / 1e3;
    sample.onStart = compose(sample.onStart, __privateGet(this, _config2).onStart);
    sample.onEnded = compose(sample.onEnded, __privateGet(this, _config2).onEnded);
    if (startAt < now + lookAhead) {
      return this.player.start(sample);
    }
    __privateGet(this, _queue).push(__spreadProps(__spreadValues({}, sample), { time: startAt }));
    if (!__privateGet(this, _intervalId)) {
      __privateSet(this, _intervalId, setInterval(() => {
        const nextTick = context.currentTime + lookAhead;
        while (__privateGet(this, _queue).size() && __privateGet(this, _queue).peek().time <= nextTick) {
          const sample2 = __privateGet(this, _queue).pop();
          if (sample2) {
            this.player.start(sample2);
          }
        }
        if (!__privateGet(this, _queue).size()) {
          clearInterval(__privateGet(this, _intervalId));
          __privateSet(this, _intervalId, void 0);
        }
      }, __privateGet(this, _config2).scheduleIntervalMs));
    }
    return (time) => {
      if (!time || time < startAt) {
        if (!__privateGet(this, _queue).removeAll((item) => item === sample)) {
          this.player.stop(__spreadProps(__spreadValues({}, sample), { time }));
        }
      } else {
        this.player.stop(__spreadProps(__spreadValues({}, sample), { time }));
      }
    };
  }
  stop(sample) {
    var _a;
    if (__privateGet(this, _config2).disableScheduler) {
      return this.player.stop(sample);
    }
    this.player.stop(sample);
    if (!sample) {
      __privateGet(this, _queue).clear();
      return;
    }
    const time = (_a = sample == null ? void 0 : sample.time) != null ? _a : 0;
    const stopId = sample == null ? void 0 : sample.stopId;
    if (stopId) {
      __privateGet(this, _queue).removeAll(
        (item) => item.time >= time && item.stopId ? item.stopId === stopId : item.note === stopId
      );
    } else {
      __privateGet(this, _queue).removeAll((item) => item.time >= time);
    }
  }
  disconnect() {
    this.player.disconnect();
  }
};
_config2 = new WeakMap();
_queue = new WeakMap();
_intervalId = new WeakMap();

// src/player/sample-player.ts
var _config3, _disconnected2, _stop;
var SamplePlayer = class {
  constructor(context, options) {
    this.context = context;
    this.options = options;
    __privateAdd(this, _config3);
    __privateAdd(this, _disconnected2, false);
    __privateAdd(this, _stop);
    var _a, _b;
    __privateSet(this, _config3, {
      velocityToGain: (_a = options.velocityToGain) != null ? _a : midiVelToGain,
      destination: (_b = options.destination) != null ? _b : context.destination
    });
    this.buffers = {};
    __privateSet(this, _stop, createTrigger());
  }
  start(sample) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    if (__privateGet(this, _disconnected2)) {
      throw new Error("Can't start a sample on disconnected player");
    }
    const context = this.context;
    const buffer = sample.name && this.buffers[sample.name] || this.buffers[sample.note];
    if (!buffer) {
      console.warn(`Sample not found: '${sample.note}'`);
      return () => void 0;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    const cents = (_b = (_a = sample.detune) != null ? _a : this.options.detune) != null ? _b : 0;
    if (source.detune) {
      source.detune.value = cents;
    } else if (source.playbackRate) {
      source.playbackRate.value = Math.pow(2, cents / 1200);
    }
    const lpfCutoffHz = (_c = sample.lpfCutoffHz) != null ? _c : this.options.lpfCutoffHz;
    const lpf = lpfCutoffHz ? context.createBiquadFilter() : void 0;
    if (lpfCutoffHz && lpf) {
      lpf.type = "lowpass";
      lpf.frequency.value = lpfCutoffHz;
    }
    const volume = context.createGain();
    const velocity = (_e = (_d = sample.velocity) != null ? _d : this.options.velocity) != null ? _e : 100;
    volume.gain.value = __privateGet(this, _config3).velocityToGain(velocity);
    const loop = (_f = sample.loop) != null ? _f : this.options.loop;
    if (loop) {
      source.loop = true;
      source.loopStart = (_g = sample.loopStart) != null ? _g : 0;
      source.loopEnd = (_h = sample.loopEnd) != null ? _h : buffer.duration;
    }
    const decayTime = (_i = sample.decayTime) != null ? _i : this.options.decayTime;
    const [decay, startDecay] = createDecayEnvelope(context, decayTime);
    function stop(time) {
      time != null ? time : time = context.currentTime;
      if (time <= startAt) {
        source.stop(time);
      } else {
        const stopAt = startDecay(time);
        source.stop(stopAt);
      }
    }
    const gainCompensation = sample.gainOffset ? context.createGain() : void 0;
    if (gainCompensation && sample.gainOffset) {
      gainCompensation.gain.value = sample.gainOffset;
    }
    const stopId = (_j = sample.stopId) != null ? _j : sample.note;
    const cleanup = unsubscribeAll([
      connectSerial([
        source,
        lpf,
        volume,
        decay,
        gainCompensation,
        __privateGet(this, _config3).destination
      ]),
      (_k = sample.stop) == null ? void 0 : _k.call(sample, stop),
      __privateGet(this, _stop).subscribe((event) => {
        if (!event || event.stopId === void 0 || event.stopId === stopId) {
          stop(event == null ? void 0 : event.time);
        }
      })
    ]);
    source.onended = () => {
      var _a2;
      cleanup();
      (_a2 = sample.onEnded) == null ? void 0 : _a2.call(sample, sample);
    };
    (_l = sample.onStart) == null ? void 0 : _l.call(sample, sample);
    const startAt = Math.max((_m = sample.time) != null ? _m : 0, context.currentTime);
    source.start(sample.time);
    let duration = (_n = sample.duration) != null ? _n : buffer.duration;
    if (typeof sample.duration == "number") {
      stop(startAt + duration);
    }
    return stop;
  }
  stop(sample) {
    __privateGet(this, _stop).trigger(sample);
  }
  disconnect() {
    if (__privateGet(this, _disconnected2)) return;
    __privateSet(this, _disconnected2, true);
    this.stop();
    Object.keys(this.buffers).forEach((key) => {
      delete this.buffers[key];
    });
  }
  get connected() {
    return !__privateGet(this, _disconnected2);
  }
};
_config3 = new WeakMap();
_disconnected2 = new WeakMap();
_stop = new WeakMap();
function createDecayEnvelope(context, envelopeTime = 0.2) {
  let stopAt = 0;
  const envelope = context.createGain();
  envelope.gain.value = 1;
  function start(time) {
    if (stopAt) return stopAt;
    envelope.gain.cancelScheduledValues(time);
    const envelopeAt = time || context.currentTime;
    stopAt = envelopeAt + envelopeTime;
    envelope.gain.setValueAtTime(1, envelopeAt);
    envelope.gain.linearRampToValueAtTime(0, stopAt);
    return stopAt;
  }
  return [envelope, start];
}

// src/player/default-player.ts
var DefaultPlayer = class {
  constructor(context, options) {
    this.context = context;
    const channel = new Channel(context, options);
    this.player = new QueuedPlayer(
      new SamplePlayer(context, __spreadProps(__spreadValues({}, options), { destination: channel.input })),
      options
    );
    this.output = channel;
  }
  get buffers() {
    return this.player.buffers;
  }
  start(sample) {
    return this.player.start(sample);
  }
  stop(sample) {
    this.player.stop(
      typeof sample === "object" ? sample : sample !== void 0 ? { stopId: sample } : void 0
    );
  }
  disconnect() {
    this.output.disconnect();
    this.player.disconnect();
  }
};

// src/player/load-audio.ts
function loadAudioBuffer(context, url, storage) {
  return __async(this, null, function* () {
    url = url.replace(/#/g, "%23").replace(/([^:]\/)\/+/g, "$1");
    const response = yield storage.fetch(url);
    if (response.status !== 200) {
      console.warn(
        "Error loading buffer. Invalid status: ",
        response.status,
        url
      );
      return;
    }
    try {
      const audioData = yield response.arrayBuffer();
      const buffer = yield context.decodeAudioData(audioData);
      return buffer;
    } catch (error) {
      console.warn("Error loading buffer", error, url);
    }
  });
}
function findFirstSupportedFormat(formats) {
  if (typeof document === "undefined") return null;
  const audio = document.createElement("audio");
  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];
    const canPlay = audio.canPlayType(`audio/${format}`);
    if (canPlay === "probably" || canPlay === "maybe") {
      return format;
    }
    if (format === "m4a") {
      const canPlay2 = audio.canPlayType(`audio/aac`);
      if (canPlay2 === "probably" || canPlay2 === "maybe") {
        return format;
      }
    }
  }
  return null;
}
function getPreferredAudioExtension() {
  var _a;
  const format = (_a = findFirstSupportedFormat(["ogg", "m4a"])) != null ? _a : "ogg";
  return "." + format;
}

// src/storage.ts
var HttpStorage = {
  fetch(url) {
    return fetch(url);
  }
};
var _cache, _CacheStorage_instances, tryFromCache_fn, saveResponse_fn;
var CacheStorage = class {
  constructor(name = "smplr") {
    __privateAdd(this, _CacheStorage_instances);
    __privateAdd(this, _cache);
    if (typeof window === "undefined" || !("caches" in window)) {
      __privateSet(this, _cache, Promise.reject("CacheStorage not supported"));
    } else {
      __privateSet(this, _cache, caches.open(name));
    }
  }
  fetch(url) {
    return __async(this, null, function* () {
      const request = new Request(url);
      try {
        return yield __privateMethod(this, _CacheStorage_instances, tryFromCache_fn).call(this, request);
      } catch (err) {
        const response = yield fetch(request);
        yield __privateMethod(this, _CacheStorage_instances, saveResponse_fn).call(this, request, response);
        return response;
      }
    });
  }
};
_cache = new WeakMap();
_CacheStorage_instances = new WeakSet();
tryFromCache_fn = function(request) {
  return __async(this, null, function* () {
    const cache = yield __privateGet(this, _cache);
    const response = yield cache.match(request);
    if (response) return response;
    else throw Error("Not found");
  });
};
saveResponse_fn = function(request, response) {
  return __async(this, null, function* () {
    try {
      const cache = yield __privateGet(this, _cache);
      yield cache.put(request, response.clone());
    } catch (err) {
    }
  });
};

// src/drum-machine/dm-instrument.ts
function isDrumMachineInstrument(instrument) {
  return typeof instrument === "object" && typeof instrument.baseUrl === "string" && typeof instrument.name === "string" && Array.isArray(instrument.samples) && Array.isArray(instrument.groupNames) && typeof instrument.nameToSampleName === "object" && typeof instrument.sampleGroupVariations === "object";
}
var EMPTY_INSTRUMENT = {
  baseUrl: "",
  name: "",
  samples: [],
  groupNames: [],
  nameToSampleName: {},
  sampleGroupVariations: {}
};
function fetchDrumMachineInstrument(url, storage) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d;
    const res = yield storage.fetch(url);
    const json = yield res.json();
    json.baseUrl = url.replace("/dm.json", "");
    json.groupNames = [];
    json.nameToSampleName = {};
    json.sampleGroupVariations = {};
    for (const sample of json.samples) {
      json.nameToSampleName[sample] = sample;
      const separator = sample.indexOf("/") !== -1 ? "/" : "-";
      const [base, variation] = sample.split(separator);
      if (!json.groupNames.includes(base)) {
        json.groupNames.push(base);
      }
      (_b = (_a = json.nameToSampleName)[base]) != null ? _b : _a[base] = sample;
      (_d = (_c = json.sampleGroupVariations)[base]) != null ? _d : _c[base] = [];
      if (variation) {
        json.sampleGroupVariations[base].push(`${base}${separator}${variation}`);
      }
    }
    return json;
  });
}

// src/drum-machine/drum-machine.ts
function getDrumMachineNames() {
  return Object.keys(INSTRUMENTS);
}
var INSTRUMENTS = {
  "TR-808": "https://smpldsnds.github.io/drum-machines/TR-808/dm.json",
  "Casio-RZ1": "https://smpldsnds.github.io/drum-machines/Casio-RZ1/dm.json",
  "LM-2": "https://smpldsnds.github.io/drum-machines/LM-2/dm.json",
  "MFB-512": "https://smpldsnds.github.io/drum-machines/MFB-512/dm.json",
  "Roland CR-8000": "https://smpldsnds.github.io/drum-machines/Roland-CR-8000/dm.json"
};
function getConfig2(options) {
  var _a, _b, _c;
  const config = {
    instrument: (_a = options == null ? void 0 : options.instrument) != null ? _a : "TR-808",
    storage: (_b = options == null ? void 0 : options.storage) != null ? _b : HttpStorage,
    url: (_c = options == null ? void 0 : options.url) != null ? _c : ""
  };
  if (typeof config.instrument === "string") {
    config.url || (config.url = INSTRUMENTS[config.instrument]);
    if (!config.url)
      throw new Error("Invalid instrument: " + config.instrument);
  } else if (!isDrumMachineInstrument(config.instrument)) {
    throw new Error("Invalid instrument: " + config.instrument);
  }
  return config;
}
var _instrument;
var DrumMachine = class {
  constructor(context, options) {
    __privateAdd(this, _instrument, EMPTY_INSTRUMENT);
    const config = getConfig2(options);
    const instrument = isDrumMachineInstrument(config.instrument) ? Promise.resolve(config.instrument) : fetchDrumMachineInstrument(config.url, config.storage);
    this.player = new DefaultPlayer(context, options);
    this.output = this.player.output;
    this.load = drumMachineLoader(
      context,
      this.player.buffers,
      instrument,
      config.storage
    ).then(() => this);
    instrument.then((instrument2) => {
      __privateSet(this, _instrument, instrument2);
    });
  }
  getSampleNames() {
    return __privateGet(this, _instrument).samples.slice();
  }
  getGroupNames() {
    return __privateGet(this, _instrument).groupNames.slice();
  }
  getSampleNamesForGroup(groupName) {
    var _a;
    return (_a = __privateGet(this, _instrument).sampleGroupVariations[groupName]) != null ? _a : [];
  }
  start(sample) {
    var _a;
    const sampleName = __privateGet(this, _instrument).nameToSampleName[sample.note];
    return this.player.start(__spreadProps(__spreadValues({}, sample), {
      note: sampleName ? sampleName : sample.note,
      stopId: (_a = sample.stopId) != null ? _a : sample.note
    }));
  }
  stop(sample) {
    return this.player.stop(sample);
  }
  /** @deprecated */
  loaded() {
    return __async(this, null, function* () {
      console.warn("deprecated: use load instead");
      return this.load;
    });
  }
  /** @deprecated */
  get sampleNames() {
    console.log("deprecated: Use getGroupNames instead");
    return __privateGet(this, _instrument).groupNames.slice();
  }
  /** @deprecated */
  getVariations(groupName) {
    var _a;
    console.warn("deprecated: use getSampleNamesForGroup");
    return (_a = __privateGet(this, _instrument).sampleGroupVariations[groupName]) != null ? _a : [];
  }
};
_instrument = new WeakMap();
function drumMachineLoader(context, buffers, instrument, storage) {
  var _a;
  const format = (_a = findFirstSupportedFormat(["ogg", "m4a"])) != null ? _a : "ogg";
  return instrument.then(
    (data) => Promise.all(
      data.samples.map((sampleName) => __async(this, null, function* () {
        const url = `${data.baseUrl}/${sampleName}.${format}`;
        const buffer = yield loadAudioBuffer(context, url, storage);
        if (buffer) buffers[sampleName] = buffer;
      }))
    )
  );
}

// src/player/midi.ts
function noteNameToMidi(note) {
  const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|)(-?\d+)$/;
  const m = REGEX.exec(note);
  if (!m) return;
  const letter = m[1].toUpperCase();
  if (!letter) return;
  const acc = m[2];
  const alt = acc[0] === "b" ? -acc.length : acc.length;
  const oct = m[3] ? +m[3] : 4;
  const step = (letter.charCodeAt(0) + 3) % 7;
  return [0, 2, 4, 5, 7, 9, 11][step] + alt + 12 * (oct + 1);
}
function toMidi(note) {
  return note === void 0 ? void 0 : typeof note === "number" ? note : noteNameToMidi(note);
}

// src/sfz/sfz-load.ts
function loadSfzBuffers(context, buffers, websfz, storage) {
  return __async(this, null, function* () {
    websfz.groups.forEach((group) => {
      const urls = getWebsfzGroupUrls(websfz, group);
      return loadAudioBuffers(context, buffers, urls, storage);
    });
  });
}
function SfzInstrumentLoader(instrument, storage) {
  return __async(this, null, function* () {
    var _a;
    const isWebsfz = (inst) => "global" in inst;
    const isSfzInstrument = (inst) => "websfzUrl" in inst;
    if (typeof instrument === "string") {
      return fetchWebSfz(instrument, storage);
    } else if (isWebsfz(instrument)) {
      return instrument;
    } else if (isSfzInstrument(instrument)) {
      const websfz = yield fetchWebSfz(instrument.websfzUrl, storage);
      (_a = websfz.meta) != null ? _a : websfz.meta = {};
      if (instrument.name) websfz.meta.name = instrument.name;
      if (instrument.baseUrl) websfz.meta.baseUrl = instrument.baseUrl;
      if (instrument.formats) websfz.meta.formats = instrument.formats;
      return websfz;
    } else {
      throw new Error("Invalid instrument: " + JSON.stringify(instrument));
    }
  });
}
function loadAudioBuffers(context, buffers, urls, storage) {
  return __async(this, null, function* () {
    yield Promise.all(
      Object.keys(urls).map((sampleId) => __async(this, null, function* () {
        if (buffers[sampleId]) return;
        const buffer = yield loadAudioBuffer(context, urls[sampleId], storage);
        if (buffer) buffers[sampleId] = buffer;
        return buffers;
      }))
    );
  });
}
function fetchWebSfz(url, storage) {
  return __async(this, null, function* () {
    try {
      const response = yield fetch(url);
      const json = yield response.json();
      return json;
    } catch (error) {
      console.warn(`Can't load SFZ file ${url}`, error);
      throw new Error(`Can't load SFZ file ${url}`);
    }
  });
}
function getWebsfzGroupUrls(websfz, group) {
  var _a, _b, _c, _d;
  const urls = {};
  const baseUrl = (_a = websfz.meta.baseUrl) != null ? _a : "";
  const format = (_c = findFirstSupportedFormat((_b = websfz.meta.formats) != null ? _b : [])) != null ? _c : "ogg";
  const prefix = (_d = websfz.global["default_path"]) != null ? _d : "";
  if (!group) return urls;
  return group.regions.reduce((urls2, region) => {
    if (region.sample) {
      urls2[region.sample] = `${baseUrl}/${prefix}${region.sample}.${format}`;
    }
    return urls2;
  }, urls);
}

// src/sfz/sfz-regions.ts
function checkRange(value, low, hi) {
  const isAboveLow = low === void 0 || value !== void 0 && value >= low;
  const isBelowHi = hi === void 0 || value !== void 0 && value <= hi;
  return isAboveLow && isBelowHi;
}
function findRegions(websfz, note) {
  const regions = [];
  for (const group of websfz.groups) {
    if (checkRange(note.midi, group.lokey, group.hikey) && checkRange(note.velocity, group.lovel, group.hivel) && checkRange(note.cc64, group.locc64, group.hicc64)) {
      for (const region of group.regions) {
        if (checkRange(note.midi, region.lokey, region.hikey) && checkRange(note.velocity, region.lovel, region.hivel) && checkRange(note.cc64, group.locc64, group.hicc64)) {
          regions.push([group, region]);
        }
      }
    }
  }
  return regions;
}

// src/sfz/sfz-sampler.ts
var EMPTY_WEBSFZ = Object.freeze({
  meta: {},
  global: {},
  groups: []
});
var _websfz, _SfzSampler_instances, startLayers_fn;
var SfzSampler = class {
  constructor(context, options) {
    this.context = context;
    __privateAdd(this, _SfzSampler_instances);
    __privateAdd(this, _websfz);
    this.options = Object.freeze(
      Object.assign(
        {
          volume: 100,
          velocity: 100,
          storage: HttpStorage,
          detune: 0,
          destination: context.destination
        },
        options
      )
    );
    this.player = new DefaultPlayer(context, options);
    __privateSet(this, _websfz, EMPTY_WEBSFZ);
    this.load = SfzInstrumentLoader(options.instrument, this.options.storage).then((result) => {
      __privateSet(this, _websfz, Object.freeze(result));
      return loadSfzBuffers(
        context,
        this.player.buffers,
        __privateGet(this, _websfz),
        this.options.storage
      );
    }).then(() => this);
  }
  get output() {
    return this.player.output;
  }
  loaded() {
    return __async(this, null, function* () {
      console.warn("deprecated: use load instead");
      return this.load;
    });
  }
  start(sample) {
    __privateMethod(this, _SfzSampler_instances, startLayers_fn).call(this, typeof sample === "object" ? sample : { note: sample });
  }
  stop(sample) {
    this.player.stop(sample);
  }
  disconnect() {
    this.player.disconnect();
  }
};
_websfz = new WeakMap();
_SfzSampler_instances = new WeakSet();
startLayers_fn = function(sample) {
  var _a;
  const midi = toMidi(sample.note);
  if (midi === void 0) return () => void 0;
  const velocity = (_a = sample.velocity) != null ? _a : this.options.velocity;
  const regions = findRegions(__privateGet(this, _websfz), { midi, velocity });
  const onEnded = () => {
    var _a2;
    (_a2 = sample.onEnded) == null ? void 0 : _a2.call(sample, sample);
  };
  const stopAll = regions.map(([group, region]) => {
    var _a2, _b, _c;
    let target = (_b = (_a2 = region.pitch_keycenter) != null ? _a2 : region.key) != null ? _b : midi;
    const detune = (midi - target) * 100;
    return this.player.start(__spreadProps(__spreadValues({}, sample), {
      note: region.sample,
      decayTime: sample.decayTime,
      detune: detune + ((_c = sample.detune) != null ? _c : this.options.detune),
      onEnded,
      stopId: midi
    }));
  });
  switch (stopAll.length) {
    case 0:
      return () => void 0;
    case 1:
      return stopAll[0];
    default:
      return (time) => stopAll.forEach((stop) => stop(time));
  }
};

// src/tremolo.ts
function createTremolo(context, depth) {
  const input = context.createGain();
  const output = context.createGain();
  input.channelCount = 2;
  input.channelCountMode = "explicit";
  const splitter = context.createChannelSplitter(2);
  const ampL = context.createGain();
  const ampR = context.createGain();
  const merger = context.createChannelMerger(2);
  const lfoL = context.createOscillator();
  lfoL.type = "sine";
  lfoL.frequency.value = 1;
  lfoL.start();
  const lfoLAmp = context.createGain();
  const lfoR = context.createOscillator();
  lfoR.type = "sine";
  lfoR.frequency.value = 1.1;
  lfoR.start();
  const lfoRAmp = context.createGain();
  input.connect(splitter);
  splitter.connect(ampL, 0);
  splitter.connect(ampR, 1);
  ampL.connect(merger, 0, 0);
  ampR.connect(merger, 0, 1);
  lfoL.connect(lfoLAmp);
  lfoLAmp.connect(ampL.gain);
  lfoR.connect(lfoRAmp);
  lfoRAmp.connect(ampR.gain);
  merger.connect(output);
  const unsubscribe = depth((depth2) => {
    lfoLAmp.gain.value = depth2;
    lfoRAmp.gain.value = depth2;
  });
  input.disconnect = () => {
    unsubscribe();
    lfoL.stop();
    lfoR.stop();
    input.disconnect(splitter);
    splitter.disconnect(ampL, 0);
    splitter.disconnect(ampR, 1);
    ampL.disconnect(merger, 0, 0);
    ampR.disconnect(merger, 0, 1);
    lfoL.disconnect(ampL);
    lfoR.disconnect(ampR);
    merger.disconnect(output);
  };
  return { input, output };
}

// src/electric-piano.ts
function getElectricPianoNames() {
  return Object.keys(INSTRUMENTS2);
}
var INSTRUMENTS2 = {
  CP80: "./assets/gs-e-pianos/CP80/cp80.websfz.json",
  PianetT: "./assets/gs-e-pianos/Pianet T/pianet-t.websfz.json",
  WurlitzerEP200: "./assets/gs-e-pianos/Wurlitzer EP200/wurlitzer-ep200.websfz.json"
};
var ElectricPiano = class extends SfzSampler {
  constructor(context, options) {
    var _a;
    super(context, __spreadProps(__spreadValues({}, options), {
      instrument: (_a = INSTRUMENTS2[options.instrument]) != null ? _a : options.instrument
    }));
    const depth = createControl(0);
    this.tremolo = {
      level: (level) => depth.set(midiVelToGain(level))
    };
    const tremolo = createTremolo(context, depth.subscribe);
    this.output.addInsert(tremolo);
  }
};

// src/player/layers.ts
function createEmptySamplerInstrument(options = {}) {
  return { groups: [], options };
}
function createEmptyRegionGroup() {
  return { regions: [] };
}
function findSamplesInRegions(group, sample, seqNumber, options) {
  const results = [];
  const midi = toMidi(sample.note);
  if (midi === void 0) return results;
  for (const region of group.regions) {
    const found = findSampleInRegion(
      midi,
      seqNumber != null ? seqNumber : 0,
      sample,
      region,
      options
    );
    if (found) results.push(found);
  }
  return results;
}
function findFirstSampleInRegions(group, sample, seqNumber, options) {
  const midi = toMidi(sample.note);
  if (midi === void 0) return void 0;
  for (const region of group.regions) {
    const found = findSampleInRegion(
      midi,
      seqNumber != null ? seqNumber : 0,
      sample,
      region,
      options
    );
    if (found) return found;
  }
  return void 0;
}
function findSampleInRegion(midi, seqNum, sample, region, defaults) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B;
  const matchMidi = midi >= ((_a = region.midiLow) != null ? _a : 0) && midi < ((_b = region.midiHigh) != null ? _b : 127) + 1;
  if (!matchMidi) return void 0;
  const matchVelocity = sample.velocity === void 0 || sample.velocity >= ((_c = region.velLow) != null ? _c : 0) && sample.velocity <= ((_d = region.velHigh) != null ? _d : 127);
  if (!matchVelocity) return void 0;
  if (region.seqLength) {
    const currentSeq = seqNum % region.seqLength;
    const regionIndex = ((_e = region.seqPosition) != null ? _e : 1) - 1;
    if (currentSeq !== regionIndex) return void 0;
  }
  const semitones = midi - region.midiPitch;
  const velocity = (_f = sample.velocity) != null ? _f : defaults == null ? void 0 : defaults.velocity;
  const regionGainOffset = region.volume ? dbToGain(region.volume) : 0;
  const sampleGainOffset = (_h = (_g = sample.gainOffset) != null ? _g : defaults == null ? void 0 : defaults.gainOffset) != null ? _h : 0;
  const sampleDetune = (_i = sample.detune) != null ? _i : 0;
  return {
    decayTime: (_l = (_k = sample == null ? void 0 : sample.decayTime) != null ? _k : (_j = region.sample) == null ? void 0 : _j.decayTime) != null ? _l : defaults == null ? void 0 : defaults.decayTime,
    detune: 100 * (semitones + ((_m = region.tune) != null ? _m : 0)) + sampleDetune,
    duration: (_p = (_o = sample == null ? void 0 : sample.duration) != null ? _o : (_n = region.sample) == null ? void 0 : _n.duration) != null ? _p : defaults == null ? void 0 : defaults.duration,
    gainOffset: sampleGainOffset + regionGainOffset || void 0,
    loop: (_s = (_r = sample == null ? void 0 : sample.loop) != null ? _r : (_q = region.sample) == null ? void 0 : _q.loop) != null ? _s : defaults == null ? void 0 : defaults.loop,
    loopEnd: (_v = (_u = sample == null ? void 0 : sample.loopEnd) != null ? _u : (_t = region.sample) == null ? void 0 : _t.loopEnd) != null ? _v : defaults == null ? void 0 : defaults.loopEnd,
    loopStart: (_y = (_x = sample == null ? void 0 : sample.loopStart) != null ? _x : (_w = region.sample) == null ? void 0 : _w.loopStart) != null ? _y : defaults == null ? void 0 : defaults.loopStart,
    lpfCutoffHz: (_B = (_A = sample == null ? void 0 : sample.lpfCutoffHz) != null ? _A : (_z = region.sample) == null ? void 0 : _z.lpfCutoffHz) != null ? _B : defaults == null ? void 0 : defaults.lpfCutoffHz,
    name: region.sampleName,
    note: midi,
    onEnded: sample.onEnded,
    onStart: sample.onStart,
    stopId: sample.name,
    time: sample.time,
    velocity: velocity == void 0 ? void 0 : velocity
  };
}
function spreadRegions(regions) {
  if (regions.length === 0) return [];
  regions.sort((a, b) => a.midiPitch - b.midiPitch);
  regions[0].midiLow = 0;
  regions[0].midiHigh = 127;
  if (regions.length === 1) return regions;
  for (let i = 1; i < regions.length; i++) {
    const prev = regions[i - 1];
    const curr = regions[i];
    const mid = Math.floor((prev.midiPitch + curr.midiPitch) / 2);
    prev.midiHigh = mid;
    curr.midiLow = mid + 1;
  }
  regions[regions.length - 1].midiHigh = 127;
  return regions;
}

// src/player/region-player.ts
var RegionPlayer = class {
  constructor(context, options) {
    this.context = context;
    this.seqNum = 0;
    const channel = new Channel(context, options);
    this.instrument = createEmptySamplerInstrument(options);
    this.player = new QueuedPlayer(
      new SamplePlayer(context, __spreadProps(__spreadValues({}, options), { destination: channel.input })),
      options
    );
    this.output = channel;
  }
  get buffers() {
    return this.player.buffers;
  }
  start(sample) {
    const stopAll = [];
    const sampleStart = typeof sample === "object" ? sample : { note: sample };
    for (const group of this.instrument.groups) {
      const found = findSamplesInRegions(group, sampleStart, this.seqNum);
      this.seqNum++;
      for (const sample2 of found) {
        let stop = this.player.start(sample2);
        stopAll.push(stop);
      }
    }
    return (time) => stopAll.forEach((stop) => stop(time));
  }
  stop(sample) {
    if (sample == void 0) {
      this.player.stop();
      return;
    }
    const toStop = typeof sample === "object" ? sample : { stopId: sample };
    const midi = toMidi(toStop.stopId);
    if (!midi) return;
    toStop.stopId = midi;
    this.player.stop(toStop);
  }
  disconnect() {
    this.output.disconnect();
    this.player.disconnect();
  }
};

// src/sfz2.ts
function SfzInstrumentLoader2(url, config) {
  const audioExt = getPreferredAudioExtension();
  return (context, storage) => __async(this, null, function* () {
    const sfz = yield fetch(url).then((res) => res.text());
    const errors = sfzToLayer(sfz, config.group);
    if (errors.length) {
      console.warn("Problems converting sfz", errors);
    }
    const sampleNames = /* @__PURE__ */ new Set();
    config.group.regions.forEach((r) => sampleNames.add(r.sampleName));
    return Promise.all(
      Array.from(sampleNames).map((sampleName) => __async(this, null, function* () {
        const sampleUrl = config.urlFromSampleName(sampleName, audioExt);
        const buffer = yield loadAudioBuffer(context, sampleUrl, storage);
        config.buffers[sampleName] = buffer;
      }))
    ).then(() => config.group);
  });
}
function sfzToLayer(sfz, group) {
  let mode = "global";
  const tokens = sfz.split("\n").map(parseToken).filter((x) => !!x);
  const scope = new Scope();
  let errors = [];
  for (const token of tokens) {
    switch (token.type) {
      case "mode":
        errors.push(scope.closeScope(mode, group));
        mode = token.value;
        break;
      case "prop:num":
      case "prop:str":
      case "prop:num_arr":
        scope.push(token.key, token.value);
        break;
      case "unknown":
        console.warn("Unknown SFZ token", token.value);
        break;
    }
  }
  closeScope(mode, scope, group);
  return errors.filter((x) => !!x);
  function closeScope(mode2, scope2, group2) {
  }
}
var MODE_REGEX = /^<([^>]+)>$/;
var PROP_NUM_REGEX = /^([^=]+)=([-\.\d]+)$/;
var PROP_STR_REGEX = /^([^=]+)=(.+)$/;
var PROP_NUM_ARR_REGEX = /^([^=]+)_(\d+)=(\d+)$/;
function parseToken(line) {
  line = line.trim();
  if (line === "") return void 0;
  if (line.startsWith("//")) return void 0;
  const modeMatch = line.match(MODE_REGEX);
  if (modeMatch) return { type: "mode", value: modeMatch[1] };
  const propNumArrMatch = line.match(PROP_NUM_ARR_REGEX);
  if (propNumArrMatch)
    return {
      type: "prop:num_arr",
      key: propNumArrMatch[1],
      value: [Number(propNumArrMatch[2]), Number(propNumArrMatch[3])]
    };
  const propNumMatch = line.match(PROP_NUM_REGEX);
  if (propNumMatch)
    return {
      type: "prop:num",
      key: propNumMatch[1],
      value: Number(propNumMatch[2])
    };
  const propStrMatch = line.match(PROP_STR_REGEX);
  if (propStrMatch)
    return {
      type: "prop:str",
      key: propStrMatch[1],
      value: propStrMatch[2]
    };
  return { type: "unknown", value: line };
}
var _Scope_instances, closeRegion_fn;
var Scope = class {
  constructor() {
    __privateAdd(this, _Scope_instances);
    this.values = {};
    this.global = {};
    this.group = {};
  }
  closeScope(mode, group) {
    if (mode === "global") {
      __privateMethod(this, _Scope_instances, closeRegion_fn).call(this, this.global);
    } else if (mode === "group") {
      this.group = __privateMethod(this, _Scope_instances, closeRegion_fn).call(this, {});
    } else if (mode === "region") {
      const region = __privateMethod(this, _Scope_instances, closeRegion_fn).call(this, __spreadValues(__spreadValues({
        sampleName: "",
        midiPitch: -1
      }, this.global), this.group));
      if (region.sampleName === "") {
        return "Missing sample name";
      }
      if (region.midiPitch === -1) {
        if (region.midiLow !== void 0) {
          region.midiPitch = region.midiLow;
        } else {
          return "Missing pitch_keycenter";
        }
      }
      if (region.seqLength && region.seqPosition === void 0) {
        region.seqPosition = 1;
      }
      if (region.ampRelease) {
        region.sample = { decayTime: region.ampRelease };
        delete region.ampRelease;
      }
      group.regions.push(region);
    }
  }
  get empty() {
    return Object.keys(this.values).length === 0;
  }
  get keys() {
    return Object.keys(this.values);
  }
  push(key, value) {
    this.values[key] = value;
  }
  popNum(key, dest, destKey) {
    if (typeof this.values[key] !== "number") return false;
    dest[destKey] = this.values[key];
    delete this.values[key];
    return true;
  }
  popStr(key, dest, destKey) {
    if (typeof this.values[key] !== "string") return false;
    dest[destKey] = this.values[key];
    delete this.values[key];
    return true;
  }
  popNumArr(key, dest, destKey) {
    if (!Array.isArray(this.values[key])) return false;
    dest[destKey] = this.values[key];
    delete this.values[key];
    return true;
  }
};
_Scope_instances = new WeakSet();
closeRegion_fn = function(region) {
  this.popStr("sample", region, "sampleName");
  this.popNum("pitch_keycenter", region, "midiPitch");
  this.popNum("ampeg_attack", region, "ampAttack");
  this.popNum("ampeg_release", region, "ampRelease");
  this.popNum("bend_down", region, "bendDown");
  this.popNum("bend_up", region, "bendUp");
  this.popNum("group", region, "group");
  this.popNum("hikey", region, "midiHigh");
  this.popNum("hivel", region, "velHigh");
  this.popNum("lokey", region, "midiLow");
  this.popNum("offset", region, "offset");
  this.popNum("lovel", region, "velLow");
  this.popNum("off_by", region, "groupOffBy");
  this.popNum("pitch_keytrack", region, "ignore");
  this.popNum("seq_length", region, "seqLength");
  this.popNum("seq_position", region, "seqPosition");
  this.popNum("tune", region, "tune");
  this.popNum("volume", region, "volume");
  this.popNumArr("amp_velcurve", region, "ampVelCurve");
  this.values = {};
  return region;
};

// src/versilian.ts
var instruments = [];
var BASE_URL = "https://smpldsnds.github.io/sgossner-vcsl/";
function getVersilianInstruments() {
  return __async(this, null, function* () {
    if (instruments.length) return instruments;
    instruments = yield fetch(BASE_URL + "sfz_files.json").then(
      (res) => res.json()
    );
    return instruments;
  });
}
function getVcslInstrumentSfzUrl(instrument) {
  return BASE_URL + instrument + ".sfz";
}
function VcslInstrumentLoader(instrument, buffers) {
  const url = getVcslInstrumentSfzUrl(instrument);
  const base = instrument.slice(0, instrument.lastIndexOf("/") + 1);
  const sampleBase = `https://smpldsnds.github.io/sgossner-vcsl/${base}`;
  const group = createEmptyRegionGroup();
  return SfzInstrumentLoader2(url, {
    buffers,
    group,
    urlFromSampleName: (sampleName, audioExt) => {
      return sampleBase + "/" + sampleName.replace(".wav", audioExt);
    }
  });
}
var Versilian = class {
  constructor(context, options = {}) {
    var _a, _b;
    this.config = {
      instrument: (_a = options.instrument) != null ? _a : "Arco",
      storage: (_b = options.storage) != null ? _b : HttpStorage
    };
    this.player = new RegionPlayer(context, options);
    const loader = VcslInstrumentLoader(
      this.config.instrument,
      this.player.buffers
    );
    this.load = loader(context, this.config.storage).then((group) => {
      this.player.instrument.groups.push(group);
      return this;
    });
  }
  get output() {
    return this.player.output;
  }
  get buffers() {
    return this.player.buffers;
  }
  get context() {
    return this.player.context;
  }
  start(sample) {
    return this.player.start(sample);
  }
  stop(sample) {
    return this.player.stop(sample);
  }
  disconnect() {
    this.player.disconnect();
  }
};

// src/mallet.ts
function getMalletNames() {
  return Object.keys(NAME_TO_PATH);
}
var Mallet = class extends Versilian {
  constructor(context, options) {
    var _a;
    super(context, __spreadProps(__spreadValues({}, options), {
      instrument: NAME_TO_PATH[(_a = options.instrument) != null ? _a : ""]
    }));
  }
};
var NAME_TO_PATH = {
  "Balafon - Hard Mallet": "Idiophones/Struck Idiophones/Balafon - Hard Mallet",
  "Balafon - Keyswitch": "Idiophones/Struck Idiophones/Balafon - Keyswitch",
  "Balafon - Soft Mallet": "Idiophones/Struck Idiophones/Balafon - Soft Mallet",
  "Balafon - Traditional Mallet": "Idiophones/Struck Idiophones/Balafon - Traditional Mallet",
  "Tubular Bells 1": "Idiophones/Struck Idiophones/Tubular Bells 1",
  "Tubular Bells 2": "Idiophones/Struck Idiophones/Tubular Bells 2",
  "Vibraphone - Bowed": "Idiophones/Struck Idiophones/Vibraphone - Bowed",
  "Vibraphone - Hard Mallets": "Idiophones/Struck Idiophones/Vibraphone - Hard Mallets",
  "Vibraphone - Keyswitch": "Idiophones/Struck Idiophones/Vibraphone - Keyswitch",
  "Vibraphone - Soft Mallets": "Idiophones/Struck Idiophones/Vibraphone - Soft Mallets",
  "Xylophone - Hard Mallets": "Idiophones/Struck Idiophones/Xylophone - Hard Mallets",
  "Xylophone - Keyswitch": "Idiophones/Struck Idiophones/Xylophone - Keyswitch",
  "Xylophone - Medium Mallets": "Idiophones/Struck Idiophones/Xylophone - Medium Mallets",
  "Xylophone - Soft Mallets": "Idiophones/Struck Idiophones/Xylophone - Soft Mallets"
};

// src/mellotron.ts
var INSTRUMENT_VARIATIONS = {
  "300 STRINGS CELLO": ["300 STRINGS", "CELL"],
  "300 STRINGS VIOLA": ["300 STRINGS", "VIOL"]
};
function getMellotronNames() {
  return [
    "300 STRINGS CELLO",
    "300 STRINGS VIOLA",
    "8VOICE CHOIR",
    "BASSA+STRNGS",
    "BOYS CHOIR",
    "CHA CHA FLT",
    "CHM CLARINET",
    "CHMB 3 VLNS",
    "CHMB ALTOSAX",
    "CHMB FEMALE",
    "CHMB MALE VC",
    "CHMB TNR SAX",
    "CHMB TRMBONE",
    "CHMB TRUMPET",
    "CHMBLN CELLO",
    "CHMBLN FLUTE",
    "CHMBLN OBOE",
    "DIXIE+TRMBN",
    "FOXTROT+SAX",
    "HALFSP.BRASS",
    "MIXED STRGS",
    "MKII BRASS",
    "MKII GUITAR",
    "MKII ORGAN",
    "MKII SAX",
    "MKII VIBES",
    "MKII VIOLINS",
    "MOVE BS+STGS",
    "STRGS+BRASS",
    "TROMB+TRMPT",
    "TRON 16VLNS",
    "TRON CELLO",
    "TRON FLUTE",
    "TRON VIOLA"
  ];
}
var Mellotron = class {
  constructor(context, options) {
    this.context = context;
    this.options = options;
    this.config = getMellotronConfig(options);
    this.player = new DefaultPlayer(context, options);
    this.group = createEmptyRegionGroup();
    const loader = loadMellotronInstrument(
      this.config.instrument,
      this.player.buffers,
      this.group
    );
    this.load = loader(context, this.config.storage).then(() => this);
  }
  get buffers() {
    return this.player.buffers;
  }
  get output() {
    return this.player.output;
  }
  start(sample) {
    const found = findFirstSampleInRegions(
      this.group,
      typeof sample === "object" ? sample : { note: sample },
      void 0,
      this.options
    );
    if (!found) return () => void 0;
    return this.player.start(found);
  }
  stop(sample) {
    this.player.stop(sample);
  }
  disconnect() {
    this.player.disconnect();
  }
};
function getMellotronConfig(options) {
  var _a, _b;
  return {
    instrument: (_a = options.instrument) != null ? _a : "MKII VIOLINS",
    storage: (_b = options.storage) != null ? _b : HttpStorage
  };
}
function loadMellotronInstrument(instrument, buffers, group) {
  let variation = INSTRUMENT_VARIATIONS[instrument];
  if (variation) instrument = variation[0];
  return (context, storage) => {
    const baseUrl = `https://smpldsnds.github.io/archiveorg-mellotron/${instrument}/`;
    const audioExt = getPreferredAudioExtension();
    return fetch(baseUrl + "files.json").then((res) => res.json()).then(
      (sampleNames) => Promise.all(
        sampleNames.map((sampleName) => {
          var _a;
          if (variation && !sampleName.includes(variation[1])) return;
          const midi = toMidi((_a = sampleName.split(" ")[0]) != null ? _a : "");
          if (!midi) return;
          const sampleUrl = baseUrl + sampleName + audioExt;
          loadAudioBuffer(context, sampleUrl, storage).then((audioBuffer) => {
            var _a2;
            buffers[sampleName] = audioBuffer;
            const duration = (_a2 = audioBuffer == null ? void 0 : audioBuffer.duration) != null ? _a2 : 0;
            group.regions.push({
              sampleName,
              midiPitch: midi,
              sample: {
                loop: true,
                loopStart: duration / 10,
                loopEnd: duration - duration / 10
              }
            });
          });
        })
      )
    ).then(() => {
      spreadRegions(group.regions);
    });
  };
}

// src/sampler.ts
var _options;
var Sampler = class {
  constructor(context, options = {}) {
    this.context = context;
    __privateAdd(this, _options);
    var _a, _b, _c, _d, _e, _f;
    __privateSet(this, _options, {
      destination: (_a = options.destination) != null ? _a : context.destination,
      detune: 0,
      volume: (_b = options.volume) != null ? _b : 100,
      velocity: (_c = options.velocity) != null ? _c : 100,
      buffers: (_d = options.buffers) != null ? _d : {},
      volumeToGain: (_e = options.volumeToGain) != null ? _e : midiVelToGain
    });
    this.player = new DefaultPlayer(context, __privateGet(this, _options));
    const storage = (_f = options.storage) != null ? _f : HttpStorage;
    const loader = typeof __privateGet(this, _options).buffers === "function" ? __privateGet(this, _options).buffers : createAudioBuffersLoader(__privateGet(this, _options).buffers, storage);
    this.load = loader(context, this.player.buffers).then(() => this);
  }
  loaded() {
    return __async(this, null, function* () {
      console.warn("deprecated: use load instead");
      return this.load;
    });
  }
  get output() {
    return this.player.output;
  }
  start(sample) {
    return this.player.start(
      typeof sample === "object" ? sample : { note: sample }
    );
  }
  stop(sample) {
    return this.player.stop(
      typeof sample === "object" ? sample : sample === void 0 ? void 0 : { stopId: sample }
    );
  }
  disconnect() {
    return this.player.disconnect();
  }
};
_options = new WeakMap();
function createAudioBuffersLoader(source, storage) {
  return (context, buffers) => __async(this, null, function* () {
    yield Promise.all([
      Object.keys(source).map((key) => __async(this, null, function* () {
        const value = source[key];
        if (value instanceof AudioBuffer) {
          buffers[key] = value;
        } else if (typeof value === "string") {
          const buffer = yield loadAudioBuffer(context, value, storage);
          if (buffer) buffers[key] = buffer;
        }
      }))
    ]);
  });
}

// src/smolken.ts
function getSmolkenNames() {
  return ["Pizzicato", "Arco", "Switched"];
}
function getSmolkenUrl(instrument) {
  const FILES = {
    Arco: "arco",
    Pizzicato: "pizz",
    Switched: "switched"
  };
  return `https://smpldsnds.github.io/sfzinstruments-dsmolken-double-bass/d_smolken_rubner_bass_${FILES[instrument]}.sfz`;
}
var Smolken = class {
  constructor(context, options = {}) {
    this.seqNum = 0;
    var _a, _b;
    this.config = {
      instrument: (_a = options.instrument) != null ? _a : "Arco",
      storage: (_b = options.storage) != null ? _b : HttpStorage
    };
    this.player = new DefaultPlayer(context, options);
    this.group = createEmptyRegionGroup();
    const url = getSmolkenUrl(this.config.instrument);
    const loader = SfzInstrumentLoader2(url, {
      buffers: this.player.buffers,
      group: this.group,
      urlFromSampleName: (sampleName, audioExt) => {
        const samplePath = sampleName.replace("\\", "/").replace(".wav", audioExt);
        return `https://smpldsnds.github.io/sfzinstruments-dsmolken-double-bass/${samplePath}`;
      }
    });
    this.load = loader(context, this.config.storage).then(() => this);
  }
  get output() {
    return this.player.output;
  }
  get buffers() {
    return this.player.buffers;
  }
  get context() {
    return this.player.context;
  }
  start(sample) {
    const found = findSamplesInRegions(
      this.group,
      typeof sample === "object" ? sample : { note: sample },
      this.seqNum
    );
    this.seqNum++;
    const stopAll = found.map((sample2) => this.player.start(sample2));
    return (time) => stopAll.forEach((stop) => stop(time));
  }
  stop(sample) {
    if (sample == void 0) {
      this.player.stop();
      return;
    }
    const toStop = typeof sample === "object" ? sample : { stopId: sample };
    const midi = toMidi(toStop.stopId);
    if (!midi) return;
    toStop.stopId = midi;
    this.player.stop(toStop);
  }
  disconnect() {
    this.player.disconnect();
  }
};

// src/soundfont/soundfont-instrument.ts
function gleitzKitUrl(name, kit) {
  var _a;
  const format = (_a = findFirstSupportedFormat(["ogg", "mp3"])) != null ? _a : "mp3";
  return `https://gleitz.github.io/midi-js-soundfonts/${kit}/${name}-${format}.js`;
}
function soundfontInstrumentLoader(url, buffers, group) {
  return (context, storage) => __async(this, null, function* () {
    const sourceFile = yield (yield storage.fetch(url)).text();
    const json = midiJsToJson(sourceFile);
    const noteNames = Object.keys(json);
    yield Promise.all(
      noteNames.map((noteName) => __async(this, null, function* () {
        const midi = toMidi(noteName);
        if (!midi) return;
        const audioData = base64ToArrayBuffer(
          removeBase64Prefix(json[noteName])
        );
        const buffer = yield context.decodeAudioData(audioData);
        buffers[noteName] = buffer;
        group.regions.push({
          sampleName: noteName,
          midiPitch: midi
        });
      }))
    );
    spreadRegions(group.regions);
  });
}
function midiJsToJson(source) {
  const header = source.indexOf("MIDI.Soundfont.");
  if (header < 0) throw Error("Invalid MIDI.js Soundfont format");
  const start = source.indexOf("=", header) + 2;
  const end = source.lastIndexOf(",");
  return JSON.parse(source.slice(start, end) + "}");
}
function removeBase64Prefix(audioBase64) {
  return audioBase64.slice(audioBase64.indexOf(",") + 1);
}
function base64ToArrayBuffer(base64) {
  const decoded = window.atob(base64);
  const len = decoded.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes.buffer;
}
var SOUNDFONT_KITS = ["MusyngKite", "FluidR3_GM"];
var SOUNDFONT_INSTRUMENTS = [
  "accordion",
  "acoustic_bass",
  "acoustic_grand_piano",
  "acoustic_guitar_nylon",
  "acoustic_guitar_steel",
  "agogo",
  "alto_sax",
  "applause",
  "bagpipe",
  "banjo",
  "baritone_sax",
  "bassoon",
  "bird_tweet",
  "blown_bottle",
  "brass_section",
  "breath_noise",
  "bright_acoustic_piano",
  "celesta",
  "cello",
  "choir_aahs",
  "church_organ",
  "clarinet",
  "clavinet",
  "contrabass",
  "distortion_guitar",
  "drawbar_organ",
  "dulcimer",
  "electric_bass_finger",
  "electric_bass_pick",
  "electric_grand_piano",
  "electric_guitar_clean",
  "electric_guitar_jazz",
  "electric_guitar_muted",
  "electric_piano_1",
  "electric_piano_2",
  "english_horn",
  "fiddle",
  "flute",
  "french_horn",
  "fretless_bass",
  "fx_1_rain",
  "fx_2_soundtrack",
  "fx_3_crystal",
  "fx_4_atmosphere",
  "fx_5_brightness",
  "fx_6_goblins",
  "fx_7_echoes",
  "fx_8_scifi",
  "glockenspiel",
  "guitar_fret_noise",
  "guitar_harmonics",
  "gunshot",
  "harmonica",
  "harpsichord",
  "helicopter",
  "honkytonk_piano",
  "kalimba",
  "koto",
  "lead_1_square",
  "lead_2_sawtooth",
  "lead_3_calliope",
  "lead_4_chiff",
  "lead_5_charang",
  "lead_6_voice",
  "lead_7_fifths",
  "lead_8_bass__lead",
  "marimba",
  "melodic_tom",
  "music_box",
  "muted_trumpet",
  "oboe",
  "ocarina",
  "orchestra_hit",
  "orchestral_harp",
  "overdriven_guitar",
  "pad_1_new_age",
  "pad_2_warm",
  "pad_3_polysynth",
  "pad_4_choir",
  "pad_5_bowed",
  "pad_6_metallic",
  "pad_7_halo",
  "pad_8_sweep",
  "pan_flute",
  "percussive_organ",
  "piccolo",
  "pizzicato_strings",
  "recorder",
  "reed_organ",
  "reverse_cymbal",
  "rock_organ",
  "seashore",
  "shakuhachi",
  "shamisen",
  "shanai",
  "sitar",
  "slap_bass_1",
  "slap_bass_2",
  "soprano_sax",
  "steel_drums",
  "string_ensemble_1",
  "string_ensemble_2",
  "synth_bass_1",
  "synth_bass_2",
  "synth_brass_1",
  "synth_brass_2",
  "synth_choir",
  "synth_drum",
  "synth_strings_1",
  "synth_strings_2",
  "taiko_drum",
  "tango_accordion",
  "telephone_ring",
  "tenor_sax",
  "timpani",
  "tinkle_bell",
  "tremolo_strings",
  "trombone",
  "trumpet",
  "tuba",
  "tubular_bells",
  "vibraphone",
  "viola",
  "violin",
  "voice_oohs",
  "whistle",
  "woodblock",
  "xylophone"
];

// src/soundfont/soundfont-loops.ts
function getGoldstSoundfontLoopsUrl(instrument, kit) {
  if (instrument.startsWith("http")) return void 0;
  return `https://goldst.dev/midi-js-soundfonts/${kit}/${instrument}-loop.json`;
}
function fetchSoundfontLoopData(url, sampleRate = 44100) {
  return __async(this, null, function* () {
    if (!url) return void 0;
    try {
      const req = yield fetch(url);
      if (req.status !== 200) return;
      const raw = yield req.json();
      const loopData = {};
      Object.keys(raw).forEach((key) => {
        const midi = toMidi(key);
        if (midi) {
          const offsets = raw[key];
          loopData[midi] = [offsets[0] / sampleRate, offsets[1] / sampleRate];
        }
      });
      return loopData;
    } catch (err) {
      return void 0;
    }
  });
}

// src/soundfont/soundfont.ts
function getSoundfontKits() {
  return SOUNDFONT_KITS;
}
function getSoundfontNames() {
  return SOUNDFONT_INSTRUMENTS;
}
var _hasLoops;
var Soundfont = class {
  constructor(context, options) {
    this.context = context;
    __privateAdd(this, _hasLoops);
    this.config = getSoundfontConfig(options);
    this.player = new DefaultPlayer(context, options);
    this.group = createEmptyRegionGroup();
    __privateSet(this, _hasLoops, false);
    const loader = soundfontLoader(
      this.config.instrumentUrl,
      this.config.loopDataUrl,
      this.player.buffers,
      this.group
    );
    this.load = loader(context, this.config.storage).then((hasLoops) => {
      __privateSet(this, _hasLoops, hasLoops);
      return this;
    });
    const gain = context.createGain();
    gain.gain.value = this.config.extraGain;
    this.player.output.addInsert(gain);
  }
  get output() {
    return this.player.output;
  }
  get hasLoops() {
    return __privateGet(this, _hasLoops);
  }
  loaded() {
    return __async(this, null, function* () {
      console.warn("deprecated: use load instead");
      return this.load;
    });
  }
  disconnect() {
    this.player.disconnect();
  }
  start(sample) {
    const found = findFirstSampleInRegions(
      this.group,
      typeof sample === "object" ? sample : { note: sample }
    );
    if (!found) return () => void 0;
    return this.player.start(found);
  }
  stop(sample) {
    return this.player.stop(sample);
  }
};
_hasLoops = new WeakMap();
function soundfontLoader(url, loopsUrl, buffers, group) {
  const loadInstrument = soundfontInstrumentLoader(url, buffers, group);
  return (context, storage) => __async(this, null, function* () {
    const [_, loops] = yield Promise.all([
      loadInstrument(context, storage),
      fetchSoundfontLoopData(loopsUrl)
    ]);
    if (loops) {
      group.regions.forEach((region) => {
        var _a;
        const loop = loops[region.midiPitch];
        if (loop) {
          (_a = region.sample) != null ? _a : region.sample = {};
          region.sample.loop = true;
          region.sample.loopStart = loop[0];
          region.sample.loopEnd = loop[1];
        }
      });
    }
    return !!loops;
  });
}
function getSoundfontConfig(options) {
  var _a, _b, _c, _d;
  if (!options.instrument && !options.instrumentUrl) {
    throw Error("Soundfont: instrument or instrumentUrl is required");
  }
  const config = {
    kit: "MusyngKite",
    instrument: options.instrument,
    storage: (_a = options.storage) != null ? _a : HttpStorage,
    // This is to compensate the low volume of the original samples
    extraGain: (_b = options.extraGain) != null ? _b : 5,
    loadLoopData: (_c = options.loadLoopData) != null ? _c : false,
    loopDataUrl: options.loopDataUrl,
    instrumentUrl: (_d = options.instrumentUrl) != null ? _d : ""
  };
  if (config.instrument && config.instrument.startsWith("http")) {
    console.warn(
      "Use 'instrumentUrl' instead of 'instrument' to load from a URL"
    );
    config.instrumentUrl = config.instrument;
    config.instrument = void 0;
  }
  if (config.instrument && !config.instrumentUrl) {
    config.instrumentUrl = gleitzKitUrl(config.instrument, config.kit);
  }
  if (config.loadLoopData && config.instrument && !config.loopDataUrl) {
    config.loopDataUrl = getGoldstSoundfontLoopsUrl(
      config.instrument,
      config.kit
    );
  }
  return config;
}

// src/soundfont2.ts
var _instrumentNames;
var Soundfont2Sampler = class {
  constructor(context, options) {
    this.context = context;
    this.options = options;
    __privateAdd(this, _instrumentNames, []);
    this.player = new RegionPlayer(context, options);
	
	if (options.soundfont) {	// BAO
		  this.soundfont = options.soundfont;	
		__privateSet(this, _instrumentNames, this.soundfont.instruments.map((instrument) => instrument.header.name));		
		
	} else {
		this.load = loadSoundfont(options).then((soundfont) => {
		  this.soundfont = soundfont;
		  __privateSet(this, _instrumentNames, soundfont.instruments.map((instrument) => instrument.header.name));
		}).then(() => this);
	}
  }
  get instrumentNames() {
    return __privateGet(this, _instrumentNames);
  }
  loadInstrument(instrumentName) {
    var _a, _b, _c;
    const sf2instrument = (_a = this.soundfont) == null ? void 0 : _a.instruments.find(
      (inst) => inst.header.name === instrumentName
    );
    if (!sf2instrument) return;
    const buffers = this.player.buffers;
    const group = {
      regions: []
    };
    for (const zone of sf2instrument.zones) {
      const sample = zone.sample;
      const header = sample.header;
      const buffer = getAudioBufferFromSample(this.context, sample);
      let region = {
        sampleName: sample.header.name,
        midiPitch: sample.header.originalPitch,
        midiLow: (_b = zone.keyRange) == null ? void 0 : _b.lo,
        midiHigh: (_c = zone.keyRange) == null ? void 0 : _c.hi,
        sample: {
          loop: header.startLoop >= 0 && header.endLoop > header.startLoop,
          loopStart: header.startLoop / header.sampleRate,
          loopEnd: header.endLoop / header.sampleRate
        }
      };
      group.regions.push(region);
      buffers[region.sampleName] = buffer;
    }
    const instrument = {
      groups: [group],
      options: this.options
    };
    this.player.instrument = instrument;
    return [instrument, buffers];
  }
  get output() {
    return this.player.output;
  }
  start(sample) {
    return this.player.start(sample);
  }
  stop(sample) {
    return this.player.stop(sample);
  }
  disconnect() {
    this.player.disconnect();
  }
};
_instrumentNames = new WeakMap();
function getAudioBufferFromSample(context, sample) {
  const { header, data: int16 } = sample;
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768;
  }
  const audioBuffer = context.createBuffer(
    1,
    float32.length,
    header.sampleRate
  );
  const channelData = audioBuffer.getChannelData(0);
  channelData.set(float32);
  return audioBuffer;
}
function loadSoundfont(options) {
  return __async(this, null, function* () {
    const buffer = yield fetch(options.url).then((res) => res.arrayBuffer());
    const data = new Uint8Array(buffer);
    return options.createSoundfont(data);
  });
}

// src/splendid-grand-piano.ts
var BASE_URL2 = "./assets/splendid-grand-piano";
var _SplendidGrandPiano_instances, sampleToMidi_fn;
var SplendidGrandPiano = class {
  constructor(context, options) {
    this.context = context;
    __privateAdd(this, _SplendidGrandPiano_instances);
    this.options = Object.assign(
      {
        baseUrl: BASE_URL2,
        storage: HttpStorage,
        detune: 0,
        volume: 127,
        velocity: 100,
        decayTime: 0.5
      },
      options
    );
    this.player = new DefaultPlayer(context, this.options);
    const loader = splendidGrandPianoLoader(
      this.options.baseUrl,
      this.options.storage,
      this.options.notesToLoad
    );
    this.load = loader(context, this.player.buffers).then(() => this);
  }
  get output() {
    return this.player.output;
  }
  get buffers() {
    return this.player.buffers;
  }
  loaded() {
    return __async(this, null, function* () {
      console.warn("deprecated: use load instead");
      return this.load;
    });
  }
  start(sampleOrNote) {
    var _a, _b;
    const sample = typeof sampleOrNote === "object" ? __spreadValues({}, sampleOrNote) : { note: sampleOrNote };
    const found = __privateMethod(this, _SplendidGrandPiano_instances, sampleToMidi_fn).call(this, sample);
    if (!found) return () => void 0;
    sample.note = found[0];
    sample.stopId = (_a = sample.stopId) != null ? _a : found[1];
    sample.detune = found[2] + ((_b = sample.detune) != null ? _b : this.options.detune);
    return this.player.start(sample);
  }
  stop(sample) {
    var _a;
    if (typeof sample === "string") {
      return this.player.stop((_a = toMidi(sample)) != null ? _a : sample);
    } else if (typeof sample === "object") {
      const midi = toMidi(sample.stopId);
      return this.player.stop(
        midi !== void 0 ? __spreadProps(__spreadValues({}, sample), { stopId: midi }) : sample
      );
    } else {
      return this.player.stop(sample);
    }
  }
};
_SplendidGrandPiano_instances = new WeakSet();
sampleToMidi_fn = function(sample) {
  var _a;
  const midi = toMidi(sample.note);
  if (!midi) return;
  const vel = (_a = sample.velocity) != null ? _a : this.options.velocity;
  const layerIdx = LAYERS.findIndex(
    (layer2) => vel >= layer2.vel_range[0] && vel <= layer2.vel_range[1]
  );
  const layer = LAYERS[layerIdx];
  if (!layer) return;
  return findNearestMidiInLayer(layer.name, midi, this.player.buffers);
};
function findNearestMidiInLayer(prefix, midi, buffers) {
  let i = 0;
  while (buffers[prefix + (midi + i)] === void 0 && i < 128) {
    if (i > 0) i = -i;
    else i = -i + 1;
  }
  return i === 127 ? [prefix + midi, midi, 0] : [prefix + (midi + i), midi, -i * 100];
}
function splendidGrandPianoLoader(baseUrl, storage, notesToLoad) {
  var _a;
  const format = (_a = findFirstSupportedFormat(["ogg", "m4a"])) != null ? _a : "ogg";
  let layers = notesToLoad ? LAYERS.filter(
    (layer) => layer.vel_range[0] <= notesToLoad.velocityRange[1] && layer.vel_range[1] >= notesToLoad.velocityRange[0]
  ) : LAYERS;
  return (context, buffers) => __async(this, null, function* () {
    for (const layer of layers) {
      const samples = notesToLoad ? layer.samples.filter(
        (sample) => notesToLoad.notes.includes(sample[0])
      ) : layer.samples;
      yield Promise.all(
        samples.map((_0) => __async(this, [_0], function* ([midi, name]) {
          const url = `${baseUrl}/${name}.${format}`;
          const buffer = yield loadAudioBuffer(context, url, storage);
          if (buffer) buffers[layer.name + midi] = buffer;
        }))
      );
    }
  });
}
var LAYERS = [
  {
    name: "PPP",
    vel_range: [1, 40],
    cutoff: 1e3,
    samples: [
      [23, "PP-B-1"],
      [27, "PP-D#0"],
      [29, "PP-F0"],
      [31, "PP-G0"],
      [33, "PP-A0"],
      [35, "PP-B0"],
      [37, "PP-C#1"],
      [38, "PP-D1"],
      [40, "PP-E1"],
      [41, "PP-F1"],
      [43, "PP-G1"],
      [45, "PP-A1"],
      [47, "PP-B1"],
      [48, "PP-C2"],
      [50, "PP-D2"],
      [52, "PP-E2"],
      [53, "PP-F2"],
      [55, "PP-G2"],
      [56, "PP-G#2"],
      [57, "PP-A2"],
      [58, "PP-A#2"],
      [59, "PP-B2"],
      [60, "PP-C3"],
      [62, "PP-D3"],
      [64, "PP-E3"],
      [65, "PP-F3"],
      [67, "PP-G3"],
      [69, "PP-A3"],
      [71, "PP-B3"],
      [72, "PP-C4"],
      [74, "PP-D4"],
      [76, "PP-E4"],
      [77, "PP-F4"],
      [79, "PP-G4"],
      [80, "PP-G#4"],
      [81, "PP-A4"],
      [82, "PP-A#4"],
      [83, "PP-B4"],
      [85, "PP-C#5"],
      [86, "PP-D5"],
      [87, "PP-D#5"],
      [89, "PP-F5"],
      [90, "PP-F#5"],
      [91, "PP-G5"],
      [92, "PP-G#5"],
      [93, "PP-A5"],
      [94, "PP-A#5"],
      [95, "PP-B5"],
      [96, "PP-C6"],
      [97, "PP-C#6"],
      [98, "PP-D6"],
      [99, "PP-D#6"],
      [100, "PP-E6"],
      [101, "PP-F6"],
      [102, "PP-F#6"],
      [103, "PP-G6"],
      [104, "PP-G#6"],
      [105, "PP-A6"],
      [106, "PP-A#6"],
      [107, "PP-B6"],
      [108, "PP-C7"]
    ]
  },
  {
    name: "PP",
    vel_range: [41, 67],
    samples: [
      [23, "PP-B-1"],
      [27, "PP-D#0"],
      [29, "PP-F0"],
      [31, "PP-G0"],
      [33, "PP-A0"],
      [35, "PP-B0"],
      [37, "PP-C#1"],
      [38, "PP-D1"],
      [40, "PP-E1"],
      [41, "PP-F1"],
      [43, "PP-G1"],
      [45, "PP-A1"],
      [47, "PP-B1"],
      [48, "PP-C2"],
      [50, "PP-D2"],
      [52, "PP-E2"],
      [53, "PP-F2"],
      [55, "PP-G2"],
      [56, "PP-G#2"],
      [57, "PP-A2"],
      [58, "PP-A#2"],
      [59, "PP-B2"],
      [60, "PP-C3"],
      [62, "PP-D3"],
      [64, "PP-E3"],
      [65, "PP-F3"],
      [67, "PP-G3"],
      [69, "PP-A3"],
      [71, "PP-B3"],
      [72, "PP-C4"],
      [74, "PP-D4"],
      [76, "PP-E4"],
      [77, "PP-F4"],
      [79, "PP-G4"],
      [80, "PP-G#4"],
      [81, "PP-A4"],
      [82, "PP-A#4"],
      [83, "PP-B4"],
      [85, "PP-C#5"],
      [86, "PP-D5"],
      [87, "PP-D#5"],
      [89, "PP-F5"],
      [90, "PP-F#5"],
      [91, "PP-G5"],
      [92, "PP-G#5"],
      [93, "PP-A5"],
      [94, "PP-A#5"],
      [95, "PP-B5"],
      [96, "PP-C6"],
      [97, "PP-C#6"],
      [98, "PP-D6"],
      [99, "PP-D#6"],
      [100, "PP-E6"],
      [101, "PP-F6"],
      [102, "PP-F#6"],
      [103, "PP-G6"],
      [104, "PP-G#6"],
      [105, "PP-A6"],
      [106, "PP-A#6"],
      [107, "PP-B6"],
      [108, "PP-C7"]
    ]
  },
  {
    name: "MP",
    vel_range: [68, 84],
    samples: [
      [23, "Mp-B-1"],
      [27, "Mp-D#0"],
      [29, "Mp-F0"],
      [31, "Mp-G0"],
      [33, "Mp-A0"],
      [35, "Mp-B0"],
      [37, "Mp-C#1"],
      [38, "Mp-D1"],
      [40, "Mp-E1"],
      [41, "Mp-F1"],
      [43, "Mp-G1"],
      [45, "Mp-A1"],
      [47, "Mp-B1"],
      [48, "Mp-C2"],
      [50, "Mp-D2"],
      [52, "Mp-E2"],
      [53, "Mp-F2"],
      [55, "Mp-G2"],
      [56, "Mp-G#2"],
      [57, "Mp-A2"],
      [58, "Mp-A#2"],
      [59, "Mp-B2"],
      [60, "Mp-C3"],
      [62, "Mp-D3"],
      [64, "Mp-E3"],
      [65, "Mp-F3"],
      [67, "Mp-G3"],
      [69, "Mp-A3"],
      [71, "Mp-B3"],
      [72, "Mp-C4"],
      [74, "Mp-D4"],
      [76, "Mp-E4"],
      [77, "Mp-F4"],
      [79, "Mp-G4"],
      [80, "Mp-G#4"],
      [81, "Mp-A4"],
      [82, "Mp-A#4"],
      [83, "Mp-B4"],
      [85, "Mp-C#5"],
      [86, "Mp-D5"],
      [87, "Mp-D#5"],
      [88, "Mp-E5"],
      [89, "Mp-F5"],
      [90, "Mp-F#5"],
      [91, "Mp-G5"],
      [92, "Mp-G#5"],
      [93, "Mp-A5"],
      [94, "Mp-A#5"],
      [95, "Mp-B5"],
      [96, "Mp-C6"],
      [97, "Mp-C#6"],
      [98, "Mp-D6"],
      [99, "Mp-D#6"],
      [100, "PP-E6"],
      [101, "Mp-F6"],
      [102, "Mp-F#6"],
      [103, "Mp-G6"],
      [104, "Mp-G#6"],
      [105, "Mp-A6"],
      [106, "Mp-A#6"],
      [107, "PP-B6"],
      [108, "PP-C7"]
    ]
  },
  {
    name: "MF",
    vel_range: [85, 100],
    samples: [
      [23, "Mf-B-1"],
      [27, "Mf-D#0"],
      [29, "Mf-F0"],
      [31, "Mf-G0"],
      [33, "Mf-A0"],
      [35, "Mf-B0"],
      [37, "Mf-C#1"],
      [38, "Mf-D1"],
      [40, "Mf-E1"],
      [41, "Mf-F1"],
      [43, "Mf-G1"],
      [45, "Mf-A1"],
      [47, "Mf-B1"],
      [48, "Mf-C2"],
      [50, "Mf-D2"],
      [52, "Mf-E2"],
      [53, "Mf-F2"],
      [55, "Mf-G2"],
      [56, "Mf-G#2"],
      [57, "Mf-A2"],
      [58, "Mf-A#2"],
      [59, "Mf-B2"],
      [60, "Mf-C3"],
      [62, "Mf-D3"],
      [64, "Mf-E3"],
      [65, "Mf-F3"],
      [67, "Mf-G3"],
      [69, "Mf-A3"],
      [71, "Mf-B3"],
      [72, "Mf-C4"],
      [74, "Mf-D4"],
      [76, "Mf-E4"],
      [77, "Mf-F4"],
      [79, "Mf-G4"],
      [80, "Mf-G#4"],
      [81, "Mf-A4"],
      [82, "Mf-A#4"],
      [83, "Mf-B4"],
      [85, "Mf-C#5"],
      [86, "Mf-D5"],
      [87, "Mf-D#5"],
      [88, "Mf-E5"],
      [89, "Mf-F5"],
      [90, "Mf-F#5"],
      [91, "Mf-G5"],
      [92, "Mf-G#5"],
      [93, "Mf-A5"],
      [94, "Mf-A#5"],
      [95, "Mf-B5"],
      [96, "Mf-C6"],
      [97, "Mf-C#6"],
      [98, "Mf-D6"],
      [99, "Mf-D#6"],
      [100, "Mf-E6"],
      [101, "Mf-F6"],
      [102, "Mf-F#6"],
      [103, "Mf-G6"],
      [104, "Mf-G#6"],
      [105, "Mf-A6"],
      [106, "Mf-A#6"],
      [107, "Mf-B6"],
      [108, "PP-C7"]
    ]
  },
  {
    name: "FF",
    vel_range: [101, 127],
    samples: [
      [23, "FF-B-1"],
      [27, "FF-D#0"],
      [29, "FF-F0"],
      [31, "FF-G0"],
      [33, "FF-A0"],
      [35, "FF-B0"],
      [37, "FF-C#1"],
      [38, "FF-D1"],
      [40, "FF-E1"],
      [41, "FF-F1"],
      [43, "FF-G1"],
      [45, "FF-A1"],
      [47, "FF-B1"],
      [48, "FF-C2"],
      [50, "FF-D2"],
      [52, "FF-E2"],
      [53, "FF-F2"],
      [55, "FF-G2"],
      [56, "FF-G#2"],
      [57, "FF-A2"],
      [58, "FF-A#2"],
      [59, "FF-B2"],
      [60, "FF-C3"],
      [62, "FF-D3"],
      [64, "FF-E3"],
      [65, "FF-F3"],
      [67, "FF-G3"],
      [69, "FF-A3"],
      [71, "FF-B3"],
      [72, "FF-C4"],
      [74, "FF-D4"],
      [76, "FF-E4"],
      [77, "FF-F4"],
      [79, "FF-G4"],
      [80, "FF-G#4"],
      [81, "FF-A4"],
      [82, "FF-A#4"],
      [83, "FF-B4"],
      [85, "FF-C#5"],
      [86, "FF-D5"],
      [88, "FF-E5"],
      [89, "FF-F5"],
      [91, "FF-G5"],
      [93, "FF-A5"],
      [95, "Mf-B5"],
      [96, "Mf-C6"],
      [97, "Mf-C#6"],
      [98, "Mf-D6"],
      [99, "Mf-D#6"],
      [100, "Mf-E6"],
      [102, "Mf-F#6"],
      [103, "Mf-G6"],
      [104, "Mf-G#6"],
      [105, "Mf-A6"],
      [106, "Mf-A#6"],
      [107, "Mf-B6"],
      [108, "Mf-C7"]
    ]
  }
];
export {
  CacheStorage,
  DrumMachine,
  ElectricPiano,
  HttpStorage,
  LAYERS,
  Mallet,
  Mellotron,
  NAME_TO_PATH,
  Sampler,
  Smolken,
  Soundfont,
  Soundfont2Sampler,
  SplendidGrandPiano,
  VcslInstrumentLoader,
  Versilian,
  getDrumMachineNames,
  getElectricPianoNames,
  getMalletNames,
  getMellotronNames,
  getSmolkenNames,
  getSoundfontKits,
  getSoundfontNames,
  getVersilianInstruments
};