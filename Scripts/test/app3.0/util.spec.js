console.log("**************************************************************************");

import mockery from 'mockery';
import { assert, expect } from 'chai';
import { mount, shallow } from 'enzyme';

describe('Util', () => {
    var Util,
        leaflet = class L {
            constructor() {
                this.esri = {
                    get: function (url, callback) {
                    },
                    tiledMapLayer: function(o) { 
                        return {
                            tileUrl: '',
                            addTo: function (a) {}
                        }; 
                    }
                };
                this.CRS = {};
            }
        },
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
            mockery.registerMock('proj4leaflet', new empty());
            mockery.registerMock('stores/configstore', new empty());
            mockery.registerMock('constants/featureconstants', new empty());
            mockery.registerMock('d3', new empty());
            mockery.registerMock('perfect-scrollbar', new empty());
            mockery.registerMock('datejs', new empty());

            Util = require(process.env.NODE_PATH + '/util.js').default;
            
        } catch (ex) {
            console.log(ex.stack);
        }

        done();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should test objectValues', (done) => {
        
        let obj = {
            1: "a",
            "a": "b",
            0: "c",
        };

        expect(Util.objectValues(obj).sort()).to.be.deep.equal(["a", "b", "c"].sort());

        done();
    });

    it('should test isAbsUrl', (done) => {
        
        let truthy = [
            "http://google.com",
            "http://www.ura.gov.sg",
            "https://google.com"
        ], falsey = [
            "ftp://google.com",
            "/test/file/a"
        ];

        truthy.forEach((item, i) => {
            assert.isTrue(Util.isAbsUrl(item), "Truthy Test " + i);
        });
        
        falsey.forEach((item, i) => {
            assert.isFalse(Util.isAbsUrl(item), "Falsey Test " + i);
        });

        done();
    });

    it('should test isArray', (done) => {
        
        let truthy = [
            [1,2,3],
            ["123", "asd"],
            ["123", 123],
            [{a:1}, 0, null],
            []
        ], falsey = [
            "string",
            0,
            //undefined,
            //null,
            {a : []},
            /abc/
        ];

        truthy.forEach((item, i) => {
            assert.isTrue(Util.isArray(item), "Truthy Test " + i);
        });
        
        falsey.forEach((item, i) => {
            assert.isFalse(Util.isArray(item), "Falsey Test " + i);
        });

        done();
    });

    it('should test withinPercentage', (done) => {
        
        let truthy = [
            [2, 2, 0.1],
            [1, 2, 0.51],
            [8, 10, 0.21],
            [9, 10, 0.11]
        ], falsey = [
            [10, 1, 0.99],
            [1, 2, 0.5],
            [1, 2, 0.49],
            [1.1, 2, 0.44], // cause 1.1 / 2 will return double, subsequent values will be 0.4499999999... thus unable to test with 0.45
            [1.9, 2, 0.05],
        ];

        truthy.forEach((item, i) => {
            assert.isTrue(Util.withinPercentage(item[0], item[1], item[2]), "Truthy Test " + i);
        });
        
        falsey.forEach((item, i) => {
            assert.isFalse(Util.withinPercentage(item[0], item[1], item[2]), "Falsey Test " + i);
        });

        done();
    });
});