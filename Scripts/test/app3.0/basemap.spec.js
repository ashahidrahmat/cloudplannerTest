console.log("**************************************************************************");

import mockery from 'mockery';
import { assert, expect } from 'chai';
import { mount, shallow } from 'enzyme';

describe('Basemap', () => {
    var Basemap,
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
        },
        util = class Util {
            isAbsUrl(a) { return a; }
            buildToDeployServer(a) { return a; }
            withinPercentage() { return true; }
            MercatorZoomLevels = [];
        };

    before((done) => {
        try {
            mockery.enable({
                warnOnReplace: true,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('leaflet', new leaflet());
            mockery.registerMock('esri-leaflet', new empty());
            mockery.registerMock('\\util', new util());
            mockery.registerMock('components/displays/basemapdesc', new empty());

            Basemap = require(process.env.NODE_PATH + '/basemap.js').default;
            
        } catch (ex) {
            console.log(ex.stack);
        }

        done();
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should use configuration', (done) => {
        
        let config = {
	            "name": "My basemap name",
	            "src": "src1",
	            "legend": "/src2",
	            "imageUrl": "/img3",
	            "description" : "some description"
            },
            token = "some token",
            basemap = new Basemap(config, token);

        expect(basemap.getImageUrl()).to.be.equal(config.imageUrl);
        expect(basemap.getDescription()).to.be.equal(config.description);

        done();
    });

    it('should store multiple BasemapClassObj as each BasemapClassObj can only be added to 1 map', (done) => {
        class Map {
            constructor(id) {
                this.mapId = id;
            }
            
            removeLayer(a) {}
        }

        let config = {
	            "name": "My basemap name",
	            "src": "src1",
	            "legend": "/src2",
	            "imageUrl": "/img3",
	            "description" : "some description"
            },
            token = "some token",
            basemap = new Basemap(config, token),
            mapA = new Map("id A"), 
            mapB = new Map("id B"),
            mapC = new Map("id C");

        basemap.addTo(mapA);
        basemap.addTo(mapB);

        expect(basemap.getNumOfBasemapClassObj()).to.be.equal(2);

        basemap.remove(mapB);
        expect(basemap.getNumOfBasemapClassObj()).to.be.equal(1);

        basemap.addTo(mapB);
        expect(basemap.getNumOfBasemapClassObj()).to.be.equal(2);
        
        basemap.addTo(mapC);
        expect(basemap.getNumOfBasemapClassObj()).to.be.equal(3);

        done();
    });
});