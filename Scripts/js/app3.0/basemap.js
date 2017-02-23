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
import BasemapDesc from 'components/displays/basemapdesc';

class Basemap {

    static PermittedConfigParams = [
        'name', 'class', 'src', 'crs', 'subdomains', 'legend', 'imageUrl', 'description', 'internet', 'useCors'
    ];

    constructor(basemap, token, func) {
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
            token: (this.internal) ? token : null,
            continuousWorld: true,
            useCors: basemap.useCors | false ,
            zIndex: 0
        };

        //add subdomains if requires
        if (basemap.subdomains) {
            this.opts.subdomains = basemap.subdomains;
        }

        if (this.isArcGisService && this.crs) {
            
            Esri.get(this.src, this.internal ? { token: token } : {}
            , (error, metadata) => {
                if (!error) {

                    let i, ci, len, arcgisLOD, correctRes,
                        origin = metadata.tileInfo.origin,
                        arcgisLODs = metadata.tileInfo.lods,
                        correctResolutions = Util.MercatorZoomLevels;

                    scope.obj._metadata = metadata;
                    scope._lodMap = {};

                    for (i = 0, len = arcgisLODs.length; i < len; i++) {
                        arcgisLOD = arcgisLODs[i];
                        for (ci in correctResolutions) {
                            correctRes = correctResolutions[ci];
                            if (Util.withinPercentage(arcgisLOD.resolution, correctRes, 0.1)) {
                                scope._lodMap[ci] = arcgisLOD.level;
                                break;
                            }
                        }
                    }

                    scope.crs.options.origin = [origin.x, origin.y];
                    scope.crs._lodMap = scope.obj._lodMap = scope._lodMap;

                    this.obj.push(this.generateLayer());

                    if (func) {
                        func();
                    }
                }
            });
            
        } else {
            
            if (this.crs && this.crs.options && this.crs.options._lodMap) {
                this.crs._lodMap = this._lodMap = this.crs.options._lodMap;
            }

            this.obj.push(this.generateLayer());
            
        }

        /*layer = L.esri.tiledMapLayer(this.opts);
        this.obj.push(layer);

        if (!isArcGisService) {
            layer.tileUrl = layer.tileUrl.replace(/\/tile\/{z}\/{y}\/{x}$/, "");
        }*/

        // Only perform this for non-supported spatial references by leaflet
        /*if (isArcGisService && this.crs) {
                    
            this.crs.scale = function (zoom) {
                let zoomAttr = this._lodMap ? this._lodMap[zoom] : zoom,
                    scalesAttr = this._scales ? this._scales : Util.MercatorZoomLevels;

                return scalesAttr[zoomAttr];
            }

            layer.metadata((function (error, metadata) {
                if (!error) {
                    let i, ci, len, arcgisLOD, correctRes,
                        origin = metadata.tileInfo.origin,
                        arcgisLODs = metadata.tileInfo.lods,
                        correctResolutions = Util.MercatorZoomLevels;

                    scope.obj._metadata = metadata;
                    scope._lodMap = {};

                    for (i = 0, len = arcgisLODs.length; i < len; i++) {
                        arcgisLOD = arcgisLODs[i];
                        for (ci in correctResolutions) {
                            correctRes = correctResolutions[ci];
                            if (Util.withinPercentage(arcgisLOD.resolution, correctRes, 0.1)) {
                                scope._lodMap[ci] = arcgisLOD.level;
                                break;
                            }
                        }
                    }

                    scope.crs.options.origin = [origin.x, origin.y];
                    scope.crs._lodMap = scope.obj._lodMap = scope._lodMap;

                    if (func) {
                        func();
                    }
                }
            }));

        } else if (scope.crs && scope.crs.options && scope.crs.options._lodMap) {
            this.crs._lodMap = layer._lodMap = this._lodMap = this.crs.options._lodMap;
        }*/
    }

    generateLayer() {
        var layer = this.getBasemapClassObj();

        if (!this.isArcGisService) {
            layer.tileUrl = layer.tileUrl.replace(/\/tile\/{z}\/{y}\/{x}$/, "");
        }

        return layer;
    }

    /*getId() {
        return this.id;
    }*/

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

        if(this.crs && this.crs.options && this.crs.options._lodMap){
            layer._lodMap = this._lodMap;
        }
        
        layer.mapId = map.mapId;
        layer.addTo(map);
    }

    getBasemapClassObj() {
        return Esri.tiledMapLayer(this.opts);
    }

    getInfo() {
        return <BasemapDesc imageUrl={this.getImageUrl()} desc={this.getDescription()} />;
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