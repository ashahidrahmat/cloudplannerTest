/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : basic class for layer
 * AUTHOR          : louisz
 * DATE            : Jan 5, 2016
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

import Basemap from 'basemap';
import Layer from 'layers/layer';
//import {default as All} from 'layers/entities/index';

class LayerFactory {

    constructor() {
        this.classes = {};
        /*
        for(var className in All) { 
            this.classes[className] = All[className];
        }
        */
    }

    getLayer(name, opts) {
        var layerClass = this.classes[name] ? this.classes[name] : Layer;
        return new layerClass(opts);
    }

    getBasemap(name, opts, func) {
        var basemapClass = Basemap;
        return new basemapClass(opts, func);
    }
}

export default new LayerFactory();