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
import Util from '\\util';
import React from 'react';
import Basemap from 'basemap'
import OSMBuildings from 'libs/osmbuilding/OSMBuildings-Leaflet.debug';

export default class Osmb extends Basemap {

    addTo(map) {

        var layer, 
            found = false;

        for (var i = this.obj.length - 1; i >= 0; i--) {
            if (!this.obj[i].mapId) {
                layer = this.obj[i];
                found = true;
                break;
            }
        }

        //check if root object exist, else create new object
        var layer = layer ? layer : this.getBasemapClassObj();
        this.osmb = new OSMBuildings(map)
        this.osmb.load();
        if (!found) {
            this.obj.push(layer);
        }

        layer._lodMap = this._lodMap;
        layer.mapId = map.mapId;
        layer.addTo(map);
    }

    remove(map) {
        this.osmb.map.removeLayer(this.osmb);
        super.remove(map);
    }
}