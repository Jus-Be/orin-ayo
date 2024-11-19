/*! For license information please see main.js.LICENSE.txt */
(() => {
    var e = {
            419: (e, t) => {
                "use strict";
                var r;
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.DeviceModelId = void 0, (r = t.DeviceModelId || (t.DeviceModelId = {})).ORIGINAL = "original", r.ORIGINALV2 = "originalv2", r.ORIGINALMK2 = "original-mk2", r.MINI = "mini", r.MINIV2 = "miniv2", r.XL = "xl", r.XLV2 = "xlv2", r.PEDAL = "pedal", r.PLUS = "plus"
            },
            562: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r), Object.defineProperty(e, n, {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        })
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    i = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.DEVICE_MODELS = t.DeviceModelType = t.VENDOR_ID = t.StreamDeckProxy = void 0;
                const o = r(419),
                    s = r(57),
                    a = r(197);
                i(r(160), t), i(r(419), t);
                var c, u = r(235);
                Object.defineProperty(t, "StreamDeckProxy", {
                        enumerable: !0,
                        get: function() {
                            return u.StreamDeckProxy
                        }
                    }), t.VENDOR_ID = 4057,
                    function(e) {
                        e.STREAMDECK = "streamdeck", e.PEDAL = "pedal"
                    }(c = t.DeviceModelType || (t.DeviceModelType = {})), t.DEVICE_MODELS = [{
                        id: o.DeviceModelId.ORIGINAL,
                        type: c.STREAMDECK,
                        productId: 96,
                        class: s.StreamDeckOriginal
                    }, {
                        id: o.DeviceModelId.MINI,
                        type: c.STREAMDECK,
                        productId: 99,
                        class: s.StreamDeckMini
                    }, {
                        id: o.DeviceModelId.XL,
                        type: c.STREAMDECK,
                        productId: 108,
                        class: s.StreamDeckXL
                    }, {
                        id: o.DeviceModelId.ORIGINALV2,
                        type: c.STREAMDECK,
                        productId: 109,
                        class: s.StreamDeckOriginalV2
                    }, {
                        id: o.DeviceModelId.ORIGINALMK2,
                        type: c.STREAMDECK,
                        productId: 128,
                        class: s.StreamDeckOriginalMK2
                    }, {
                        id: o.DeviceModelId.PLUS,
                        type: c.STREAMDECK,
                        productId: 132,
                        class: a.StreamDeckPlus
                    }, {
                        id: o.DeviceModelId.PEDAL,
                        type: c.PEDAL,
                        productId: 134,
                        class: s.StreamDeckPedal
                    }, {
                        id: o.DeviceModelId.XLV2,
                        type: c.STREAMDECK,
                        productId: 143,
                        class: s.StreamDeckXLV2
                    }, {
                        id: o.DeviceModelId.MINIV2,
                        type: c.STREAMDECK,
                        productId: 144,
                        class: s.StreamDeckMiniV2
                    }]
            },
            237: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckGen1Base = void 0;
                const n = r(683);
                class i extends n.StreamDeckBase {
                    constructor(e, t, r) {
                        super(e, t, r)
                    }
                    async setBrightness(e) {
                        if (e < 0 || e > 100) throw new RangeError("Expected brightness percentage to be between 0 and 100");
                        const t = Buffer.from([5, 85, 170, 209, 1, e, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                        await this.device.sendFeatureReport(t)
                    }
                    async resetToLogo() {
                        const e = Buffer.from([11, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                        await this.device.sendFeatureReport(e)
                    }
                    async getFirmwareVersion() {
                        const e = await this.device.getFeatureReport(4, 17),
                            t = e.indexOf(0);
                        return e.toString("ascii", 5, -1 === t ? void 0 : t)
                    }
                    async getSerialNumber() {
                        return (await this.device.getFeatureReport(3, 17)).toString("ascii", 5, 17)
                    }
                }
                t.StreamDeckGen1Base = i
            },
            492: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckGen2Base = void 0;
                const n = r(678),
                    i = r(683);
                class o extends i.StreamDeckBase {
                    constructor(e, t, r, n) {
                        super(e, t, r), this.encodeJPEG = t.encodeJPEG, this.xyFlip = !n
                    }
                    async setBrightness(e) {
                        if (e < 0 || e > 100) throw new RangeError("Expected brightness percentage to be between 0 and 100");
                        const t = Buffer.from([3, 8, e, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                        await this.device.sendFeatureReport(t)
                    }
                    async resetToLogo() {
                        const e = Buffer.from([3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                        await this.device.sendFeatureReport(e)
                    }
                    async getFirmwareVersion() {
                        const e = await this.device.getFeatureReport(5, 32),
                            t = e.indexOf(0);
                        return e.toString("ascii", 6, -1 === t ? void 0 : t)
                    }
                    async getSerialNumber() {
                        return (await this.device.getFeatureReport(6, 32)).toString("ascii", 2, 14)
                    }
                    getFillImageCommandHeaderLength() {
                        return 8
                    }
                    writeFillImageCommandHeader(e, t, r, n, i) {
                        e.writeUInt8(2, 0), e.writeUInt8(7, 1), e.writeUInt8(t, 2), e.writeUInt8(n ? 1 : 0, 3), e.writeUInt16LE(i, 4), e.writeUInt16LE(r++, 6)
                    }
                    getFillImagePacketLength() {
                        return 1024
                    }
                    async convertFillImage(e, t) {
                        const r = (0, n.imageToByteArray)(e, t, {
                            colorMode: "rgba",
                            xFlip: this.xyFlip,
                            yFlip: this.xyFlip
                        }, 0, this.ICON_SIZE);
                        return this.encodeJPEG(r, this.ICON_SIZE, this.ICON_SIZE)
                    }
                }
                t.StreamDeckGen2Base = o
            },
            683: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckBase = t.StreamDeckInputBase = void 0;
                const n = r(729);
                class i extends n {
                    constructor(e, t, r) {
                        super(), this.deviceProperties = r, this.device = e, this.keyState = new Array(this.NUM_KEYS).fill(!1), this.device.on("input", (e => this.handleInputBuffer(e))), this.device.on("error", (e => {
                            this.emit("error", e)
                        }))
                    }
                    get NUM_KEYS() {
                        return this.KEY_COLUMNS * this.KEY_ROWS
                    }
                    get KEY_COLUMNS() {
                        return this.deviceProperties.COLUMNS
                    }
                    get KEY_ROWS() {
                        return this.deviceProperties.ROWS
                    }
                    get NUM_ENCODERS() {
                        return 0
                    }
                    get LCD_STRIP_SIZE() {}
                    get LCD_ENCODER_SIZE() {}
                    get ICON_SIZE() {
                        return this.deviceProperties.ICON_SIZE
                    }
                    get ICON_BYTES() {
                        return 3 * this.ICON_PIXELS
                    }
                    get ICON_PIXELS() {
                        return this.ICON_SIZE * this.ICON_SIZE
                    }
                    get MODEL() {
                        return this.deviceProperties.MODEL
                    }
                    get PRODUCT_NAME() {
                        return this.deviceProperties.PRODUCT_NAME
                    }
                    handleInputBuffer(e) {
                        const t = e.subarray(this.deviceProperties.KEY_DATA_OFFSET || 0);
                        for (let e = 0; e < this.NUM_KEYS; e++) {
                            const r = Boolean(t[e]),
                                n = this.transformKeyIndex(e);
                            r !== this.keyState[n] && (this.keyState[n] = r, r ? this.emit("down", n) : this.emit("up", n))
                        }
                    }
                    checkValidKeyIndex(e) {
                        if (e < 0 || e >= this.NUM_KEYS) throw new TypeError("Expected a valid keyIndex 0 - " + (this.NUM_KEYS - 1))
                    }
                    async close() {
                        return this.device.close()
                    }
                    transformKeyIndex(e) {
                        return e
                    }
                    async fillEncoderLcd(e, t, r) {
                        throw new Error("Not supported for this model")
                    }
                    async fillLcdRegion(e, t, r, n) {
                        throw new Error("Not supported for this model")
                    }
                }
                t.StreamDeckInputBase = i, t.StreamDeckBase = class extends i {
                    async fillKeyColor(e, t, r, n) {
                        this.checkValidKeyIndex(e), this.checkRGBValue(t), this.checkRGBValue(r), this.checkRGBValue(n);
                        const i = Buffer.alloc(this.ICON_BYTES, Buffer.from([t, r, n])),
                            o = this.transformKeyIndex(e);
                        await this.fillImageRange(o, i, {
                            format: "rgb",
                            offset: 0,
                            stride: 3 * this.ICON_SIZE
                        })
                    }
                    async fillKeyBuffer(e, t, r) {
                        var n;
                        this.checkValidKeyIndex(e);
                        const i = null !== (n = null == r ? void 0 : r.format) && void 0 !== n ? n : "rgb";
                        this.checkSourceFormat(i);
                        const o = this.ICON_PIXELS * i.length;
                        if (t.length !== o) throw new RangeError(`Expected image buffer of length ${o}, got length ${t.length}`);
                        const s = this.transformKeyIndex(e);
                        await this.fillImageRange(s, t, {
                            format: i,
                            offset: 0,
                            stride: this.ICON_SIZE * i.length
                        })
                    }
                    async fillPanelBuffer(e, t) {
                        var r;
                        const n = null !== (r = null == t ? void 0 : t.format) && void 0 !== r ? r : "rgb";
                        this.checkSourceFormat(n);
                        const i = this.ICON_PIXELS * n.length * this.NUM_KEYS;
                        if (e.length !== i) throw new RangeError(`Expected image buffer of length ${i}, got length ${e.length}`);
                        const o = this.ICON_SIZE * n.length,
                            s = o * this.KEY_COLUMNS,
                            a = [];
                        for (let t = 0; t < this.KEY_ROWS; t++) {
                            const r = s * t * this.ICON_SIZE;
                            for (let i = 0; i < this.KEY_COLUMNS; i++) {
                                let c = t * this.KEY_COLUMNS;
                                "ltr" === this.deviceProperties.KEY_DIRECTION ? c += i : c += this.KEY_COLUMNS - i - 1;
                                const u = i * o;
                                a.push(this.fillImageRange(c, e, {
                                    format: n,
                                    offset: r + u,
                                    stride: s
                                }))
                            }
                        }
                        await Promise.all(a)
                    }
                    async clearKey(e) {
                        this.checkValidKeyIndex(e);
                        const t = Buffer.alloc(this.ICON_BYTES, 0),
                            r = this.transformKeyIndex(e);
                        await this.fillImageRange(r, t, {
                            format: "rgb",
                            offset: 0,
                            stride: 3 * this.ICON_SIZE
                        })
                    }
                    async clearPanel() {
                        const e = Buffer.alloc(this.ICON_BYTES, 0),
                            t = [];
                        for (let r = 0; r < this.NUM_KEYS; r++) t.push(this.fillImageRange(r, e, {
                            format: "rgb",
                            offset: 0,
                            stride: 3 * this.ICON_SIZE
                        }));
                        await Promise.all(t)
                    }
                    getFillImageCommandHeaderLength() {
                        return 16
                    }
                    writeFillImageCommandHeader(e, t, r, n, i) {
                        e.writeUInt8(2, 0), e.writeUInt8(1, 1), e.writeUInt16LE(r, 2), e.writeUInt8(n ? 1 : 0, 4), e.writeUInt8(t + 1, 5)
                    }
                    generateFillImageWrites(e, t) {
                        const r = this.getFillImagePacketLength(),
                            n = this.getFillImageCommandHeaderLength(),
                            i = r - n,
                            o = [];
                        let s = t.length;
                        for (let a = 0; s > 0; a++) {
                            const c = Buffer.alloc(r),
                                u = Math.min(s, i);
                            this.writeFillImageCommandHeader(c, e, a, s <= i, u);
                            const f = t.length - s;
                            s -= u, t.copy(c, n, f, f + u), o.push(c)
                        }
                        return o
                    }
                    async fillImageRange(e, t, r) {
                        this.checkValidKeyIndex(e);
                        const n = await this.convertFillImage(t, r),
                            i = this.generateFillImageWrites(e, n);
                        await this.device.sendReports(i)
                    }
                    checkRGBValue(e) {
                        if (e < 0 || e > 255) throw new TypeError("Expected a valid color RGB value 0 - 255")
                    }
                    checkSourceFormat(e) {
                        switch (e) {
                            case "rgb":
                            case "rgba":
                            case "bgr":
                            case "bgra":
                                break;
                            default:
                                throw new TypeError(`Expected a known color format not "${e}"`)
                        }
                    }
                }
            },
            57: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckPlus = t.StreamDeckPedal = t.StreamDeckOriginalMK2 = t.StreamDeckOriginalV2 = t.StreamDeckXLV2 = t.StreamDeckXL = t.StreamDeckMiniV2 = t.StreamDeckMini = t.StreamDeckOriginal = void 0;
                var n = r(265);
                Object.defineProperty(t, "StreamDeckOriginal", {
                    enumerable: !0,
                    get: function() {
                        return n.StreamDeckOriginal
                    }
                });
                var i = r(78);
                Object.defineProperty(t, "StreamDeckMini", {
                    enumerable: !0,
                    get: function() {
                        return i.StreamDeckMini
                    }
                });
                var o = r(10);
                Object.defineProperty(t, "StreamDeckMiniV2", {
                    enumerable: !0,
                    get: function() {
                        return o.StreamDeckMiniV2
                    }
                });
                var s = r(835);
                Object.defineProperty(t, "StreamDeckXL", {
                    enumerable: !0,
                    get: function() {
                        return s.StreamDeckXL
                    }
                });
                var a = r(619);
                Object.defineProperty(t, "StreamDeckXLV2", {
                    enumerable: !0,
                    get: function() {
                        return a.StreamDeckXLV2
                    }
                });
                var c = r(768);
                Object.defineProperty(t, "StreamDeckOriginalV2", {
                    enumerable: !0,
                    get: function() {
                        return c.StreamDeckOriginalV2
                    }
                });
                var u = r(610);
                Object.defineProperty(t, "StreamDeckOriginalMK2", {
                    enumerable: !0,
                    get: function() {
                        return u.StreamDeckOriginalMK2
                    }
                });
                var f = r(354);
                Object.defineProperty(t, "StreamDeckPedal", {
                    enumerable: !0,
                    get: function() {
                        return f.StreamDeckPedal
                    }
                });
                var h = r(197);
                Object.defineProperty(t, "StreamDeckPlus", {
                    enumerable: !0,
                    get: function() {
                        return h.StreamDeckPlus
                    }
                })
            },
            78: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckMini = void 0;
                const n = r(678),
                    i = r(237),
                    o = {
                        MODEL: r(419).DeviceModelId.MINI,
                        PRODUCT_NAME: "Streamdeck Mini",
                        COLUMNS: 3,
                        ROWS: 2,
                        ICON_SIZE: 80,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 0
                    };
                class s extends i.StreamDeckGen1Base {
                    constructor(e, t) {
                        super(e, t, o)
                    }
                    async convertFillImage(e, t) {
                        const r = (0, n.imageToByteArray)(e, t, {
                            colorMode: "bgr",
                            rotate: !0,
                            yFlip: !0
                        }, n.BMP_HEADER_LENGTH, this.ICON_SIZE);
                        return (0, n.writeBMPHeader)(r, this.ICON_SIZE, this.ICON_BYTES, 2835), Promise.resolve(r)
                    }
                    getFillImagePacketLength() {
                        return 1024
                    }
                }
                t.StreamDeckMini = s
            },
            10: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckMiniV2 = void 0;
                const n = r(678),
                    i = r(237),
                    o = {
                        MODEL: r(419).DeviceModelId.MINIV2,
                        PRODUCT_NAME: "Streamdeck Mini",
                        COLUMNS: 3,
                        ROWS: 2,
                        ICON_SIZE: 80,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 0
                    };
                class s extends i.StreamDeckGen1Base {
                    constructor(e, t) {
                        super(e, t, o)
                    }
                    async convertFillImage(e, t) {
                        const r = (0, n.imageToByteArray)(e, t, {
                            colorMode: "bgr",
                            rotate: !0,
                            yFlip: !0
                        }, n.BMP_HEADER_LENGTH, this.ICON_SIZE);
                        return (0, n.writeBMPHeader)(r, this.ICON_SIZE, this.ICON_BYTES, 2835), Promise.resolve(r)
                    }
                    getFillImagePacketLength() {
                        return 1024
                    }
                    async getSerialNumber() {
                        return (await this.device.getFeatureReport(3, 32)).toString("ascii", 5, 17)
                    }
                }
                t.StreamDeckMiniV2 = s
            },
            610: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckOriginalMK2 = void 0;
                const n = r(492),
                    i = {
                        MODEL: r(419).DeviceModelId.ORIGINALMK2,
                        PRODUCT_NAME: "Streamdeck MK2",
                        COLUMNS: 5,
                        ROWS: 3,
                        ICON_SIZE: 72,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 3
                    };
                class o extends n.StreamDeckGen2Base {
                    constructor(e, t) {
                        super(e, t, i)
                    }
                }
                t.StreamDeckOriginalMK2 = o
            },
            265: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckOriginal = void 0;
                const n = r(678),
                    i = r(237),
                    o = {
                        MODEL: r(419).DeviceModelId.ORIGINAL,
                        PRODUCT_NAME: "Streamdeck",
                        COLUMNS: 5,
                        ROWS: 3,
                        ICON_SIZE: 72,
                        KEY_DIRECTION: "rtl",
                        KEY_DATA_OFFSET: 0
                    };
                class s extends i.StreamDeckGen1Base {
                    constructor(e, t) {
                        super(e, t, o), this.useOriginalKeyOrder = !!t.useOriginalKeyOrder
                    }
                    transformKeyIndex(e) {
                        if (this.useOriginalKeyOrder) return e; {
                            const t = (this.KEY_COLUMNS - 1) / 2;
                            return e + (e % this.KEY_COLUMNS - t) * -t
                        }
                    }
                    getFillImagePacketLength() {
                        return 8191
                    }
                    async convertFillImage(e, t) {
                        const r = (0, n.imageToByteArray)(e, t, {
                            colorMode: "bgr",
                            xFlip: !0
                        }, n.BMP_HEADER_LENGTH, this.ICON_SIZE);
                        return (0, n.writeBMPHeader)(r, this.ICON_SIZE, this.ICON_BYTES, 3780), Promise.resolve(r)
                    }
                    generateFillImageWrites(e, t) {
                        const r = this.getFillImagePacketLength(),
                            n = this.getFillImageCommandHeaderLength(),
                            i = t.length / 2,
                            o = Buffer.alloc(r);
                        this.writeFillImageCommandHeader(o, e, 1, !1, i), t.copy(o, n, 0, i);
                        const s = Buffer.alloc(r);
                        return this.writeFillImageCommandHeader(s, e, 2, !0, i), t.copy(s, n, i), [o, s]
                    }
                }
                t.StreamDeckOriginal = s
            },
            768: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckOriginalV2 = void 0;
                const n = r(492),
                    i = {
                        MODEL: r(419).DeviceModelId.ORIGINALV2,
                        PRODUCT_NAME: "Streamdeck",
                        COLUMNS: 5,
                        ROWS: 3,
                        ICON_SIZE: 72,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 3
                    };
                class o extends n.StreamDeckGen2Base {
                    constructor(e, t) {
                        super(e, t, i)
                    }
                }
                t.StreamDeckOriginalV2 = o
            },
            354: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckPedal = void 0;
                const n = r(683),
                    i = {
                        MODEL: r(419).DeviceModelId.PEDAL,
                        PRODUCT_NAME: "Streamdeck Pedal",
                        COLUMNS: 3,
                        ROWS: 1,
                        ICON_SIZE: 0,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 3
                    };
                class o extends n.StreamDeckInputBase {
                    constructor(e, t) {
                        super(e, t, i)
                    }
                    async setBrightness(e) {}
                    async resetToLogo() {}
                    async getFirmwareVersion() {
                        const e = await this.device.getFeatureReport(5, 32),
                            t = e.indexOf(0);
                        return e.toString("ascii", 6, -1 === t ? void 0 : t)
                    }
                    async getSerialNumber() {
                        return (await this.device.getFeatureReport(6, 32)).toString("ascii", 2, 14)
                    }
                    async fillKeyColor(e, t, r, n) {}
                    async fillKeyBuffer(e, t, r) {}
                    async fillPanelBuffer(e, t) {}
                    async clearKey(e) {}
                    async clearPanel() {}
                }
                t.StreamDeckPedal = o
            },
            197: function(e, t, r) {
                "use strict";
                var n, i = this && this.__classPrivateFieldSet || function(e, t, r, n, i) {
                        if ("m" === n) throw new TypeError("Private method is not writable");
                        if ("a" === n && !i) throw new TypeError("Private accessor was defined without a setter");
                        if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                        return "a" === n ? i.call(e, r) : i ? i.value = r : t.set(e, r), r
                    },
                    o = this && this.__classPrivateFieldGet || function(e, t, r, n) {
                        if ("a" === r && !n) throw new TypeError("Private accessor was defined without a getter");
                        if ("function" == typeof t ? e !== t || !n : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                        return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckPlus = void 0;
                const s = r(678),
                    a = r(492),
                    c = {
                        MODEL: r(419).DeviceModelId.PLUS,
                        PRODUCT_NAME: "Streamdeck +",
                        COLUMNS: 4,
                        ROWS: 2,
                        ICON_SIZE: 120,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 3
                    };
                class u extends a.StreamDeckGen2Base {
                    constructor(e, t) {
                        super(e, t, c, !0), n.set(this, void 0), i(this, n, new Array(4).fill(!1), "f")
                    }
                    get NUM_ENCODERS() {
                        return 4
                    }
                    get LCD_STRIP_SIZE() {
                        const e = this.LCD_ENCODER_SIZE;
                        return e.width *= this.NUM_ENCODERS, e
                    }
                    get LCD_ENCODER_SIZE() {
                        return {
                            width: 200,
                            height: 100
                        }
                    }
                    calculateEncoderForX(e) {
                        const t = this.LCD_ENCODER_SIZE.width;
                        return Math.floor(e / t)
                    }
                    handleInputBuffer(e) {
                        switch (e[0]) {
                            case 0:
                                super.handleInputBuffer(e);
                                break;
                            case 2:
                                this.handleLcdInput(e);
                                break;
                            case 3:
                                this.handleEncoderInput(e)
                        }
                    }
                    handleLcdInput(e) {
                        const t = Buffer.from(e),
                            r = {
                                x: t.readUint16LE(5),
                                y: t.readUint16LE(7)
                            },
                            n = this.calculateEncoderForX(r.x);
                        switch (e[3]) {
                            case 1:
                                this.emit("lcdShortPress", n, r);
                                break;
                            case 2:
                                this.emit("lcdLongPress", n, r);
                                break;
                            case 3: {
                                const e = {
                                        x: t.readUint16LE(9),
                                        y: t.readUint16LE(11)
                                    },
                                    i = this.calculateEncoderForX(e.x);
                                this.emit("lcdSwipe", n, i, r, e);
                                break
                            }
                        }
                    }
                    handleEncoderInput(e) {
                        switch (e[3]) {
                            case 0:
                                for (let t = 0; t < this.NUM_ENCODERS; t++) {
                                    const r = Boolean(e[4 + t]);
                                    r !== o(this, n, "f")[t] && (o(this, n, "f")[t] = r, r ? this.emit("encoderDown", t) : this.emit("encoderUp", t))
                                }
                                break;
                            case 1:
                                for (let t = 0; t < this.NUM_ENCODERS; t++) {
                                    const r = new Int8Array(e.buffer, e.byteOffset, e.byteLength)[4 + t];
                                    r > 0 ? this.emit("rotateRight", t, r) : r < 0 && this.emit("rotateLeft", t, -r)
                                }
                        }
                    }
                    async clearPanel() {
                        const e = super.clearPanel(),
                            t = this.LCD_STRIP_SIZE,
                            r = Buffer.alloc(t.width * t.height * 4),
                            n = this.fillLcdRegion(0, 0, r, {
                                format: "rgba",
                                width: t.width,
                                height: t.height
                            });
                        await Promise.all([e, n])
                    }
                    async fillEncoderLcd(e, t, r) {
                        if (0 === this.NUM_ENCODERS) throw new Error("There are no encoders");
                        const n = this.LCD_ENCODER_SIZE,
                            i = e * n.width;
                        return this.fillLcdRegion(i, 0, t, {
                            format: r.format,
                            width: n.width,
                            height: n.height
                        })
                    }
                    async fillLcdRegion(e, t, r, n) {
                        const i = this.LCD_STRIP_SIZE;
                        if (e < 0 || e + n.width > i.width) throw new TypeError("Image will not fit within the lcd strip");
                        if (t < 0 || t + n.height > i.height) throw new TypeError("Image will not fit within the lcd strip");
                        const o = n.width * n.height * n.format.length;
                        if (r.length !== o) throw new RangeError(`Expected image buffer of length ${o}, got length ${r.length}`);
                        const s = await this.convertFillLcdBuffer(r, n),
                            a = this.generateFillLcdWrites(e, t, s, n);
                        await this.device.sendReports(a)
                    }
                    async convertFillLcdBuffer(e, t) {
                        const r = {
                                format: t.format,
                                offset: 0,
                                stride: t.width * t.format.length
                            },
                            n = (0, s.imageToByteArray)(e, r, {
                                colorMode: "rgba",
                                xFlip: this.xyFlip,
                                yFlip: this.xyFlip
                            }, 0, t.width, t.height);
                        return this.encodeJPEG(n, t.width, t.height)
                    }
                    generateFillLcdWrites(e, t, r, n) {
                        const i = [];
                        let o = r.length;
                        for (let s = 0; o > 0; s++) {
                            const a = Buffer.alloc(1024),
                                c = Math.min(o, 1008);
                            a.writeUInt8(2, 0), a.writeUInt8(12, 1), a.writeUInt16LE(e, 2), a.writeUInt16LE(t, 4), a.writeUInt16LE(n.width, 6), a.writeUInt16LE(n.height, 8), a.writeUInt8(o <= 1008 ? 1 : 0, 10), a.writeUInt16LE(s, 11), a.writeUInt16LE(c, 13);
                            const u = r.length - o;
                            o -= c, r.copy(a, 16, u, u + c), i.push(a)
                        }
                        return i
                    }
                }
                t.StreamDeckPlus = u, n = new WeakMap
            },
            835: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckXL = void 0;
                const n = r(492),
                    i = {
                        MODEL: r(419).DeviceModelId.XL,
                        PRODUCT_NAME: "Streamdeck XL",
                        COLUMNS: 8,
                        ROWS: 4,
                        ICON_SIZE: 96,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 3
                    };
                class o extends n.StreamDeckGen2Base {
                    constructor(e, t) {
                        super(e, t, i)
                    }
                }
                t.StreamDeckXL = o
            },
            619: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckXLV2 = void 0;
                const n = r(492),
                    i = {
                        MODEL: r(419).DeviceModelId.XLV2,
                        PRODUCT_NAME: "Streamdeck XL",
                        COLUMNS: 8,
                        ROWS: 4,
                        ICON_SIZE: 96,
                        KEY_DIRECTION: "ltr",
                        KEY_DATA_OFFSET: 3
                    };
                class o extends n.StreamDeckGen2Base {
                    constructor(e, t) {
                        super(e, t, i)
                    }
                }
                t.StreamDeckXLV2 = o
            },
            235: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckProxy = void 0, t.StreamDeckProxy = class {
                    constructor(e) {
                        this.device = e
                    }
                    get NUM_KEYS() {
                        return this.device.NUM_KEYS
                    }
                    get KEY_COLUMNS() {
                        return this.device.KEY_COLUMNS
                    }
                    get KEY_ROWS() {
                        return this.device.KEY_ROWS
                    }
                    get NUM_ENCODERS() {
                        return this.device.NUM_ENCODERS
                    }
                    get LCD_STRIP_SIZE() {
                        return this.device.LCD_STRIP_SIZE
                    }
                    get LCD_ENCODER_SIZE() {
                        return this.device.LCD_ENCODER_SIZE
                    }
                    get ICON_SIZE() {
                        return this.device.ICON_SIZE
                    }
                    get ICON_BYTES() {
                        return this.device.ICON_BYTES
                    }
                    get ICON_PIXELS() {
                        return this.device.ICON_PIXELS
                    }
                    get MODEL() {
                        return this.device.MODEL
                    }
                    get PRODUCT_NAME() {
                        return this.device.PRODUCT_NAME
                    }
                    checkValidKeyIndex(e) {
                        this.device.checkValidKeyIndex(e)
                    }
                    async close() {
                        return this.device.close()
                    }
                    async fillKeyColor(e, t, r, n) {
                        return this.device.fillKeyColor(e, t, r, n)
                    }
                    async fillKeyBuffer(e, t, r) {
                        return this.device.fillKeyBuffer(e, t, r)
                    }
                    async fillPanelBuffer(e, t) {
                        return this.device.fillPanelBuffer(e, t)
                    }
                    async clearKey(e) {
                        return this.device.clearKey(e)
                    }
                    async clearPanel() {
                        return this.device.clearPanel()
                    }
                    async setBrightness(e) {
                        return this.device.setBrightness(e)
                    }
                    async resetToLogo() {
                        return this.device.resetToLogo()
                    }
                    async getFirmwareVersion() {
                        return this.device.getFirmwareVersion()
                    }
                    async getSerialNumber() {
                        return this.device.getSerialNumber()
                    }
                    async fillEncoderLcd(e, t, r) {
                        return this.device.fillEncoderLcd(e, t, r)
                    }
                    async fillLcdRegion(e, t, r, n) {
                        return this.device.fillLcdRegion(e, t, r, n)
                    }
                    eventNames() {
                        return this.device.eventNames()
                    }
                    listeners(e) {
                        return this.device.listeners(e)
                    }
                    listenerCount(e) {
                        return this.device.listenerCount(e)
                    }
                    emit(e, ...t) {
                        return this.device.emit(e, ...t)
                    }
                    on(e, t, r) {
                        return this.device.on(e, t, r), this
                    }
                    addListener(e, t, r) {
                        return this.device.addListener(e, t, r), this
                    }
                    once(e, t, r) {
                        return this.device.once(e, t, r), this
                    }
                    removeListener(e, t, r, n) {
                        return this.device.removeListener(e, t, r, n), this
                    }
                    off(e, t, r, n) {
                        return this.device.off(e, t, r, n), this
                    }
                    removeAllListeners(e) {
                        return this.device.removeAllListeners(e), this
                    }
                }
            },
            160: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            },
            678: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.writeBMPHeader = t.BMP_HEADER_LENGTH = t.imageToByteArray = void 0, t.imageToByteArray = function(e, t, r, n, i, o) {
                    o || (o = i);
                    const s = Buffer.alloc(n + i * o * r.colorMode.length),
                        a = t.format.substring(0, 3) !== r.colorMode.substring(0, 3);
                    for (let c = 0; c < o; c++) {
                        const u = n + i * r.colorMode.length * c;
                        for (let n = 0; n < i; n++) {
                            let f = r.xFlip ? i - n - 1 : n,
                                h = r.yFlip ? o - c - 1 : c;
                            if (r.rotate) {
                                const e = f;
                                f = h, h = e
                            }
                            const l = h * t.stride + t.offset + f * t.format.length,
                                d = e.readUInt8(l),
                                p = e.readUInt8(l + 1),
                                y = e.readUInt8(l + 2),
                                g = u + n * r.colorMode.length;
                            a ? (s.writeUInt8(y, g), s.writeUInt8(p, g + 1), s.writeUInt8(d, g + 2)) : (s.writeUInt8(d, g), s.writeUInt8(p, g + 1), s.writeUInt8(y, g + 2)), 4 === r.colorMode.length && s.writeUInt8(255, g + 3)
                        }
                    }
                    return s
                }, t.BMP_HEADER_LENGTH = 54, t.writeBMPHeader = function(e, t, r, n) {
                    e.write("BM"), e.writeUInt32LE(r + 54, 2), e.writeInt16LE(0, 6), e.writeInt16LE(0, 8), e.writeUInt32LE(54, 10), e.writeUInt32LE(40, 14), e.writeInt32LE(t, 18), e.writeInt32LE(t, 22), e.writeInt16LE(1, 26), e.writeInt16LE(24, 28), e.writeInt32LE(0, 30), e.writeInt32LE(r, 34), e.writeInt32LE(n, 38), e.writeInt32LE(n, 42), e.writeInt32LE(0, 46), e.writeInt32LE(0, 50)
                }
            },
            336: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.WebHIDDevice = void 0;
                const n = r(531),
                    i = r(860);
                class o extends n.EventEmitter {
                    constructor(e) {
                        super(), this.reportQueue = new i.default({
                            concurrency: 1
                        }), this.device = e, this.device.addEventListener("inputreport", (e => {
                            if (1 === e.reportId) {
                                const t = new Uint8Array(e.data.buffer);
                                this.emit("input", t)
                            }
                        }))
                    }
                    async close() {
                        return this.device.close()
                    }
                    async sendFeatureReport(e) {
                        return this.device.sendFeatureReport(e[0], new Uint8Array(e.subarray(1)))
                    }
                    async getFeatureReport(e, t) {
                        const r = await this.device.receiveFeatureReport(e);
                        return Buffer.from(r.buffer)
                    }
                    async sendReports(e) {
                        return this.reportQueue.add((async () => {
                            for (const t of e) await this.device.sendReport(t[0], new Uint8Array(t.subarray(1)))
                        }))
                    }
                }
                t.WebHIDDevice = o
            },
            47: (e, t, r) => {
                "use strict";
                t.l$ = t.kX = t.zh = t.Ee = t.aD = void 0;
                const n = r(562),
                    i = r(336),
                    o = r(118),
                    s = r(413);
                var a = r(562);
                Object.defineProperty(t, "aD", {
                    enumerable: !0,
                    get: function() {
                        return a.DeviceModelId
                    }
                });
                var c = r(413);
                async function u(e, t) {
                    const r = n.DEVICE_MODELS.find((t => t.productId === e.productId));
                    if (!r) return; // BAO throw new Error("Stream Deck is of unexpected type.");
                    await e.open();
                    const a = {
                            useOriginalKeyOrder: !1,
                            encodeJPEG: o.encodeJPEG,
                            ...t
                        },
                        c = new r.class(new i.WebHIDDevice(e), a || {});
                    return new s.StreamDeckWeb(c)
                }
                Object.defineProperty(t, "Ee", {
                    enumerable: !0,
                    get: function() {
                        return c.StreamDeckWeb
                    }
                }), t.zh = async function(e) {
                    return navigator.hid.requestDevice({
                        filters: [{
                            vendorId: n.VENDOR_ID
                        }]
                    }).then((async t => Promise.all(t.map((async t => u(t, e))))))
                }, t.kX = async function(e) {
                    return navigator.hid.getDevices().then((async t => Promise.all(t.map((async t => u(t, e))))))
                }, t.l$ = u
            },
            118: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.encodeJPEG = void 0, t.encodeJPEG = async function(e, t, r) {
                    const n = await new Promise(((n, i) => {
                        const o = document.createElement("canvas");
                        o.width = t, o.height = r;
                        const s = o.getContext("2d");
                        if (s) {
                            const a = s.createImageData(t, r);
                            a.data.set(e), s.putImageData(a, 0, 0), o.toBlob((e => {
                                e ? n(e) : i()
                            }), "image/jpeg", .9)
                        } else i()
                    }));
                    return Buffer.from(await n.arrayBuffer())
                }
            },
            413: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamDeckWeb = void 0;
                const n = r(562);
                class i extends n.StreamDeckProxy {
                    constructor(e) {
                        super(e)
                    }
                    async fillKeyCanvas(e, t) {
                        this.checkValidKeyIndex(e);
                        const r = t.getContext("2d");
                        if (!r) throw new Error("Failed to get canvas context");
                        const n = r.getImageData(0, 0, this.ICON_SIZE, this.ICON_SIZE);
                        return this.device.fillKeyBuffer(e, Buffer.from(n.data), {
                            format: "rgba"
                        })
                    }
                    async fillPanelCanvas(e) {
                        const t = e.getContext("2d");
                        if (!t) throw new Error("Failed to get canvas context");
                        const r = t.getImageData(0, 0, this.ICON_SIZE * this.KEY_COLUMNS, this.ICON_SIZE * this.KEY_ROWS);
                        return this.device.fillPanelBuffer(Buffer.from(r.data), {
                            format: "rgba"
                        })
                    }
                }
                t.StreamDeckWeb = i
            },
            742: (e, t) => {
                "use strict";
                t.byteLength = function(e) {
                    var t = c(e),
                        r = t[0],
                        n = t[1];
                    return 3 * (r + n) / 4 - n
                }, t.toByteArray = function(e) {
                    var t, r, o = c(e),
                        s = o[0],
                        a = o[1],
                        u = new i(function(e, t, r) {
                            return 3 * (t + r) / 4 - r
                        }(0, s, a)),
                        f = 0,
                        h = a > 0 ? s - 4 : s;
                    for (r = 0; r < h; r += 4) t = n[e.charCodeAt(r)] << 18 | n[e.charCodeAt(r + 1)] << 12 | n[e.charCodeAt(r + 2)] << 6 | n[e.charCodeAt(r + 3)], u[f++] = t >> 16 & 255, u[f++] = t >> 8 & 255, u[f++] = 255 & t;
                    return 2 === a && (t = n[e.charCodeAt(r)] << 2 | n[e.charCodeAt(r + 1)] >> 4, u[f++] = 255 & t), 1 === a && (t = n[e.charCodeAt(r)] << 10 | n[e.charCodeAt(r + 1)] << 4 | n[e.charCodeAt(r + 2)] >> 2, u[f++] = t >> 8 & 255, u[f++] = 255 & t), u
                }, t.fromByteArray = function(e) {
                    for (var t, n = e.length, i = n % 3, o = [], s = 16383, a = 0, c = n - i; a < c; a += s) o.push(u(e, a, a + s > c ? c : a + s));
                    return 1 === i ? (t = e[n - 1], o.push(r[t >> 2] + r[t << 4 & 63] + "==")) : 2 === i && (t = (e[n - 2] << 8) + e[n - 1], o.push(r[t >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "=")), o.join("")
                };
                for (var r = [], n = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, a = o.length; s < a; ++s) r[s] = o[s], n[o.charCodeAt(s)] = s;

                function c(e) {
                    var t = e.length;
                    if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                    var r = e.indexOf("=");
                    return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4]
                }

                function u(e, t, n) {
                    for (var i, o, s = [], a = t; a < n; a += 3) i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), s.push(r[(o = i) >> 18 & 63] + r[o >> 12 & 63] + r[o >> 6 & 63] + r[63 & o]);
                    return s.join("")
                }
                n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63
            },
            764: (e, t, r) => {
                "use strict";
                const n = r(742),
                    i = r(645),
                    o = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
                t.lW = c, t.h2 = 50;
                const s = 2147483647;

                function a(e) {
                    if (e > s) throw new RangeError('The value "' + e + '" is invalid for option "size"');
                    const t = new Uint8Array(e);
                    return Object.setPrototypeOf(t, c.prototype), t
                }

                function c(e, t, r) {
                    if ("number" == typeof e) {
                        if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
                        return h(e)
                    }
                    return u(e, t, r)
                }

                function u(e, t, r) {
                    if ("string" == typeof e) return function(e, t) {
                        if ("string" == typeof t && "" !== t || (t = "utf8"), !c.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
                        const r = 0 | y(e, t);
                        let n = a(r);
                        const i = n.write(e, t);
                        return i !== r && (n = n.slice(0, i)), n
                    }(e, t);
                    if (ArrayBuffer.isView(e)) return function(e) {
                        if (q(e, Uint8Array)) {
                            const t = new Uint8Array(e);
                            return d(t.buffer, t.byteOffset, t.byteLength)
                        }
                        return l(e)
                    }(e);
                    if (null == e) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                    if (q(e, ArrayBuffer) || e && q(e.buffer, ArrayBuffer)) return d(e, t, r);
                    if ("undefined" != typeof SharedArrayBuffer && (q(e, SharedArrayBuffer) || e && q(e.buffer, SharedArrayBuffer))) return d(e, t, r);
                    if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
                    const n = e.valueOf && e.valueOf();
                    if (null != n && n !== e) return c.from(n, t, r);
                    const i = function(e) {
                        if (c.isBuffer(e)) {
                            const t = 0 | p(e.length),
                                r = a(t);
                            return 0 === r.length || e.copy(r, 0, 0, t), r
                        }
                        return void 0 !== e.length ? "number" != typeof e.length || H(e.length) ? a(0) : l(e) : "Buffer" === e.type && Array.isArray(e.data) ? l(e.data) : void 0
                    }(e);
                    if (i) return i;
                    if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return c.from(e[Symbol.toPrimitive]("string"), t, r);
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
                }

                function f(e) {
                    if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
                    if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"')
                }

                function h(e) {
                    return f(e), a(e < 0 ? 0 : 0 | p(e))
                }

                function l(e) {
                    const t = e.length < 0 ? 0 : 0 | p(e.length),
                        r = a(t);
                    for (let n = 0; n < t; n += 1) r[n] = 255 & e[n];
                    return r
                }

                function d(e, t, r) {
                    if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
                    if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
                    let n;
                    return n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r), Object.setPrototypeOf(n, c.prototype), n
                }

                function p(e) {
                    if (e >= s) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
                    return 0 | e
                }

                function y(e, t) {
                    if (c.isBuffer(e)) return e.length;
                    if (ArrayBuffer.isView(e) || q(e, ArrayBuffer)) return e.byteLength;
                    if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
                    const r = e.length,
                        n = arguments.length > 2 && !0 === arguments[2];
                    if (!n && 0 === r) return 0;
                    let i = !1;
                    for (;;) switch (t) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return r;
                        case "utf8":
                        case "utf-8":
                            return G(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * r;
                        case "hex":
                            return r >>> 1;
                        case "base64":
                            return W(e).length;
                        default:
                            if (i) return n ? -1 : G(e).length;
                            t = ("" + t).toLowerCase(), i = !0
                    }
                }

                function g(e, t, r) {
                    let n = !1;
                    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                    if ((r >>>= 0) <= (t >>>= 0)) return "";
                    for (e || (e = "utf8");;) switch (e) {
                        case "hex":
                            return M(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return L(this, t, r);
                        case "ascii":
                            return D(this, t, r);
                        case "latin1":
                        case "binary":
                            return B(this, t, r);
                        case "base64":
                            return b(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return P(this, t, r);
                        default:
                            if (n) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(), n = !0
                    }
                }

                function v(e, t, r) {
                    const n = e[t];
                    e[t] = e[r], e[r] = n
                }

                function m(e, t, r, n, i) {
                    if (0 === e.length) return -1;
                    if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), H(r = +r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                        if (i) return -1;
                        r = e.length - 1
                    } else if (r < 0) {
                        if (!i) return -1;
                        r = 0
                    }
                    if ("string" == typeof t && (t = c.from(t, n)), c.isBuffer(t)) return 0 === t.length ? -1 : E(e, t, r, n, i);
                    if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : E(e, [t], r, n, i);
                    throw new TypeError("val must be string, number or Buffer")
                }

                function E(e, t, r, n, i) {
                    let o, s = 1,
                        a = e.length,
                        c = t.length;
                    if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                        if (e.length < 2 || t.length < 2) return -1;
                        s = 2, a /= 2, c /= 2, r /= 2
                    }

                    function u(e, t) {
                        return 1 === s ? e[t] : e.readUInt16BE(t * s)
                    }
                    if (i) {
                        let n = -1;
                        for (o = r; o < a; o++)
                            if (u(e, o) === u(t, -1 === n ? 0 : o - n)) {
                                if (-1 === n && (n = o), o - n + 1 === c) return n * s
                            } else - 1 !== n && (o -= o - n), n = -1
                    } else
                        for (r + c > a && (r = a - c), o = r; o >= 0; o--) {
                            let r = !0;
                            for (let n = 0; n < c; n++)
                                if (u(e, o + n) !== u(t, n)) {
                                    r = !1;
                                    break
                                } if (r) return o
                        }
                    return -1
                }

                function w(e, t, r, n) {
                    r = Number(r) || 0;
                    const i = e.length - r;
                    n ? (n = Number(n)) > i && (n = i) : n = i;
                    const o = t.length;
                    let s;
                    for (n > o / 2 && (n = o / 2), s = 0; s < n; ++s) {
                        const n = parseInt(t.substr(2 * s, 2), 16);
                        if (H(n)) return s;
                        e[r + s] = n
                    }
                    return s
                }

                function I(e, t, r, n) {
                    return X(G(t, e.length - r), e, r, n)
                }

                function _(e, t, r, n) {
                    return X(function(e) {
                        const t = [];
                        for (let r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                        return t
                    }(t), e, r, n)
                }

                function O(e, t, r, n) {
                    return X(W(t), e, r, n)
                }

                function S(e, t, r, n) {
                    return X(function(e, t) {
                        let r, n, i;
                        const o = [];
                        for (let s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
                        return o
                    }(t, e.length - r), e, r, n)
                }

                function b(e, t, r) {
                    return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
                }

                function L(e, t, r) {
                    r = Math.min(e.length, r);
                    const n = [];
                    let i = t;
                    for (; i < r;) {
                        const t = e[i];
                        let o = null,
                            s = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
                        if (i + s <= r) {
                            let r, n, a, c;
                            switch (s) {
                                case 1:
                                    t < 128 && (o = t);
                                    break;
                                case 2:
                                    r = e[i + 1], 128 == (192 & r) && (c = (31 & t) << 6 | 63 & r, c > 127 && (o = c));
                                    break;
                                case 3:
                                    r = e[i + 1], n = e[i + 2], 128 == (192 & r) && 128 == (192 & n) && (c = (15 & t) << 12 | (63 & r) << 6 | 63 & n, c > 2047 && (c < 55296 || c > 57343) && (o = c));
                                    break;
                                case 4:
                                    r = e[i + 1], n = e[i + 2], a = e[i + 3], 128 == (192 & r) && 128 == (192 & n) && 128 == (192 & a) && (c = (15 & t) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & a, c > 65535 && c < 1114112 && (o = c))
                            }
                        }
                        null === o ? (o = 65533, s = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | 1023 & o), n.push(o), i += s
                    }
                    return function(e) {
                        const t = e.length;
                        if (t <= C) return String.fromCharCode.apply(String, e);
                        let r = "",
                            n = 0;
                        for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += C));
                        return r
                    }(n)
                }
                c.TYPED_ARRAY_SUPPORT = function() {
                    try {
                        const e = new Uint8Array(1),
                            t = {
                                foo: function() {
                                    return 42
                                }
                            };
                        return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), 42 === e.foo()
                    } catch (e) {
                        return !1
                    }
                }(), c.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(c.prototype, "parent", {
                    enumerable: !0,
                    get: function() {
                        if (c.isBuffer(this)) return this.buffer
                    }
                }), Object.defineProperty(c.prototype, "offset", {
                    enumerable: !0,
                    get: function() {
                        if (c.isBuffer(this)) return this.byteOffset
                    }
                }), c.poolSize = 8192, c.from = function(e, t, r) {
                    return u(e, t, r)
                }, Object.setPrototypeOf(c.prototype, Uint8Array.prototype), Object.setPrototypeOf(c, Uint8Array), c.alloc = function(e, t, r) {
                    return function(e, t, r) {
                        return f(e), e <= 0 ? a(e) : void 0 !== t ? "string" == typeof r ? a(e).fill(t, r) : a(e).fill(t) : a(e)
                    }(e, t, r)
                }, c.allocUnsafe = function(e) {
                    return h(e)
                }, c.allocUnsafeSlow = function(e) {
                    return h(e)
                }, c.isBuffer = function(e) {
                    return null != e && !0 === e._isBuffer && e !== c.prototype
                }, c.compare = function(e, t) {
                    if (q(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)), q(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)), !c.isBuffer(e) || !c.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    if (e === t) return 0;
                    let r = e.length,
                        n = t.length;
                    for (let i = 0, o = Math.min(r, n); i < o; ++i)
                        if (e[i] !== t[i]) {
                            r = e[i], n = t[i];
                            break
                        } return r < n ? -1 : n < r ? 1 : 0
                }, c.isEncoding = function(e) {
                    switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1
                    }
                }, c.concat = function(e, t) {
                    if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === e.length) return c.alloc(0);
                    let r;
                    if (void 0 === t)
                        for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                    const n = c.allocUnsafe(t);
                    let i = 0;
                    for (r = 0; r < e.length; ++r) {
                        let t = e[r];
                        if (q(t, Uint8Array)) i + t.length > n.length ? (c.isBuffer(t) || (t = c.from(t)), t.copy(n, i)) : Uint8Array.prototype.set.call(n, t, i);
                        else {
                            if (!c.isBuffer(t)) throw new TypeError('"list" argument must be an Array of Buffers');
                            t.copy(n, i)
                        }
                        i += t.length
                    }
                    return n
                }, c.byteLength = y, c.prototype._isBuffer = !0, c.prototype.swap16 = function() {
                    const e = this.length;
                    if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (let t = 0; t < e; t += 2) v(this, t, t + 1);
                    return this
                }, c.prototype.swap32 = function() {
                    const e = this.length;
                    if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (let t = 0; t < e; t += 4) v(this, t, t + 3), v(this, t + 1, t + 2);
                    return this
                }, c.prototype.swap64 = function() {
                    const e = this.length;
                    if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                    for (let t = 0; t < e; t += 8) v(this, t, t + 7), v(this, t + 1, t + 6), v(this, t + 2, t + 5), v(this, t + 3, t + 4);
                    return this
                }, c.prototype.toString = function() {
                    const e = this.length;
                    return 0 === e ? "" : 0 === arguments.length ? L(this, 0, e) : g.apply(this, arguments)
                }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(e) {
                    if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e || 0 === c.compare(this, e)
                }, c.prototype.inspect = function() {
                    let e = "";
                    const r = t.h2;
                    return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">"
                }, o && (c.prototype[o] = c.prototype.inspect), c.prototype.compare = function(e, t, r, n, i) {
                    if (q(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)), !c.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                    if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
                    if (n >= i && t >= r) return 0;
                    if (n >= i) return -1;
                    if (t >= r) return 1;
                    if (this === e) return 0;
                    let o = (i >>>= 0) - (n >>>= 0),
                        s = (r >>>= 0) - (t >>>= 0);
                    const a = Math.min(o, s),
                        u = this.slice(n, i),
                        f = e.slice(t, r);
                    for (let e = 0; e < a; ++e)
                        if (u[e] !== f[e]) {
                            o = u[e], s = f[e];
                            break
                        } return o < s ? -1 : s < o ? 1 : 0
                }, c.prototype.includes = function(e, t, r) {
                    return -1 !== this.indexOf(e, t, r)
                }, c.prototype.indexOf = function(e, t, r) {
                    return m(this, e, t, r, !0)
                }, c.prototype.lastIndexOf = function(e, t, r) {
                    return m(this, e, t, r, !1)
                }, c.prototype.write = function(e, t, r, n) {
                    if (void 0 === t) n = "utf8", r = this.length, t = 0;
                    else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
                    else {
                        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
                    }
                    const i = this.length - t;
                    if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    n || (n = "utf8");
                    let o = !1;
                    for (;;) switch (n) {
                        case "hex":
                            return w(this, e, t, r);
                        case "utf8":
                        case "utf-8":
                            return I(this, e, t, r);
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return _(this, e, t, r);
                        case "base64":
                            return O(this, e, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return S(this, e, t, r);
                        default:
                            if (o) throw new TypeError("Unknown encoding: " + n);
                            n = ("" + n).toLowerCase(), o = !0
                    }
                }, c.prototype.toJSON = function() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                const C = 4096;

                function D(e, t, r) {
                    let n = "";
                    r = Math.min(e.length, r);
                    for (let i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
                    return n
                }

                function B(e, t, r) {
                    let n = "";
                    r = Math.min(e.length, r);
                    for (let i = t; i < r; ++i) n += String.fromCharCode(e[i]);
                    return n
                }

                function M(e, t, r) {
                    const n = e.length;
                    (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
                    let i = "";
                    for (let n = t; n < r; ++n) i += z[e[n]];
                    return i
                }

                function P(e, t, r) {
                    const n = e.slice(t, r);
                    let i = "";
                    for (let e = 0; e < n.length - 1; e += 2) i += String.fromCharCode(n[e] + 256 * n[e + 1]);
                    return i
                }

                function R(e, t, r) {
                    if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                    if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
                }

                function N(e, t, r, n, i, o) {
                    if (!c.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
                    if (r + n > e.length) throw new RangeError("Index out of range")
                }

                function A(e, t, r, n, i) {
                    Y(t, n, i, e, r, 7);
                    let o = Number(t & BigInt(4294967295));
                    e[r++] = o, o >>= 8, e[r++] = o, o >>= 8, e[r++] = o, o >>= 8, e[r++] = o;
                    let s = Number(t >> BigInt(32) & BigInt(4294967295));
                    return e[r++] = s, s >>= 8, e[r++] = s, s >>= 8, e[r++] = s, s >>= 8, e[r++] = s, r
                }

                function U(e, t, r, n, i) {
                    Y(t, n, i, e, r, 7);
                    let o = Number(t & BigInt(4294967295));
                    e[r + 7] = o, o >>= 8, e[r + 6] = o, o >>= 8, e[r + 5] = o, o >>= 8, e[r + 4] = o;
                    let s = Number(t >> BigInt(32) & BigInt(4294967295));
                    return e[r + 3] = s, s >>= 8, e[r + 2] = s, s >>= 8, e[r + 1] = s, s >>= 8, e[r] = s, r + 8
                }

                function T(e, t, r, n, i, o) {
                    if (r + n > e.length) throw new RangeError("Index out of range");
                    if (r < 0) throw new RangeError("Index out of range")
                }

                function k(e, t, r, n, o) {
                    return t = +t, r >>>= 0, o || T(e, 0, r, 4), i.write(e, t, r, n, 23, 4), r + 4
                }

                function x(e, t, r, n, o) {
                    return t = +t, r >>>= 0, o || T(e, 0, r, 8), i.write(e, t, r, n, 52, 8), r + 8
                }
                c.prototype.slice = function(e, t) {
                    const r = this.length;
                    (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);
                    const n = this.subarray(e, t);
                    return Object.setPrototypeOf(n, c.prototype), n
                }, c.prototype.readUintLE = c.prototype.readUIntLE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || R(e, t, this.length);
                    let n = this[e],
                        i = 1,
                        o = 0;
                    for (; ++o < t && (i *= 256);) n += this[e + o] * i;
                    return n
                }, c.prototype.readUintBE = c.prototype.readUIntBE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || R(e, t, this.length);
                    let n = this[e + --t],
                        i = 1;
                    for (; t > 0 && (i *= 256);) n += this[e + --t] * i;
                    return n
                }, c.prototype.readUint8 = c.prototype.readUInt8 = function(e, t) {
                    return e >>>= 0, t || R(e, 1, this.length), this[e]
                }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(e, t) {
                    return e >>>= 0, t || R(e, 2, this.length), this[e] | this[e + 1] << 8
                }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(e, t) {
                    return e >>>= 0, t || R(e, 2, this.length), this[e] << 8 | this[e + 1]
                }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(e, t) {
                    return e >>>= 0, t || R(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(e, t) {
                    return e >>>= 0, t || R(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                }, c.prototype.readBigUInt64LE = J((function(e) {
                    V(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || Z(e, this.length - 8);
                    const n = t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24,
                        i = this[++e] + 256 * this[++e] + 65536 * this[++e] + r * 2 ** 24;
                    return BigInt(n) + (BigInt(i) << BigInt(32))
                })), c.prototype.readBigUInt64BE = J((function(e) {
                    V(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || Z(e, this.length - 8);
                    const n = t * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + this[++e],
                        i = this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r;
                    return (BigInt(n) << BigInt(32)) + BigInt(i)
                })), c.prototype.readIntLE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || R(e, t, this.length);
                    let n = this[e],
                        i = 1,
                        o = 0;
                    for (; ++o < t && (i *= 256);) n += this[e + o] * i;
                    return i *= 128, n >= i && (n -= Math.pow(2, 8 * t)), n
                }, c.prototype.readIntBE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || R(e, t, this.length);
                    let n = t,
                        i = 1,
                        o = this[e + --n];
                    for (; n > 0 && (i *= 256);) o += this[e + --n] * i;
                    return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o
                }, c.prototype.readInt8 = function(e, t) {
                    return e >>>= 0, t || R(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                }, c.prototype.readInt16LE = function(e, t) {
                    e >>>= 0, t || R(e, 2, this.length);
                    const r = this[e] | this[e + 1] << 8;
                    return 32768 & r ? 4294901760 | r : r
                }, c.prototype.readInt16BE = function(e, t) {
                    e >>>= 0, t || R(e, 2, this.length);
                    const r = this[e + 1] | this[e] << 8;
                    return 32768 & r ? 4294901760 | r : r
                }, c.prototype.readInt32LE = function(e, t) {
                    return e >>>= 0, t || R(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                }, c.prototype.readInt32BE = function(e, t) {
                    return e >>>= 0, t || R(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                }, c.prototype.readBigInt64LE = J((function(e) {
                    V(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || Z(e, this.length - 8);
                    const n = this[e + 4] + 256 * this[e + 5] + 65536 * this[e + 6] + (r << 24);
                    return (BigInt(n) << BigInt(32)) + BigInt(t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24)
                })), c.prototype.readBigInt64BE = J((function(e) {
                    V(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || Z(e, this.length - 8);
                    const n = (t << 24) + 65536 * this[++e] + 256 * this[++e] + this[++e];
                    return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r)
                })), c.prototype.readFloatLE = function(e, t) {
                    return e >>>= 0, t || R(e, 4, this.length), i.read(this, e, !0, 23, 4)
                }, c.prototype.readFloatBE = function(e, t) {
                    return e >>>= 0, t || R(e, 4, this.length), i.read(this, e, !1, 23, 4)
                }, c.prototype.readDoubleLE = function(e, t) {
                    return e >>>= 0, t || R(e, 8, this.length), i.read(this, e, !0, 52, 8)
                }, c.prototype.readDoubleBE = function(e, t) {
                    return e >>>= 0, t || R(e, 8, this.length), i.read(this, e, !1, 52, 8)
                }, c.prototype.writeUintLE = c.prototype.writeUIntLE = function(e, t, r, n) {
                    e = +e, t >>>= 0, r >>>= 0, n || N(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                    let i = 1,
                        o = 0;
                    for (this[t] = 255 & e; ++o < r && (i *= 256);) this[t + o] = e / i & 255;
                    return t + r
                }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(e, t, r, n) {
                    e = +e, t >>>= 0, r >>>= 0, n || N(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                    let i = r - 1,
                        o = 1;
                    for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
                    return t + r
                }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
                }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
                }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                }, c.prototype.writeBigUInt64LE = J((function(e, t = 0) {
                    return A(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
                })), c.prototype.writeBigUInt64BE = J((function(e, t = 0) {
                    return U(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
                })), c.prototype.writeIntLE = function(e, t, r, n) {
                    if (e = +e, t >>>= 0, !n) {
                        const n = Math.pow(2, 8 * r - 1);
                        N(this, e, t, r, n - 1, -n)
                    }
                    let i = 0,
                        o = 1,
                        s = 0;
                    for (this[t] = 255 & e; ++i < r && (o *= 256);) e < 0 && 0 === s && 0 !== this[t + i - 1] && (s = 1), this[t + i] = (e / o >> 0) - s & 255;
                    return t + r
                }, c.prototype.writeIntBE = function(e, t, r, n) {
                    if (e = +e, t >>>= 0, !n) {
                        const n = Math.pow(2, 8 * r - 1);
                        N(this, e, t, r, n - 1, -n)
                    }
                    let i = r - 1,
                        o = 1,
                        s = 0;
                    for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) e < 0 && 0 === s && 0 !== this[t + i + 1] && (s = 1), this[t + i] = (e / o >> 0) - s & 255;
                    return t + r
                }, c.prototype.writeInt8 = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                }, c.prototype.writeInt16LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                }, c.prototype.writeInt16BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                }, c.prototype.writeInt32LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
                }, c.prototype.writeInt32BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || N(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                }, c.prototype.writeBigInt64LE = J((function(e, t = 0) {
                    return A(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
                })), c.prototype.writeBigInt64BE = J((function(e, t = 0) {
                    return U(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
                })), c.prototype.writeFloatLE = function(e, t, r) {
                    return k(this, e, t, !0, r)
                }, c.prototype.writeFloatBE = function(e, t, r) {
                    return k(this, e, t, !1, r)
                }, c.prototype.writeDoubleLE = function(e, t, r) {
                    return x(this, e, t, !0, r)
                }, c.prototype.writeDoubleBE = function(e, t, r) {
                    return x(this, e, t, !1, r)
                }, c.prototype.copy = function(e, t, r, n) {
                    if (!c.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                    if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
                    if (n < 0) throw new RangeError("sourceEnd out of bounds");
                    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                    const i = n - r;
                    return this === e && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t, r, n) : Uint8Array.prototype.set.call(e, this.subarray(r, n), t), i
                }, c.prototype.fill = function(e, t, r, n) {
                    if ("string" == typeof e) {
                        if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                        if ("string" == typeof n && !c.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
                        if (1 === e.length) {
                            const t = e.charCodeAt(0);
                            ("utf8" === n && t < 128 || "latin1" === n) && (e = t)
                        }
                    } else "number" == typeof e ? e &= 255 : "boolean" == typeof e && (e = Number(e));
                    if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                    if (r <= t) return this;
                    let i;
                    if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
                        for (i = t; i < r; ++i) this[i] = e;
                    else {
                        const o = c.isBuffer(e) ? e : c.from(e, n),
                            s = o.length;
                        if (0 === s) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                        for (i = 0; i < r - t; ++i) this[i + t] = o[i % s]
                    }
                    return this
                };
                const F = {};

                function K(e, t, r) {
                    F[e] = class extends r {
                        constructor() {
                            super(), Object.defineProperty(this, "message", {
                                value: t.apply(this, arguments),
                                writable: !0,
                                configurable: !0
                            }), this.name = `${this.name} [${e}]`, this.stack, delete this.name
                        }
                        get code() {
                            return e
                        }
                        set code(e) {
                            Object.defineProperty(this, "code", {
                                configurable: !0,
                                enumerable: !0,
                                value: e,
                                writable: !0
                            })
                        }
                        toString() {
                            return `${this.name} [${e}]: ${this.message}`
                        }
                    }
                }

                function j(e) {
                    let t = "",
                        r = e.length;
                    const n = "-" === e[0] ? 1 : 0;
                    for (; r >= n + 4; r -= 3) t = `_${e.slice(r-3,r)}${t}`;
                    return `${e.slice(0,r)}${t}`
                }

                function Y(e, t, r, n, i, o) {
                    if (e > r || e < t) {
                        const n = "bigint" == typeof t ? "n" : "";
                        let i;
                        throw i = o > 3 ? 0 === t || t === BigInt(0) ? `>= 0${n} and < 2${n} ** ${8*(o+1)}${n}` : `>= -(2${n} ** ${8*(o+1)-1}${n}) and < 2 ** ${8*(o+1)-1}${n}` : `>= ${t}${n} and <= ${r}${n}`, new F.ERR_OUT_OF_RANGE("value", i, e)
                    }! function(e, t, r) {
                        V(t, "offset"), void 0 !== e[t] && void 0 !== e[t + r] || Z(t, e.length - (r + 1))
                    }(n, i, o)
                }

                function V(e, t) {
                    if ("number" != typeof e) throw new F.ERR_INVALID_ARG_TYPE(t, "number", e)
                }

                function Z(e, t, r) {
                    if (Math.floor(e) !== e) throw V(e, r), new F.ERR_OUT_OF_RANGE(r || "offset", "an integer", e);
                    if (t < 0) throw new F.ERR_BUFFER_OUT_OF_BOUNDS;
                    throw new F.ERR_OUT_OF_RANGE(r || "offset", `>= ${r?1:0} and <= ${t}`, e)
                }
                K("ERR_BUFFER_OUT_OF_BOUNDS", (function(e) {
                    return e ? `${e} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
                }), RangeError), K("ERR_INVALID_ARG_TYPE", (function(e, t) {
                    return `The "${e}" argument must be of type number. Received type ${typeof t}`
                }), TypeError), K("ERR_OUT_OF_RANGE", (function(e, t, r) {
                    let n = `The value of "${e}" is out of range.`,
                        i = r;
                    return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? i = j(String(r)) : "bigint" == typeof r && (i = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (i = j(i)), i += "n"), n += ` It must be ${t}. Received ${i}`, n
                }), RangeError);
                const $ = /[^+/0-9A-Za-z-_]/g;

                function G(e, t) {
                    let r;
                    t = t || 1 / 0;
                    const n = e.length;
                    let i = null;
                    const o = [];
                    for (let s = 0; s < n; ++s) {
                        if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
                            if (!i) {
                                if (r > 56319) {
                                    (t -= 3) > -1 && o.push(239, 191, 189);
                                    continue
                                }
                                if (s + 1 === n) {
                                    (t -= 3) > -1 && o.push(239, 191, 189);
                                    continue
                                }
                                i = r;
                                continue
                            }
                            if (r < 56320) {
                                (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                                continue
                            }
                            r = 65536 + (i - 55296 << 10 | r - 56320)
                        } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                        if (i = null, r < 128) {
                            if ((t -= 1) < 0) break;
                            o.push(r)
                        } else if (r < 2048) {
                            if ((t -= 2) < 0) break;
                            o.push(r >> 6 | 192, 63 & r | 128)
                        } else if (r < 65536) {
                            if ((t -= 3) < 0) break;
                            o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                        } else {
                            if (!(r < 1114112)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                        }
                    }
                    return o
                }

                function W(e) {
                    return n.toByteArray(function(e) {
                        if ((e = (e = e.split("=")[0]).trim().replace($, "")).length < 2) return "";
                        for (; e.length % 4 != 0;) e += "=";
                        return e
                    }(e))
                }

                function X(e, t, r, n) {
                    let i;
                    for (i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
                    return i
                }

                function q(e, t) {
                    return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
                }

                function H(e) {
                    return e != e
                }
                const z = function() {
                    const e = "0123456789abcdef",
                        t = new Array(256);
                    for (let r = 0; r < 16; ++r) {
                        const n = 16 * r;
                        for (let i = 0; i < 16; ++i) t[n + i] = e[r] + e[i]
                    }
                    return t
                }();

                function J(e) {
                    return "undefined" == typeof BigInt ? Q : e
                }

                function Q() {
                    throw new Error("BigInt not supported")
                }
            },
            729: e => {
                "use strict";
                var t = Object.prototype.hasOwnProperty,
                    r = "~";

                function n() {}

                function i(e, t, r) {
                    this.fn = e, this.context = t, this.once = r || !1
                }

                function o(e, t, n, o, s) {
                    if ("function" != typeof n) throw new TypeError("The listener must be a function");
                    var a = new i(n, o || e, s),
                        c = r ? r + t : t;
                    return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], a] : e._events[c].push(a) : (e._events[c] = a, e._eventsCount++), e
                }

                function s(e, t) {
                    0 == --e._eventsCount ? e._events = new n : delete e._events[t]
                }

                function a() {
                    this._events = new n, this._eventsCount = 0
                }
                Object.create && (n.prototype = Object.create(null), (new n).__proto__ || (r = !1)), a.prototype.eventNames = function() {
                    var e, n, i = [];
                    if (0 === this._eventsCount) return i;
                    for (n in e = this._events) t.call(e, n) && i.push(r ? n.slice(1) : n);
                    return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(e)) : i
                }, a.prototype.listeners = function(e) {
                    var t = r ? r + e : e,
                        n = this._events[t];
                    if (!n) return [];
                    if (n.fn) return [n.fn];
                    for (var i = 0, o = n.length, s = new Array(o); i < o; i++) s[i] = n[i].fn;
                    return s
                }, a.prototype.listenerCount = function(e) {
                    var t = r ? r + e : e,
                        n = this._events[t];
                    return n ? n.fn ? 1 : n.length : 0
                }, a.prototype.emit = function(e, t, n, i, o, s) {
                    var a = r ? r + e : e;
                    if (!this._events[a]) return !1;
                    var c, u, f = this._events[a],
                        h = arguments.length;
                    if (f.fn) {
                        switch (f.once && this.removeListener(e, f.fn, void 0, !0), h) {
                            case 1:
                                return f.fn.call(f.context), !0;
                            case 2:
                                return f.fn.call(f.context, t), !0;
                            case 3:
                                return f.fn.call(f.context, t, n), !0;
                            case 4:
                                return f.fn.call(f.context, t, n, i), !0;
                            case 5:
                                return f.fn.call(f.context, t, n, i, o), !0;
                            case 6:
                                return f.fn.call(f.context, t, n, i, o, s), !0
                        }
                        for (u = 1, c = new Array(h - 1); u < h; u++) c[u - 1] = arguments[u];
                        f.fn.apply(f.context, c)
                    } else {
                        var l, d = f.length;
                        for (u = 0; u < d; u++) switch (f[u].once && this.removeListener(e, f[u].fn, void 0, !0), h) {
                            case 1:
                                f[u].fn.call(f[u].context);
                                break;
                            case 2:
                                f[u].fn.call(f[u].context, t);
                                break;
                            case 3:
                                f[u].fn.call(f[u].context, t, n);
                                break;
                            case 4:
                                f[u].fn.call(f[u].context, t, n, i);
                                break;
                            default:
                                if (!c)
                                    for (l = 1, c = new Array(h - 1); l < h; l++) c[l - 1] = arguments[l];
                                f[u].fn.apply(f[u].context, c)
                        }
                    }
                    return !0
                }, a.prototype.on = function(e, t, r) {
                    return o(this, e, t, r, !1)
                }, a.prototype.once = function(e, t, r) {
                    return o(this, e, t, r, !0)
                }, a.prototype.removeListener = function(e, t, n, i) {
                    var o = r ? r + e : e;
                    if (!this._events[o]) return this;
                    if (!t) return s(this, o), this;
                    var a = this._events[o];
                    if (a.fn) a.fn !== t || i && !a.once || n && a.context !== n || s(this, o);
                    else {
                        for (var c = 0, u = [], f = a.length; c < f; c++)(a[c].fn !== t || i && !a[c].once || n && a[c].context !== n) && u.push(a[c]);
                        u.length ? this._events[o] = 1 === u.length ? u[0] : u : s(this, o)
                    }
                    return this
                }, a.prototype.removeAllListeners = function(e) {
                    var t;
                    return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new n, this._eventsCount = 0), this
                }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = r, a.EventEmitter = a, e.exports = a
            },
            645: (e, t) => {
                t.read = function(e, t, r, n, i) {
                    var o, s, a = 8 * i - n - 1,
                        c = (1 << a) - 1,
                        u = c >> 1,
                        f = -7,
                        h = r ? i - 1 : 0,
                        l = r ? -1 : 1,
                        d = e[t + h];
                    for (h += l, o = d & (1 << -f) - 1, d >>= -f, f += a; f > 0; o = 256 * o + e[t + h], h += l, f -= 8);
                    for (s = o & (1 << -f) - 1, o >>= -f, f += n; f > 0; s = 256 * s + e[t + h], h += l, f -= 8);
                    if (0 === o) o = 1 - u;
                    else {
                        if (o === c) return s ? NaN : 1 / 0 * (d ? -1 : 1);
                        s += Math.pow(2, n), o -= u
                    }
                    return (d ? -1 : 1) * s * Math.pow(2, o - n)
                }, t.write = function(e, t, r, n, i, o) {
                    var s, a, c, u = 8 * o - i - 1,
                        f = (1 << u) - 1,
                        h = f >> 1,
                        l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                        d = n ? 0 : o - 1,
                        p = n ? 1 : -1,
                        y = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = f) : (s = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -s)) < 1 && (s--, c *= 2), (t += s + h >= 1 ? l / c : l * Math.pow(2, 1 - h)) * c >= 2 && (s++, c /= 2), s + h >= f ? (a = 0, s = f) : s + h >= 1 ? (a = (t * c - 1) * Math.pow(2, i), s += h) : (a = t * Math.pow(2, h - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + d] = 255 & a, d += p, a /= 256, i -= 8);
                    for (s = s << i | a, u += i; u > 0; e[r + d] = 255 & s, d += p, s /= 256, u -= 8);
                    e[r + d - p] |= 128 * y
                }
            },
            345: e => {
                "use strict";
                e.exports = (e, t) => (t = t || (() => {}), e.then((e => new Promise((e => {
                    e(t())
                })).then((() => e))), (e => new Promise((e => {
                    e(t())
                })).then((() => {
                    throw e
                })))))
            },
            860: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(729),
                    i = r(147),
                    o = r(506),
                    s = () => {},
                    a = new i.TimeoutError;
                t.default = class extends n {
                    constructor(e) {
                        var t, r, n, i;
                        if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = s, this._resolveIdle = s, !("number" == typeof(e = Object.assign({
                                carryoverConcurrencyCount: !1,
                                intervalCap: 1 / 0,
                                interval: 0,
                                concurrency: 1 / 0,
                                autoStart: !0,
                                queueClass: o.default
                            }, e)).intervalCap && e.intervalCap >= 1)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null!==(r=null===(t=e.intervalCap)||void 0===t?void 0:t.toString())&&void 0!==r?r:""}\` (${typeof e.intervalCap})`);
                        if (void 0 === e.interval || !(Number.isFinite(e.interval) && e.interval >= 0)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null!==(i=null===(n=e.interval)||void 0===n?void 0:n.toString())&&void 0!==i?i:""}\` (${typeof e.interval})`);
                        this._carryoverConcurrencyCount = e.carryoverConcurrencyCount, this._isIntervalIgnored = e.intervalCap === 1 / 0 || 0 === e.interval, this._intervalCap = e.intervalCap, this._interval = e.interval, this._queue = new e.queueClass, this._queueClass = e.queueClass, this.concurrency = e.concurrency, this._timeout = e.timeout, this._throwOnTimeout = !0 === e.throwOnTimeout, this._isPaused = !1 === e.autoStart
                    }
                    get _doesIntervalAllowAnother() {
                        return this._isIntervalIgnored || this._intervalCount < this._intervalCap
                    }
                    get _doesConcurrentAllowAnother() {
                        return this._pendingCount < this._concurrency
                    }
                    _next() {
                        this._pendingCount--, this._tryToStartAnother(), this.emit("next")
                    }
                    _resolvePromises() {
                        this._resolveEmpty(), this._resolveEmpty = s, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = s, this.emit("idle"))
                    }
                    _onResumeInterval() {
                        this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0
                    }
                    _isIntervalPaused() {
                        const e = Date.now();
                        if (void 0 === this._intervalId) {
                            const t = this._intervalEnd - e;
                            if (!(t < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout((() => {
                                this._onResumeInterval()
                            }), t)), !0;
                            this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0
                        }
                        return !1
                    }
                    _tryToStartAnother() {
                        if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), !1;
                        if (!this._isPaused) {
                            const e = !this._isIntervalPaused();
                            if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                                const t = this._queue.dequeue();
                                return !!t && (this.emit("active"), t(), e && this._initializeIntervalIfNeeded(), !0)
                            }
                        }
                        return !1
                    }
                    _initializeIntervalIfNeeded() {
                        this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval((() => {
                            this._onInterval()
                        }), this._interval), this._intervalEnd = Date.now() + this._interval)
                    }
                    _onInterval() {
                        0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue()
                    }
                    _processQueue() {
                        for (; this._tryToStartAnother(););
                    }
                    get concurrency() {
                        return this._concurrency
                    }
                    set concurrency(e) {
                        if (!("number" == typeof e && e >= 1)) throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);
                        this._concurrency = e, this._processQueue()
                    }
                    async add(e, t = {}) {
                        return new Promise(((r, n) => {
                            this._queue.enqueue((async () => {
                                this._pendingCount++, this._intervalCount++;
                                try {
                                    const o = void 0 === this._timeout && void 0 === t.timeout ? e() : i.default(Promise.resolve(e()), void 0 === t.timeout ? this._timeout : t.timeout, (() => {
                                        (void 0 === t.throwOnTimeout ? this._throwOnTimeout : t.throwOnTimeout) && n(a)
                                    }));
                                    r(await o)
                                } catch (e) {
                                    n(e)
                                }
                                this._next()
                            }), t), this._tryToStartAnother(), this.emit("add")
                        }))
                    }
                    async addAll(e, t) {
                        return Promise.all(e.map((async e => this.add(e, t))))
                    }
                    start() {
                        return this._isPaused ? (this._isPaused = !1, this._processQueue(), this) : this
                    }
                    pause() {
                        this._isPaused = !0
                    }
                    clear() {
                        this._queue = new this._queueClass
                    }
                    async onEmpty() {
                        if (0 !== this._queue.size) return new Promise((e => {
                            const t = this._resolveEmpty;
                            this._resolveEmpty = () => {
                                t(), e()
                            }
                        }))
                    }
                    async onIdle() {
                        if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e => {
                            const t = this._resolveIdle;
                            this._resolveIdle = () => {
                                t(), e()
                            }
                        }))
                    }
                    get size() {
                        return this._queue.size
                    }
                    sizeBy(e) {
                        return this._queue.filter(e).length
                    }
                    get pending() {
                        return this._pendingCount
                    }
                    get isPaused() {
                        return this._isPaused
                    }
                    get timeout() {
                        return this._timeout
                    }
                    set timeout(e) {
                        this._timeout = e
                    }
                }
            },
            489: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.default = function(e, t, r) {
                    let n = 0,
                        i = e.length;
                    for (; i > 0;) {
                        const o = i / 2 | 0;
                        let s = n + o;
                        r(e[s], t) <= 0 ? (n = ++s, i -= o + 1) : i = o
                    }
                    return n
                }
            },
            506: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(489);
                t.default = class {
                    constructor() {
                        this._queue = []
                    }
                    enqueue(e, t) {
                        const r = {
                            priority: (t = Object.assign({
                                priority: 0
                            }, t)).priority,
                            run: e
                        };
                        if (this.size && this._queue[this.size - 1].priority >= t.priority) return void this._queue.push(r);
                        const i = n.default(this._queue, r, ((e, t) => t.priority - e.priority));
                        this._queue.splice(i, 0, r)
                    }
                    dequeue() {
                        const e = this._queue.shift();
                        return null == e ? void 0 : e.run
                    }
                    filter(e) {
                        return this._queue.filter((t => t.priority === e.priority)).map((e => e.run))
                    }
                    get size() {
                        return this._queue.length
                    }
                }
            },
            147: (e, t, r) => {
                "use strict";
                const n = r(345);
                class i extends Error {
                    constructor(e) {
                        super(e), this.name = "TimeoutError"
                    }
                }
                const o = (e, t, r) => new Promise(((o, s) => {
                    if ("number" != typeof t || t < 0) throw new TypeError("Expected `milliseconds` to be a positive number");
                    if (t === 1 / 0) return void o(e);
                    const a = setTimeout((() => {
                        if ("function" == typeof r) {
                            try {
                                o(r())
                            } catch (e) {
                                s(e)
                            }
                            return
                        }
                        const n = r instanceof Error ? r : new i("string" == typeof r ? r : `Promise timed out after ${t} milliseconds`);
                        "function" == typeof e.cancel && e.cancel(), s(n)
                    }), t);
                    n(e.then(o, s), (() => {
                        clearTimeout(a)
                    }))
                }));
                e.exports = o, e.exports.default = o, e.exports.TimeoutError = i
            },
            531: e => {
                "use strict";
                var t, r = "object" == typeof Reflect ? Reflect : null,
                    n = r && "function" == typeof r.apply ? r.apply : function(e, t, r) {
                        return Function.prototype.apply.call(e, t, r)
                    };
                t = r && "function" == typeof r.ownKeys ? r.ownKeys : Object.getOwnPropertySymbols ? function(e) {
                    return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
                } : function(e) {
                    return Object.getOwnPropertyNames(e)
                };
                var i = Number.isNaN || function(e) {
                    return e != e
                };

                function o() {
                    o.init.call(this)
                }
                e.exports = o, e.exports.once = function(e, t) {
                    return new Promise((function(r, n) {
                        function i(r) {
                            e.removeListener(t, o), n(r)
                        }

                        function o() {
                            "function" == typeof e.removeListener && e.removeListener("error", i), r([].slice.call(arguments))
                        }
                        y(e, t, o, {
                            once: !0
                        }), "error" !== t && function(e, t, r) {
                            "function" == typeof e.on && y(e, "error", t, {
                                once: !0
                            })
                        }(e, i)
                    }))
                }, o.EventEmitter = o, o.prototype._events = void 0, o.prototype._eventsCount = 0, o.prototype._maxListeners = void 0;
                var s = 10;

                function a(e) {
                    if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
                }

                function c(e) {
                    return void 0 === e._maxListeners ? o.defaultMaxListeners : e._maxListeners
                }

                function u(e, t, r, n) {
                    var i, o, s, u;
                    if (a(r), void 0 === (o = e._events) ? (o = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== o.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), o = e._events), s = o[t]), void 0 === s) s = o[t] = r, ++e._eventsCount;
                    else if ("function" == typeof s ? s = o[t] = n ? [r, s] : [s, r] : n ? s.unshift(r) : s.push(r), (i = c(e)) > 0 && s.length > i && !s.warned) {
                        s.warned = !0;
                        var f = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                        f.name = "MaxListenersExceededWarning", f.emitter = e, f.type = t, f.count = s.length, u = f, console && console.warn && console.warn(u)
                    }
                    return e
                }

                function f() {
                    if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
                }

                function h(e, t, r) {
                    var n = {
                            fired: !1,
                            wrapFn: void 0,
                            target: e,
                            type: t,
                            listener: r
                        },
                        i = f.bind(n);
                    return i.listener = r, n.wrapFn = i, i
                }

                function l(e, t, r) {
                    var n = e._events;
                    if (void 0 === n) return [];
                    var i = n[t];
                    return void 0 === i ? [] : "function" == typeof i ? r ? [i.listener || i] : [i] : r ? function(e) {
                        for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
                        return t
                    }(i) : p(i, i.length)
                }

                function d(e) {
                    var t = this._events;
                    if (void 0 !== t) {
                        var r = t[e];
                        if ("function" == typeof r) return 1;
                        if (void 0 !== r) return r.length
                    }
                    return 0
                }

                function p(e, t) {
                    for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
                    return r
                }

                function y(e, t, r, n) {
                    if ("function" == typeof e.on) n.once ? e.once(t, r) : e.on(t, r);
                    else {
                        if ("function" != typeof e.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
                        e.addEventListener(t, (function i(o) {
                            n.once && e.removeEventListener(t, i), r(o)
                        }))
                    }
                }
                Object.defineProperty(o, "defaultMaxListeners", {
                    enumerable: !0,
                    get: function() {
                        return s
                    },
                    set: function(e) {
                        if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
                        s = e
                    }
                }), o.init = function() {
                    void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
                }, o.prototype.setMaxListeners = function(e) {
                    if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
                    return this._maxListeners = e, this
                }, o.prototype.getMaxListeners = function() {
                    return c(this)
                }, o.prototype.emit = function(e) {
                    for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
                    var i = "error" === e,
                        o = this._events;
                    if (void 0 !== o) i = i && void 0 === o.error;
                    else if (!i) return !1;
                    if (i) {
                        var s;
                        if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
                        var a = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
                        throw a.context = s, a
                    }
                    var c = o[e];
                    if (void 0 === c) return !1;
                    if ("function" == typeof c) n(c, this, t);
                    else {
                        var u = c.length,
                            f = p(c, u);
                        for (r = 0; r < u; ++r) n(f[r], this, t)
                    }
                    return !0
                }, o.prototype.addListener = function(e, t) {
                    return u(this, e, t, !1)
                }, o.prototype.on = o.prototype.addListener, o.prototype.prependListener = function(e, t) {
                    return u(this, e, t, !0)
                }, o.prototype.once = function(e, t) {
                    return a(t), this.on(e, h(this, e, t)), this
                }, o.prototype.prependOnceListener = function(e, t) {
                    return a(t), this.prependListener(e, h(this, e, t)), this
                }, o.prototype.removeListener = function(e, t) {
                    var r, n, i, o, s;
                    if (a(t), void 0 === (n = this._events)) return this;
                    if (void 0 === (r = n[e])) return this;
                    if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));
                    else if ("function" != typeof r) {
                        for (i = -1, o = r.length - 1; o >= 0; o--)
                            if (r[o] === t || r[o].listener === t) {
                                s = r[o].listener, i = o;
                                break
                            } if (i < 0) return this;
                        0 === i ? r.shift() : function(e, t) {
                            for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                            e.pop()
                        }(r, i), 1 === r.length && (n[e] = r[0]), void 0 !== n.removeListener && this.emit("removeListener", e, s || t)
                    }
                    return this
                }, o.prototype.off = o.prototype.removeListener, o.prototype.removeAllListeners = function(e) {
                    var t, r, n;
                    if (void 0 === (r = this._events)) return this;
                    if (void 0 === r.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== r[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[e]), this;
                    if (0 === arguments.length) {
                        var i, o = Object.keys(r);
                        for (n = 0; n < o.length; ++n) "removeListener" !== (i = o[n]) && this.removeAllListeners(i);
                        return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this
                    }
                    if ("function" == typeof(t = r[e])) this.removeListener(e, t);
                    else if (void 0 !== t)
                        for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
                    return this
                }, o.prototype.listeners = function(e) {
                    return l(this, e, !0)
                }, o.prototype.rawListeners = function(e) {
                    return l(this, e, !1)
                }, o.listenerCount = function(e, t) {
                    return "function" == typeof e.listenerCount ? e.listenerCount(t) : d.call(e, t)
                }, o.prototype.listenerCount = d, o.prototype.eventNames = function() {
                    return this._eventsCount > 0 ? t(this._events) : []
                }
            }
        },
        t = {};

    function r(n) {
        var i = t[n];
        if (void 0 !== i) return i.exports;
        var o = t[n] = {
            exports: {}
        };
        return e[n].call(o.exports, o, o.exports, r), o.exports
    }(() => {
        "use strict";
        var e = r(47);
        window.Buffer = r(764).lW, window.StreamDeckUI = {
            requestStreamDecks: e.zh,
            getStreamDecks: e.kX,
            StreamDeckWeb: e.Ee,
            DeviceModelId: e.aD,
            openDevice: e.l$
        }
    })()
})();