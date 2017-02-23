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
 * CHANGE LOG  	   : 
 * CHANGED BY      : 
 * DATE            : 
 * VERSION NO      : 
 * CHANGES         : 
--------------------------------------------------------------------------------------------------*/
    
let BasemapConfig = [
    {
        "name": "OneMap 2.0",
        "src": "http://maps-{s}.onemap.sg/v2/Default/{z}/{x}/{y}.png",
        "imageUrl": "/Content/img/basemaps/groad-l.png",
        "internet": true,
        "description": "",
        "useCors": true
    },
    {
        "name": "OneMap 2.0 (Night)",
        "src": "http://maps-{s}.onemap.sg/v2/Night/{z}/{x}/{y}.png",
        "imageUrl": "/Content/img/basemaps/groad-l.png",
        "internet": true,
        "description": "",
        "useCors": true
    },
    {
        "name": "OneMap 2.0 (Grey)" ,
        "src": "http://maps-{s}.onemap.sg/v2/Grey/{z}/{x}/{y}.png",
        "imageUrl": "/Content/img/basemaps/groad-l.png",
        "internet": true,
        "description": "",
        "useCors": true
    },
    {
        "name": "OneMap 2.0 (Original)",
        "src": "http://maps-{s}.onemap.sg/v2/Original/{z}/{x}/{y}.png",
        "imageUrl": "/Content/img/basemaps/groad-l.png",
        "internet": true,
        "description": "",
        "useCors": true
    },
    {
        "name": "OpenStreetMap",
        "src": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "imageUrl": "/Content/img/basemaps/groad-l.png",
        "internet": true,
        "description": "",
        "useCors": true
    }
];

export default BasemapConfig;