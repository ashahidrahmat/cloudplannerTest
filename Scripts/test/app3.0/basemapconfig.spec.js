console.log("**************************************************************************");

import mockery from 'mockery';
import { assert, expect } from 'chai';
import { mount, shallow } from 'enzyme';

describe('BasemapConfig', () => {

    var Basemap, BasemapConfig,
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
            mockery.registerMock('esri-leaflet', new empty());
            mockery.registerMock('\\util', new empty());
            mockery.registerMock('components/displays/basemapdesc', new empty());

            Basemap = require(process.env.NODE_PATH + '/basemap.js').default;
            BasemapConfig = require(process.env.NODE_PATH + '/basemapconfig.js').default;
            
        } catch (ex) {
            console.log(ex.stack);
        }

        done();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    
    it('basemap config required fields', (done) => {
        
        BasemapConfig.forEach((config, i) => {
            assert.isDefined(config.name, "Required Fields Test (name) Num " + i);
            assert.isDefined(config.src, "Required Fields Test (src) Num" + i);
        });

        done();    
    });

    it('basemap config allowable fields', (done) => {
        
        BasemapConfig.forEach((config, i) => {
            Object.keys(config).forEach((key, j) => {
                assert.isTrue(Basemap.PermittedConfigParams.indexOf(key) >= 0, "Allowable Fields Test Num " + i + " Key " + j);
            }); 
        });

        done();    
    });
});