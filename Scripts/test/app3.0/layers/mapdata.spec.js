console.log("**************************************************************************");

import mockery from 'mockery';
import { assert, expect } from 'chai';
import { mount, shallow } from 'enzyme';

describe('MapData', () => {

    var Layer, MapData,
        empty = class Empty {
            constructor() {}
        };

    before((done) => {
        try {
            mockery.enable({
                warnOnReplace: true,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('leaflet', new empty());
            mockery.registerMock('components/displays/img', new empty());
            mockery.registerMock('wrapper/ajax', new empty());
            mockery.registerMock('\\util', new empty());
            mockery.registerMock('esri-leaflet', new empty());
            mockery.registerMock('stores/configstore', new empty());
            mockery.registerMock('layers/layercolfunc', new empty());
            mockery.registerMock('components/esri/esrilegend', new empty());
            mockery.registerMock('components/displays/unavailable', new empty());
            mockery.registerMock('components/displays/tabledisplay', new empty());
            mockery.registerMock('actions/eplactioncreator', new empty());
            mockery.registerMock('constants/featureconstants', new empty());
            mockery.registerMock('components/displays/clickabletablecol', new empty());
            mockery.registerMock('stores/mapstore', new empty());

            Layer = require(process.env.NODE_PATH + '/layers/layer.js').default;
            MapData = require(process.env.NODE_PATH + '/layers/mapdata.js').default;
            
        } catch (ex) {
            console.log(ex.stack);
        }

        done();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('MapData config allowable fields', (done) => {

        MapData.forEach((category, i) => {
            category.layers.forEach((layerConfig, j) => {         
                Object.keys(layerConfig).forEach((key, k) => {
                    assert.isTrue(Layer.PermittedConfigParams.indexOf(key) >= 0, "Allowable Fields Test Category " + i + " Layer " + j + " Key '" + key + "'");
                }); 
            });
        });

        done();    
    });
});