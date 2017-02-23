console.log("**************************************************************************");

import mockery from 'mockery';
import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import { mount, shallow } from 'enzyme';

chai.use(spies);

describe('Layer', () => {

    class A {};
    class B {};
    class C {};
    class D {};

    var Layer, Unavailable,
        leaflet = class L {
            constructor() {
                this.esri = {
                    get: function (url, callback) {
                    },
                    dynamicMapLayer: function(o) {
                        return {
                            o: o,
                            addTo: function (a) {},
                            setZIndex: function (a) {},
                            on: function (a) {},
                            options: {
                                opacity: "getOpacity"
                            },
                            setLayers: function(a) { this.layers = a; },
                            setLayerDefs: function(a) { this.layerDefs = a; },
                            getLayerDefs: function() { return this.layerDefs; }
                        };
                    },
                    tiledMapLayer: function(o) { 
                        return {
                            o: o,
                            addTo: function (a) {},
                            tileUrl: '',
                            addTo: function (a) {},
                            on: function (a) {},
                            setLayers: function(a) { this.layers = a; },
                            setLayerDefs: function(a) { this.layerDefs = a; },
                            getLayerDefs: function() { return this.layerDefs; }
                        }; 
                    },
                    DomUtil: {
                        get: function (a) { return null; }
                    },
                    Support: {}
                };
                this.CRS = {};
                this.marker = function () { return new A(); };
                this.polygon = function () { return new B(); };
                this.multiPolyline = function () { return new C(); };
                this.multiPolygon = function () { return new D(); };
            }
        },
        l = new leaflet(),
        action = class Action {
            refreshDisplay() {}
        },
        empty = class Empty {};

    before((done) => {
        try {
            mockery.enable({
                warnOnReplace: true,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('leaflet', l);
            mockery.registerMock('wrapper/ajax', new empty());
            mockery.registerMock('\\util', new empty());
            mockery.registerMock('esri-leaflet', new empty());
            mockery.registerMock('stores/configstore', new empty());
            mockery.registerMock('layers/layercolfunc', new empty());
            mockery.registerMock('components/esri/esrilegend', new empty());
            mockery.registerMock('components/displays/tabledisplay', new empty());
            mockery.registerMock('actions/eplactioncreator', new empty());
            mockery.registerMock('components/displays/clickabletablecol', new empty());
            mockery.registerMock('stores/mapstore', new empty());

            Unavailable = require(process.env.NODE_PATH + '/components/displays/unavailable').default;
            Layer = require(process.env.NODE_PATH + '/layers/layer.js').default;
            
        } catch (ex) {
            console.log(ex.stack);
        }

        done();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });


    it('Getter/Setter', (done) => {

        let opts = {
                "name": "my name"
            },
            token = "some token",
            layer = new Layer(opts, token);

        assert.equal(layer.getName(), opts.name, "Getter/Setter Name");
        assert.equal(layer.getOpacity(), "getOpacity", "Getter/Setter getOpacity");

        const legend = shallow(layer.getLegend());
        assert.instanceOf(legend.instance(), Unavailable, "Getter/Setter getLegend");

        done();    
    });

    it('getLegend', (done) => {

        [
            { "legend": "abc.gif" },
            { "legend": "abc.png" },
            { "legend": "abc.jpg" }
        ].forEach((opts, i) => {
            var layer = new Layer(opts, "");
            const legend = shallow(layer.getLegend());

            assert.equal(legend.find('img').length, 1, "Num " + i);
        });

        done();    
    });

    it('retrieveFirstValidValue', (done) => {

        if (!Array.prototype.find) {
            Array.prototype.find = function (callback, thisArg) {
            "use strict";
            var arr = this,
                arrLen = arr.length,
                i;
            for (i = 0; i < arrLen; i += 1) {
                if (callback.call(thisArg, arr[i], i, arr)) {
                    return arr[i];
                }
            }
            return undefined;
            };
        }

        let arr = [
            [[1],1],
            [[null,1],1],
            [[null,null,1],1],
            [[null,null,0,1],0],
            [[null, undefined,0,1],0]
        ];

        arr.forEach((opts, i) => {
            var layer = new Layer({"name":"my name"}, "");
            assert.equal(layer.retrieveFirstValidValue(opts[0]), opts[1], "Test " + i);
        });

        done();    
    });

    it('processIdentifyId', (done) => {

        [
            [[1,2,3], "visible:1,2,3"],
            [[1], "visible:1"],
            [1, "visible:1"]
        ].forEach((opts, i) => {
            var layer = new Layer({"name":"my name"}, "");

            assert.equal(layer.processIdentifyId(opts[0]), opts[1], "Test " + i);
        });

        done();    
    });

    it('getDisplayAttrsByLayerId', (done) => {
        var L = new leaflet(),
            layer = new Layer({"name":"my name"}, "");

        [
            {0: "0", 1: "1", 2: "2"},
            {0: "0", 1: "1", 2: "2"},
            {0: "0", 1: "1", 2: "2"},
            {0: "0", 1: "1", 2: "2", "3-4-5": "3"},
            {"1-2-5": "0", "3-6-8-97-12-44325-21324-3423-332": "1", "0-1-2-3-4": "4"},
        ].forEach((opts, i) => {
            assert.equal(layer.getDisplayAttrsByLayerId(opts, i), i.toString(), "Test " + i);
        });

        assert.isUndefined(layer.getDisplayAttrsByLayerId({0: "0", 1: "1", 2: "2"}, 3));

        done();    
    });

    it('geometryToDrawing', (done) => {
        var L = new leaflet(),
            layer = new Layer({"name":"my name"}, "");

        [
            [{coordinates: [], type: "Point"}, A],
            [{coordinates: [], type: "LineString"}, B],
            [{coordinates: [], type: "Polygon"}, C],
            [{coordinates: [], type: "MultiLineString"}, C],
            [{coordinates: [], type: "MultiPolygon"}, D]
        ].forEach((opts, i) => {
            assert.instanceOf(layer.geometryToDrawing(opts[0], {}), opts[1], "Num " + i);
        });

        assert.isUndefined(layer.geometryToDrawing({coordinates: [], type: "random"}, {}));

        done();    
    });

    it('On Event - Post Add', (done) => {
        let layer = new Layer({"name":"my name"}, ""),
            spyFunc = chai.spy();

        layer.on('postadd', spyFunc);
        expect(spyFunc).to.not.have.been.called();
        layer.addTo(1);
        expect(spyFunc).to.have.been.called();
        layer.on('postadd', spyFunc);
        layer.addTo(1);
        expect(spyFunc).to.have.been.called.exactly(3);

        done();    
    });

    it('On Event - Pre Remove', (done) => {
        let layer = new Layer({"layers": []}, ""),
            map = { 
                addTo: function () {}, 
                removeLayer: function() {} 
            },
            spyFunc = chai.spy();

        layer.on('preremove', spyFunc);
        expect(spyFunc).to.not.have.been.called();
        layer.addTo(map);
        expect(spyFunc).to.not.have.been.called();
        layer.removeMap();
        expect(spyFunc).to.have.been.called();

        done();    
    });

    it('On Event - Change in Spatial Reference', (done) => {
        let layer = new Layer({"name":"my name"}, ""),
            spyFunc = chai.spy();

        layer.on('spatialrefchange', spyFunc);
        expect(spyFunc).to.not.have.been.called();
        layer.setSpatialReference();
        expect(spyFunc).to.have.been.called();

        done();    
    });

    it('On Event - ZIndexChange', (done) => {
        let layer = new Layer({"name":"my name"}, ""),
            spyFunc = chai.spy();

        layer.on('zindexchange', spyFunc);
        expect(spyFunc).to.not.have.been.called();
        layer.setZIndex(1);
        expect(spyFunc).to.have.been.called();

        done();    
    });

    it('Off Events', (done) => {
        let layer = new Layer({"name":"my name"}, ""),
            spyFunc = chai.spy(),
            map = { 
                addTo: function () {}, 
                removeLayer: function() {} 
            };

        layer.addTo(map);

        layer.on('zindexchange', spyFunc);
        expect(spyFunc).to.not.have.been.called();
        layer.setZIndex(1);
        expect(spyFunc).to.have.been.called.once;
        layer.off('zindexchange', spyFunc);
        layer.setZIndex(1);
        expect(spyFunc).to.have.been.called.once;

        done();    
    });

    it('No Filterbox', (done) => {
        let layer = new Layer({"name":"my name"}, "");

        assert.isFalse(layer.showsFilterbox());

        done();    
    });

    it('setLayerDef & getLayerDef', (done) => {
        let layer = new Layer({"name":"my name"}, "");

        layer.setLayerDef(1, 'asd');
        assert.deepEqual(layer.getLayerDefs(), {1: 'asd'});

        done();    
    });


    it('Overlay Settings', (done) => {
        let opts = {
                "name": "Testing",
                "src": "/arcgis/rest/services/Test/MapServer",
                "layers": [0],
                "identifyid": [0],
                "legend": [0],
                "queryId": 0,
                "tolerance": 2
            },
            token = "token test 123",
            layer = new Layer(opts, token);

        assert.equal(opts.src, layer.map.o.url, "Url");
        assert.equal(opts.layers, layer.map.o.layers, "Layers");
        assert.equal(token, layer.map.o.token, "Token");

        done();    
    });
});