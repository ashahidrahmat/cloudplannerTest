 /* VERSION NO      : 2.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     : {
                        category: layer category
                        image: url for category icon
                        layers data: {
                           name:            for displaying proper layer name on the left panel
                           src:             ArcGIS map service url
                           layers:          initial displaying layer id(s) e.g.: [0,1,2]
                           tiled:           1 indicates tiled map service
                           identifyid:      initial layer id(s) for identify taks e.g. [2,3]
                           buffer:          1 indicates this layer is bufferable
                           legend:          initial layer id(s) for displaying legends e.g. [1,23]
                           layerinfo:       description to show on initial adding of layer
                           layerinfodelay:  duration (ms) show the description, negative to show forever.
                         }
                    }
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG  	   :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import UnicodeConstant from 'constants/unicodeconstants';
//TODO: layers not working
var MapData = [
    {
    }
];

export default MapData;