/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : map.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2014
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

import L    from 'leaflet';
import Esri from 'esri-leaflet';

export default class Map {
    constructor(opts) {
        let defaultConfig = opts.defaultConfig;
        this.highlights = [];
        this.opts = opts || {};
        this.basemap = null;
        this.map = L.map(opts.id, {
            center: defaultConfig.center,
            zoom: defaultConfig.zoom
        });
        //L.esri.basemapLayer("Gray").addTo(this.map);
        this.map.removeControl(this.map.zoomControl);
    }

    reset() {
        let defaultConfig = this.opts.defaultConfig,
            defaultBasemap = defaultConfig.basemap;

        this.clearHighlights();
        this.setZoom(defaultConfig.zoom);
        this.setCenter(defaultConfig.center);
        this.setBasemap(defaultBasemap); 
    }

    isCurrBasemap(basemap) {
        return this.basemap && basemap.name === this.basemap.name;
    }

    setCenter(position) {
        this.map.setView(position);
    }

    setZoom(zoom) {
        this.map.setZoom(zoom);
    }

    setBasemap(basemap) {
        // same basemap, nothing to change
        if (this.isCurrBasemap(basemap)) {
            return;
        }

        let center = this.map.getCenter();

        //REQUIRED for CRS changing: https://github.com/Leaflet/Leaflet/issues/2553
        if (this.basemap) {
            this.map.removeLayer(this.basemap.obj);
        }

        if (basemap.crs) {
            this.map.options.crs = basemap.crs; //Default L.CRS.EPSG3857
        }
        this.map.setView(center);
        this.map._resetView(center, this.map.getZoom(), true);
        //\REQUIRED

        basemap.obj.addTo(this.map);

        this.basemap = basemap;
    }

    getBasemapMinZoom(basemap) {
        return basemap && basemap.crs ? basemap.minZoom : 0;
    }

    highlight(latLng) {
        var marker = L.marker(latLng).addTo(this.map);
        this.highlights.push(marker);
        return marker;
    }

    clearHighlights() {
        this.highlights.map(highlight => {
            this.map.removeLayer(highlight);
        });
        this.highlights = [];
    }

    addLayer(layer) {
        this.map.addLayer(layer.getLayerObj());
    }

    removeLayer(layer) {
        this.map.removeLayer(layer.getLayerObj())
    }

    onIdentify(fn) {
        this.map.on('click', fn);
    }
}