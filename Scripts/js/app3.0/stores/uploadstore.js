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

import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import Omnivore from 'leaflet-omnivore';
import Shapefile from 'libs/leaflet.shapefile/leaflet.shpfile.js';
import FileGDB from 'libs/leaflet.filegdb/leaflet.fgdb.js';
import MapStore from 'stores/mapstore';

class UploadStore extends BaseStore {

    constructor() {
        super();
        this.layerGroup = new L.layerGroup();
        this.layerGroupView = {};
    }

    setLayer(layer,name){
        let map = MapStore.getMap();
        this.layerGroup.addLayer(layer).addTo(map);
        this.layerGroupView[name] = layer;
        if(this.control){
          this.control.remove();
        }
        this.control = L.control.layers(null,this.layerGroupView).addTo(map);
    }

    getLayerGroup(){
        return this.layerGroup;
    }

    detectFormat(filename){
        var extension, obj;

        if(typeof filename === "string"){
            extension = filename.substring(filename.indexOf('.')+1).toLowerCase();
        } else if(filename.name.split('.').pop() === "zip") {
            extension = filename.name.substring(filename.name.indexOf('.')+1).toLowerCase();
        } else {
            extension = filename.name.substring(filename.name.indexOf('.')+1).toLowerCase();
            filename = window.URL.createObjectURL(filename);
        }

        console.log(filename)

        switch(extension){
            case 'geojson':
                obj = this.loadGeoJSON(filename);
                break;
            case 'csv':
                obj = this.loadCSV(filename);
                break;
            case 'gpx':
                obj = this.loadGPX(filename);
                break;
            case 'topojson':
                obj = this.loadTopoJSON(filename);
                break;
            case 'wkt':
                obj = this.loadWKT(filename);
                break;
            case 'kml':
                obj = this.loadKML(filename);
                break;
            case 'polyline':
                obj = this.loadPolyline(filename);            
                break;   
            case 'gdb.zip':
                obj = this.loadGDB(filename);            
                break;   
            case 'shp.zip':
                obj = this.loadShapeFile(filename);
                break;
            default:
                obj = `.${extension} is not supported.`;
                break;
        }

        window.URL.revokeObjectURL(filename);

        return new Promise((resolve,reject)=>{
            if (typeof obj === "string"){
                reject(obj);
            } else {
                resolve(obj);
            }
        })
    }

    getCustomLayer(){
        return L.geoJson(null, {
             onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                }
            }
        });;  
    }

    loadGeoJSON(geojson){
        return Omnivore.geojson(geojson,null,this.getCustomLayer());
    }

    loadCSV(csv){
        return Omnivore.csv(csv,null,this.getCustomLayer());
    }

    loadGPX(gpx){
        return Omnivore.gpx(gpx,null,this.getCustomLayer());
    }

    loadTopoJSON(topojson){
        return Omnivore.topojson(topojson,null,this.getCustomLayer());
    }

    loadWKT(wkt){
        return Omnivore.wkt(wkt,null,this.getCustomLayer());
    }

    loadKML(kml){
        return Omnivore.kml(kml,null,this.getCustomLayer());
    }

    loadPolyline(polyline){
        return Omnivore.polyline(polyline,null,this.getCustomLayer());
    }

    loadGDB(gdb){
        var layer,
        options = {
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                }
            }
        }

        return new Promise((resolve, reject) => {
            this.readFile(gdb).then((result)=>{
                var layer = new L.FileGDB(gdb,options); 
                resolve(layer);
            })
        });
        // fileGDB.once("data:loaded", function() {
        //     console.log("finished loaded gdb");
        //     return fileGDB;
        // });
    }

    loadShapeFile(shapefile){
        var layer,
        options = {
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                }
            }
        };

        return new Promise((resolve, reject) => {
            this.readFile(shapefile).then((result)=>{
                var layer = new L.Shapefile(result,options); 
                resolve(layer);
            })
        });
        
        // shpfile.once("data:loaded", function() {
        //     console.log("finished loaded shapefile");
        //     return shpfile;
        // });
    }

    readFile(file){
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.readAsArrayBuffer(file);
            fr.onload = (e) =>{
                resolve(fr.result);
            }  
        });
    }
}

var instance = new UploadStore();

instance.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.actionType) {

        default:
            //no op
    }
});

export default instance;

/*
, {style: {
            "color": "#000000",
            "fill": "none",
            "weight": 2
          }}
          */