/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : basemap.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
 * DATE            : Mar 24, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      : 
 * RETURN          :     
 * USAGE NOTES     :
 * COMMENTS        : 
---------------------------------------------------------------------------------------------------
 * CHANGE LOG  	   : 
 * CHANGED BY      : 
 * DATE            : 
 * VERSION NO      : 
 * CHANGES         : 
--------------------------------------------------------------------------------------------------*/

import L from 'leaflet';
import Esri from 'esri-leaflet';
import Util from 'utils';
import React from 'react';
import BasemapDesc from 'components/displays/basemapdesc';

class Basemap {

    static PermittedConfigParams = [
        'name', 'class', 'src', 'crs', 'subdomains', 'legend', 'imageUrl', 'description', 'internet', 'useCors'
    ];

    constructor(basemap, func) {
        var layer,
            scope = this;

        this._lodMap = {};
        //this.id = Util.getObjId("basemap");
        this.basemap = basemap;
        this.internal = !Util.isAbsUrl(basemap.src);
        //this.src = basemap.src = Util.buildToDeployServer(basemap.src);
        this.crs = L.CRS[basemap.name] || L.CRS[basemap.crs];
        this.obj = [];

        this.opts = {
            url: basemap.src,
            minZoom: 12,
            maxZoom: 20,
            continuousWorld: true,
            useCors: basemap.useCors | false,
            zIndex: 0
        };

        //add subdomains if requires
        if (basemap.subdomains) {
            this.opts.subdomains = basemap.subdomains;
        }

        if (!this.crs) {
            this.obj.push(this.generateLayer());
        }
    }

    generateLayer() {
        var layer = this.getBasemapClassObj();

        if (!this.isArcGisService) {
            layer.tileUrl = layer.tileUrl.replace(/\/tile\/{z}\/{y}\/{x}$/, "");
        }

        return layer;
    }


    remove(map) {

        //find the added object to be removed
        for (var i = 0, len = this.obj.length; i < len; i++) {
            if (this.obj[i].mapId === map.mapId) {
                map.removeLayer(this.obj[i]);
                this.obj[i].mapId = null;
                break;
            }
        }
    }

    // Each tiledMapLayer cannot only be added to 1 map
    // Special case to create new tiledMapLayer and store it
    // if it has not been created
    addTo(map) {

        var layer,
            found = false;

        for (var i = this.obj.length - 1; i >= 0; i--) {
            if (this.obj[i].mapId == null) {
                layer = this.obj[i];
                found = true;
                break;
            }
        }

        //check if root object exist, else create new object
        var layer = layer ? layer : this.getBasemapClassObj();
        if (!found) {
            this.obj.push(layer);
        }

        if (this.crs && this.crs.options && this.crs.options._lodMap) {
            layer._lodMap = this._lodMap;
        }

        layer.mapId = map.mapId;
        layer.addTo(map);
    }

    getBasemapClassObj() {
        return Esri.tiledMapLayer(this.opts);
    }

    getInfo() {
        return <BasemapDesc imageUrl = { this.getImageUrl() }
        desc = { this.getDescription() }
        />;
    }

    getImageUrl() {
        return this.basemap.imageUrl;
    }

    getDescription() {
        return this.basemap.description;
    }

    getNumOfBasemapClassObj() {
        return this.obj.filter(o => {
            return o.mapId != null;
        }).length;
    }
}

export default Basemap;