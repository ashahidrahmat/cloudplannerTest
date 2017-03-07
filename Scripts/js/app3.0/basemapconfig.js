/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : basemapConfig.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : yujianmin
 * DATE            : Nov 24, 2014
 * VERSION NO      : 2.0
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

let BasemapConfig = [{
    "name": "OneMap 2.0",
    "src": "http://maps-{s}.onemap.sg/v2/Default/{z}/{x}/{y}.png",
    "internet": true
}, {
    "name": "OneMap 2.0 (Night)",
    "src": "http://maps-{s}.onemap.sg/v2/Night/{z}/{x}/{y}.png",
    "internet": true
}, {
    "name": "OneMap 2.0 (Grey)",
    "src": "http://maps-{s}.onemap.sg/v2/Grey/{z}/{x}/{y}.png",
    "internet": true
}, {
    "name": "OneMap 2.0 (Original)",
    "src": "http://maps-{s}.onemap.sg/v2/Original/{z}/{x}/{y}.png",
    "internet": true
}, {
    "name": "OpenStreetMap",
    "src": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "internet": true
}, {
    "name": "Google Map",
    "src": "https://mt{s}.googleapis.com/vt?x={x}&y={y}&z={z}",
    "subdomains": '123',
    "legend": "N/A",
    "internal": 0,
    "description": "Street map from Google. Please refer to Google Map's Term and Condition for the updateness of the map."
}, {
    "name": "Parks & Waterbodies Plan",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/MP14_PW_gaz_maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}, {
    "name": "Master Plan (Approved Amendments Incorporated)",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/Updated_Gaz_MP14_Land_Use_Maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}, {
    "name": "Master Plan 2014",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/MP14_Land_Use_gaz_maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}, {
    "name": "Landed Housing Areas Plan",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/MP14_LHA_gaz_maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}, {
    "name": "Building Height Plan",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/MP14_BLDG_HT_gaz_maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}, {
    "name": "Activity Generating Uses Plan",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/MP14_AGU_gaz_maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}, {
    "name": "Street Block,Urban Design Area,Conservation & Monuments Plan",
    "crs": "EPSG3857",
    "src": "https://www.ura.gov.sg/ArcGis/rest/services/maps2/MP14_SBUD_gaz_maps/MapServer",
    "description": "The Master Plan (MP) is the statutory land use plan which guides Singapore's development " +
        "in the medium term over the next 10 to 15 years. It is reviewed every five years and " +
        "translates the broad long-term strategies of the Concept Plan into detailed plans to guide " +
        "the development of land and property. The Master Plan shows the permissible land use and " +
        "density for developments in Singapore."
}];

export default BasemapConfig;
