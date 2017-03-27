/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layermanager.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import L from 'leaflet';
import Esri from 'esri-leaflet';
import Util from 'utils';
import BaseStore from 'stores/basestore';
import LayerFactory from 'layers/layerfactory';
import BasemapConfig from 'basemapconfig';
import MapConstants from 'constants/mapconstants';
import EplConstants from 'constants/eplconstants';
import EventEmitter from 'eventemitter2';
import UrlConstants from 'constants/urlconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplActionCreator from 'actions/eplactioncreator';
import FeatureConstants from 'constants/featureconstants';
import LayerManagerStore from 'stores/layermanagerstore';
import DrawManager from 'drawmanager';
import Proj4Leaflet from 'proj4leaflet';
import 'leaflet-draw';
import BufferStore from 'stores/bufferstore';
import DrawStore from 'stores/drawstore';
import Map3DStore from 'stores/3dmapstore';
import ClusterManager from 'stores/clustermanager';
import Clusterstore from 'stores/clusterstore';
import QuicklinkStore from 'stores/quicklinkstore';

class MapStore extends BaseStore {

    constructor() {
        super();
        //this.initDevEnv();
        this.defaultBasemapName = "OneMap 2.0 (Grey)";
        this.dualDefaultName = "Google Map";
        this.currBasemapName = {};
        this.center = [1.3607837274175492, 103.8059931081907];
        this.zoom = 11;
        this.basemaps = {};
        this.loadCrs();
        this.loadBasemap();
        this._maps = [];
        this.firstMap = null;
        this.configMap = null;
        this.siteInfo = {};
        this.highlights = [];
        this.icon = L.icon({
            iconUrl: 'Content/img/information.png',
            iconAnchor: [16, 37]
        });
        this.identifyMarker = L.marker([0, 0], { icon: this.icon });
        this.mapOnClickIdentifyHandler = function(e) {
            EplActionCreator.identify(e.latlng);
        };
        this.circles = [];
    }

    initialize(mapId, domNode) {
        //TODO: Wrap this into class
        var map = L.map(domNode);
        let initBasemapName = "";
        this.currBasemapName[mapId] = this.defaultBasemapName;
        map.domNode = domNode;
        map.mapId = mapId;

        //Main map
        if (mapId === MapConstants.Main) {
            this.configMap = this.firstMap = map;
            Util._map = map;
            this.enableMapOnClickIdentifyHandler();

            map.on('zoomend', e => {
                for (var i = 1, mapLength = this._maps.length; i < mapLength; i++) {
                    this._maps[i].setZoom(e.target.getZoom());
                }
            });

            map.on('move', e => {
                for (var i = 1, mapLength = this._maps.length; i < mapLength; i++) {
                    this._maps[i].setView(e.target.getCenter());
                }
            });

            //Register for new event => basemapchange, which will change all selected layers' spatial reference for bboxSr & imageSr
            map.on('basemapchange', e => {
                let selected = LayerManagerStore.getSelected();

                selected.map(layer => {
                    if (map.options.crs && map.options.crs.code) {
                        var sr = map.options.crs.code.split(':')[1];
                        layer.setSpatialReference(sr);
                    }
                });
            });
            initBasemapName = this.defaultBasemapName;
            this.configureBasemap();
        }

        this._maps.push(map);
        this.reset(map);

        if (mapId === MapConstants.Dual) {
            //Secondary map
            initBasemapName = this.dualDefaultName;
            this.configureDualBasemap()
        }

        this.setBasemap(initBasemapName, true);

        //config draw manager
        this.configDrawManager(map);
        //DACS interfaces

        //config cluster manager
        this.configClusterManager(map);
    }

    destroy(mapId) {
        for (var i = 0, mapLength = this._maps.length; i < mapLength; i++) {
            if (mapId === 0) {
                EplActionCreator.reset();
            }

            if (mapId === this._maps[i].mapId) {
                this._maps[i].remove();
                this._maps.splice(i, 1);
                break;
            }
        }
        this.currBasemapName = {};
    }

    identify(latLng) {
        // Only require to identify for the first map
        this.identifyMarker.setLatLng(latLng);
        this.identifyMarker.addTo(this.firstMap);
    }

    resetAll() {
        this._maps.map((map) => {
            this.reset(map);
        });
        //clear
        BufferStore.clearBuffer();
        DrawStore.clearDrawing();
        Clusterstore.clearGeoPhotoLayer();
        QuicklinkStore.clearUI();
        this.removeCircles();
        L.DomUtil.get('loading-div').style.display = 'none';
    }

    reset(map) {
        this.clearHighlights(map);
        map.setView(this.getDefaultCenter(), this.getDefaultZoom());
        this.setBasemapByMap(map, (map.mapId === MapConstants.Main ? this.defaultBasemapName : this.dualDefaultName));

        this.identifyMarker.remove();
    }

    resetMapSize() {
        this._maps.map((map, i) => {
            map.invalidateSize();
        });
    }

    addLayer(layer) {
        if (this.firstMap) {
            //display loading icon
            L.DomUtil.get('loading-div').style.display = 'block';
            layer.addTo(this.firstMap);
            layer.setOpacity(layer.defaultSettings.defaultOpacity);

        }
    }

    removeLayer(layer) {
        layer.removeMap();
    }

    removeAllLayers(layers) {
        layers.map(layer => {
            this.removeLayer(layer);
        });
    }

    getCenter() {
        return this.firstMap.getCenter();
    }

    getZoom() {
        return this.firstMap.getZoom();
    }

    getDefaultCenter() {
        return this.center;
    }

    getDefaultZoom() {
        return this.zoom;
    }

    getSiteInfo() {
        return this.siteInfo;
    }

    setMapsView(center, zoom) {
        this._maps.map((map, i) => {
            map.setView(center, zoom);
        });
    }

    fitBounds(bounds) {
        this._maps.map((map, i) => {
            map.fitBounds(bounds);
        });
    }

    isCurrBasemap(mapId, basemapName) {
        return basemapName === this.currBasemapName[mapId];
    }

    setBasemap(newBasemapName, overwrite = false) {
        if (this.configMap) {
            this.setBasemapByMap(this.configMap, newBasemapName, overwrite);
        } else {
            console.log("setBasemap: no configMap");
        }
    }

    configureBasemap() {
        this.configMap = this.firstMap;
    }

    configureDualBasemap() {
        this.configMap = this._maps[1];
    }

    //TODO: refactor map logic into map class
    setBasemapByMap(map, newBasemapName, overwrite = false) {

        // same basemap, nothing to change
        if (!map || (!overwrite && this.isCurrBasemap(map.mapId, newBasemapName))) {
            //return;
        }

        let center = map.getCenter();

        //REQUIRED for CRS changing: https://github.com/Leaflet/Leaflet/issues/2553
        var newBasemap = this.getBasemap(newBasemapName);
        var origBasemap = this.getBasemap(this.currBasemapName[map.mapId]);

        if (origBasemap) {
            origBasemap.remove(map);
        }

        //\REQUIRED

        newBasemap.addTo(map);

        map.options.crs = newBasemap.crs ? newBasemap.crs : L.CRS.EPSG3857;

        this.currBasemapName[map.mapId] = newBasemapName;

        //map.setView(center);
        map._resetView(center, map.getZoom(), true);

        //Triggering new basemapchange
        map.fire('basemapchange');
    }

    getBasemap(name) {
        return this.basemaps[name ? name : this.currBasemapName[MapConstants.Main]];
    }

    getBasemaps() {
        return this.BasemapConfig;
    }

    initDevEnv() {
        Object.keys(UrlConstants).map(key => {
            UrlConstants[key] = Util.buildToDeployServer(UrlConstants[key]);
        });
    }

    loadBasemap() {
        this.BasemapConfig = BasemapConfig;
        this.BasemapConfig.forEach(config => {

            //initial load for all basemap metadata. once default is loaded, set basemap to it
            var func = () => {
                this.setBasemap(this.defaultBasemapName, true);
            };

            this.basemaps[config.name] = LayerFactory.getBasemap(config.class, config, (config.name === this.defaultBasemapName) ? func : null);
        });
    }

    loadCrs() {

        //TODO: to be refactored into Leaflet/Esri extension file

        Esri.DynamicMapLayer.prototype.setZIndex = function(zIndex) {
            this.options.zIndex = zIndex;

            if (this._currentImage) {
                this._currentImage.setZIndex(zIndex);
            }
        }

        L.ImageOverlay.prototype.setZIndex = function(zIndex) {
            this.options.zIndex = zIndex;
            this.updateZIndex();
        }

        L.ImageOverlay.prototype.updateZIndex = function(zIndex) {
            if (this._map) {
                this._image.style.zIndex = this.options.zIndex;
            }
        }

        L.Proj.CRS.prototype.scale = function(zoom) {
            let zoomAttr = this._lodMap ? this._lodMap[zoom] : zoom,
                scalesAttr = this._scales ? this._scales : Util.MercatorZoomLevels;

            return scalesAttr[zoomAttr];
        }

        L.CRS['SVY21'] = new L.Proj.CRS('EPSG:3414', 'PROJCS["SVY21",GEOGCS["SVY21[WGS84]",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",28001.642],PARAMETER["False_Northing",38744.572],PARAMETER["Central_Meridian",103.8333333333333],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",1.366666666666667],UNIT["Meter",1.0]]', {
            origin: [-5878011.89743302, 10172511.897433],
            resolutions: [
                76.43721954110575,
                38.218609770552874,
                19.109304885276437,
                9.554652442638218,
                4.777326221319109,
                2.3886631106595546,
                1.1943315553297773,
                0.5971657776648887,
                0.2984505969011938
            ],
            _lodMap: { 11: 0, 12: 1, 13: 2, 14: 3, 15: 4, 16: 5, 17: 6, 18: 7, 19: 8 }
        });
    }

    locateUser() {
        Util.getCurrentPosition(
            position => {
                let latlng = Util.toPointObject(position.coords.latitude, position.coords.longitude);
                this.highlightZoomCenter(latlng);
            },
            error => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        // User denied access to location. Perhaps redirect to alternate content?
                        EplActionCreator.displayMessage('Unable to detect current location.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        EplActionCreator.displayMessage('Position is currently unavailable.');
                        break;
                    case error.PERMISSION_DENIED_TIMEOUT:
                        EplActionCreator.displayMessage('User did not grant/deny permission.');
                        break;
                    case error.UNKNOWN_ERROR:
                        EplActionCreator.displayMessage('Unable to detect current location.');
                        break;
                }
            }
        );
    }

    createCircle(latlng, radius, opts) {
        let circle = L.circle(latlng, radius, opts).addTo(this._maps[0]);
        this.circles.push(circle);
        return circle;
    }

    removeCircles() {
        this.circles.forEach((circle) => {
            circle.remove();
        })
        this.circles = [];
    }

    highlightZoomCenter(geometry, zoom, center) {
        L.Icon.Default.imagePath = 'Content/img/leaflet/'
        let marker,
            map = this._maps[0],
            markerOpts = {
                zIndex: 1000,
                clickable: false
            };

        if (geometry) {
            if (this.highlights.length > 0) {
                this.clearHighlights(map);
            }

            //TODO: Merge with layer.js and migrate into a geometry file
            switch (geometry.type) {
                case FeatureConstants.Point:
                    marker = new L.marker(geometry.coordinates[0] || geometry.coordinates, markerOpts).addTo(map);
                    this.highlights.push(marker);
                    break;
                case FeatureConstants.Line:
                    marker = new L.polygon(geometry.coordinates, markerOpts).addTo(map).bringToFront();
                    this.highlights.push(marker);
                    break;
                case FeatureConstants.Polygon:
                    geometry.coordinates.map(region => {
                        marker = new L.polygon(region, markerOpts).addTo(map).bringToFront();
                        this.highlights.push(marker);
                    });
                    break;
                case FeatureConstants.MultiLine:
                    marker = new L.polyline(geometry.coordinates, markerOpts).addTo(map).bringToFront();
                    this.highlights.push(marker);
                    break;
                case FeatureConstants.MultiPolygon:
                    marker = new L.polygon(geometry.coordinates, markerOpts).addTo(map).bringToFront();
                    this.highlights.push(marker);
                    break;
                default:
                    console.log("highlightZoomCenter: Unknown geometry type");
                    break;
            }
        }

        if (center && zoom) {
            this.setMapsView(center, zoom);
        } else if (zoom) {
            this.setMapsView(marker.getBounds().getCenter(), zoom);
        }
    }

    clearAllMapHighlights() {
        this._maps.map((map) => {
            this.clearHighlights(map);
        });
    }

    removeIdentifyMarker() {
        this._maps.map((map) => {
            this.identifyMarker.remove();
        });
    }

    clearHighlights(map) {
        this.highlights.forEach(highlight => {
            highlight.remove();
        });
        this.highlights = [];
    }

    invalidateMapSize() {
        this._maps.map(map => {
            map.invalidateSize();
        });
    }

    storeSiteInfo(results) {
        this.siteInfo = results;
    }

    //init drawing tool
    configDrawManager(map) {
        this.drawManager = new DrawManager(map);
        this.drawManager.initialize();
    }

    //clustering
    configClusterManager(map) {
        this.clusterManager = new ClusterManager(map);
        this.clusterManager.initialize();
    }

    //disable map on click identify task 
    disableMapOnClickIdentifyHandler() {
        var map = this.firstMap;
        if (!map) {
            return;
        }
        var mapOnClickIdentifyHandler = this.mapOnClickIdentifyHandler;
        map.off('click', mapOnClickIdentifyHandler);
    }

    //enable map on click identify task 
    enableMapOnClickIdentifyHandler() {
        var map = this.firstMap;
        if (!map) {
            return;
        }
        var mapOnClickIdentifyHandler = this.mapOnClickIdentifyHandler;
        map.on('click', mapOnClickIdentifyHandler);
    }

}

var instance = new MapStore();

instance.dispatchToken = AppDispatcher.register(function(action) {
    if (!Map3DStore.isInitialized()) {
        switch (action.actionType) {
            case EplConstants.SetBasemap:
                instance.setBasemap(action.basemapName);
                instance.emitChanges();
                break;
            case EplConstants.Reset:
                instance.resetAll();
                instance.removeAllLayers(LayerManagerStore.getSelected());
                instance.emitChanges();
                break;
            case EplConstants.AddLayer:
                if (!LayerManagerStore.isSelected(action.layerName)) {
                    instance.addLayer(LayerManagerStore.getLayerByName(action.layerName));
                }
                break;
            case EplConstants.RemoveLayer:
                instance.removeLayer(LayerManagerStore.getLayerByName(action.layerName));
                instance.clearAllMapHighlights();
                break;
            case EplConstants.RemoveAllLayers:
                instance.removeAllLayers(LayerManagerStore.getSelected());
                instance.clearAllMapHighlights();
                instance.emitChanges();
                break;
            case EplConstants.ShowLayerSummary:
                break;
            case EplConstants.ShowLayerStatistics:
                break;
            case EplConstants.LocateUser:
                instance.locateUser();
                break;
            case EplConstants.HighlightZoomCenterMap:
                instance.highlightZoomCenter(action.geometry, action.zoom, action.center);
                break;
            case EplConstants.Identify:
                instance.identify(action.latLng);
                break;
            case EplConstants.ToggleBasemap:
                instance.configureBasemap();
                break;
            case EplConstants.ToggleDualBasemap:
                instance.configureDualBasemap();
                break;
            case EplConstants.ResetMapSize:
                instance.resetMapSize();
                break;
            case EplConstants.QuerySiteInfoComplete:
                instance.storeSiteInfo(action.results);
                instance.emitChanges();
                break;
            case EplConstants.ClearHighlights:
                instance.clearAllMapHighlights();
                break;
            case EplConstants.SetMapsView:
                instance.setMapsView(action.center, action.zoom);
                break;
            case EplConstants.FitBounds:
                instance.fitBounds(action.bounds);
                break;
            case EplConstants.RemoveIdentifyMarker:
                instance.removeIdentifyMarker();
                break;
            default:
                //no op
        }
    }
});

export default instance;