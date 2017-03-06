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
        "category": "Maps",
        "image": "icon-underground",
        "layers": [
            {
                "name":"Parks & Waterbodies Plan",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/MP14_PW_gaz_maps/MapServer",
                "layers": [0],
                "identifyid": [0] 
            },
            {
                "name": "Master Plan (Approved Amendments Incorporated)",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/Updated_Gaz_MP14_Land_Use_Maps/MapServer",
                "layers": [0],
                "identifyid": [0],
                "legend": [0,1,2]
            },
            {
                "name": "Master Plan 2014",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/MP14_Land_Use_gaz_maps/MapServer",
                "layers": [0,1,2],
                "identifyid": [0,1,2],
                "layerinfo": "Currently showing all water network except for treated water type. Zoom in to view treated water network</a>",
                "legend": [0,1]
            },
            {
                "name": "Landed Housing Areas Plan",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/MP14_LHA_gaz_maps/MapServer",
                "layers": [0,1,2],
                "identifyid": [0,1,2],
                "layerinfo": "Currently showing all water network except for treated water type. Zoom in to view treated water network</a>",
                "legend": [0,1]
            },
            {
                "name": "Building Height Plan",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/MP14_BLDG_HT_gaz_maps/MapServer",
                "layers": [0,1,2],
                "identifyid": [0,1,2],
                "layerinfo": "Currently showing all water network except for treated water type. Zoom in to view treated water network</a>",
                "legend": [0,1]
            },
            {
                "name": "Activity Generating Uses Plan",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/MP14_AGU_gaz_maps/MapServer",
                "layers": [0,1,2],
                "identifyid": [0,1,2],
                "layerinfo": "Currently showing all water network except for treated water type. Zoom in to view treated water network</a>",
                "legend": [0,1]
            },
            {
                "name": "Street Block,Urban Design Area,Conservation & Monuments Plan",
                "src": "https://wuat.ura.gov.sg/ArcGis/rest/services/maps2/MP14_SBUD_gaz_maps/MapServer",
                "layers": [0,1,2],
                "identifyid": [0,1,2],
                "layerinfo": "Currently showing all water network except for treated water type. Zoom in to view treated water network</a>",
                "legend": [0,1]
            }
        ]
    }
];

export default MapData;