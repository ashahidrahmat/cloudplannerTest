/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : 3dmapstore.js
 * DESCRIPTION     : 
 * AUTHOR          : liangjs
 * DATE            : Dec 23, 2016
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

import Mapbox from 'wrapper/mapbox';
import M from 'libs/mapbox-gl.js';
import L from 'leaflet';
import Util from '\\util';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplActionCreator from 'actions/eplactioncreator';
import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import Basemap3DConfig from 'basemap3dconfig';
import Ajax from 'wrapper/ajax';
import {ControllerUrl} from 'constants/urlconstants';
import $ from 'jquery';
import ConfigStore from 'stores/configstore';
import WebApi from 'webapi';

class Map3DStore extends BaseStore {

    constructor() {
        super();
        this._map = null;

        this.layerHeights = [
            [3,'#ffffcc'],
            [15,'#ffffcc'],
            [30,'#ffeda0'],
            [50,'#fed976'],
            [100,'#feb24c'],
            [200,'#fd8d3c'],
            [300,'#fc4e2a'],
            [400,'#e31a1c']
        ];

        this.selectedBuildingsProps = Basemap3DConfig.Mapbox.layers.selectedBuildings;
        this.basemaps = Basemap3DConfig.Mapbox.styles;
        this.siteInfo = {};
    }

    isInitialized(){
        return Mapbox.isInitialized();
    }

    initialize(mapId, domNode) {     
        this.initMapbox(domNode);            
    }

    initMapbox(domNode){
        Mapbox.setContainer(domNode);
        Mapbox.initialize();
        this._map = Mapbox.getMap();
        this.addBuildingLayers();
        this.enableMapOnClickIdentifyHandler();
    }

    destroy() {
        Mapbox.destroy();
    }
    
    getBasemaps(){
        return this.basemaps;
    }

    identify(center) {
        this.addMarker({
            icon:"Content/img/information.png",
            width:32,
            height:37
        },center);
    }

    reset() {
        this.disableMapOnClickIdentifyHandler();
        Mapbox.reset();
        this._map = Mapbox.getMap();   

        this.addBuildingLayers();
        this.enableMapOnClickIdentifyHandler();
    }

    addLayer(layerProp) {
        Mapbox.addLayer(layerProp);
    }

    addLayers(layerProps) {
        this._map.once('sourcedata', () => {
            for(var i = 0; i < layerProps.length; i++){
                this.addLayer(layerProps[i]);
            }
        });
    }

    addBuildingLayers(){
        this._map.once('sourcedata', () => {
            this.layerHeights.forEach((layer, i) => {
                if (i !== 0){
                    var tempLayer = {
                        'id': 'building_layer-' + i,
                        'type': 'fill-extrusion',
                        'source': 'mapbox',
                        'paint': {
                            'fill-extrusion-color': layer[1],
                            'fill-extrusion-opacity': 0.6,
                            'fill-extrusion-height': {
                                'type': 'identity',
                                'property': 'height'
                            },
                            'fill-extrusion-base': {
                                'type': 'identity',
                                'property': 'min_height'
                            }
                        },
                        'source-layer': 'building' 
                    }
                    this.addLayer(tempLayer);
                }
            });    
            this.addLayer(this.selectedBuildingsProps);
            this.layerHeights.forEach((layer, i) => {
                if (i !== 0){
                    var filters = ['all', ['<=', 'height', layer[0]],['>=', 'height', this.layerHeights[i - 1][0]]];
                    this._map.setFilter('building_layer-' + i, filters);
                }
            });
        });   
    }

    getLayer(id){
        return Mapbox.getLayer(id);
    }

    getLayers(){
        return this.layerHeights;
    }

    removeLayer(id){
        Mapbox.removeLayer(id);
    }

    storeSiteInfo(results) {
        this.siteInfo = results;
    }

    getSiteInfo() {
        return this.siteInfo;
    }

    setBasemap(style){
        for(var i = 0; i < this.basemaps.length; i++){
            if(style === this.basemaps[i].name){
                this.disableMapOnClickIdentifyHandler();
                Mapbox.setStyle(this.basemaps[i].style);
                this._map = Mapbox.getMap();  

                this.addBuildingLayers();
                this.enableMapOnClickIdentifyHandler();
            }          
        }
    }

    setCenter(center){
        Mapbox.panTo(center);
    }

    setZoom(zoom){
        this._map.setZoom(zoom);
    }

    getCenter() {
        return this._map.getCenter();
    }
    
    setPopup(lngLat,content){
        Mapbox.setPopup(lngLat,content);
    }

    setMapsView(center, zoom) {
        Mapbox.flyTo(center);
    }

    removePopup(){
        Mapbox.removePopup();
    }

    addMarker(icon,center){
        this.removeMarkers();
        Mapbox.addMarker(icon,center);
    }

    removeMarkers(){
        Mapbox.removeMarkers();
    }

    locateUser() {
        Util.getCurrentPosition(
            position => {
                let latlng = Util.toPointObject(position.coords.latitude, position.coords.longitude);
                this.highlightZoomCenter(null,null, latlng.coordinates[0]);
            },
            error => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        // User denied access to location. Perhaps redirect to alternate content?
                        EplActionCreator.displayMessage('Unable to detect current location.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        EplActionCreator.displayMessage('Position is currently unavailable.');
                        break;
                    case error.PERMISSION_DENIED_TIMEOUT:
                        EplActionCreator.displayMessage('User did not grant/deny permission.');
                        break;
                    case error.UNKNOWN_ERROR:
                        EplActionCreator.displayMessage('Unable to detect current location.');
                        break;
                }
            }
        );
    }

    highlightZoomCenter(geometry, zoom, center){
        this.setCenter(center);
        this.addMarker({
            icon:"Content/img/leaflet/marker-icon.png", 
            width: 25,
            height: 41
        }, center);
    }
    
    disableMapOnClickIdentifyHandler(){
        this._map.off('mousemove');
        this._map.off('click');
    }
   
    enableMapOnClickIdentifyHandler(){
        this._map.on('load', () => {
            var all_added_layers = []
            this.layerHeights.forEach((layer, i) => {
                if(i !==0){
                    all_added_layers.push('building_layer-' + i);
                }             
            })
            this._map.on('click', (e) => {
                EplActionCreator.identify(L.latLng(e.lngLat.lat, e.lngLat.lng));

                var features = this._map.queryRenderedFeatures(e.point, {layers: all_added_layers});
                this._map.setFilter(this.selectedBuildingsProps.id, ["==", "height", false]); 
                
                if (features.length > 0) {
                    for(var i = 1; i < this.layerHeights.length; i++){
                        this._map.setPaintProperty('building_layer-' + i,'fill-extrusion-opacity',0.3);
                        
                        if(features[0].properties.height <= this.layerHeights[i][0] && this.layerHeights[i-1][0] <= features[0].properties.height){
                            this._map.setPaintProperty(this.selectedBuildingsProps.id,'fill-extrusion-color',Util.colorLuminance(this.layerHeights[i][1],-0.2));
                            //this._map.setFilter(this.selectedBuildingsProps.id, ["==", "height", features[0].properties.height]); 
                            this._map.setFilter(this.selectedBuildingsProps.id, ["==", "osm_id", features[0].properties.osm_id]); 
                        }              
                    }

                    this.removeMarkers();

                    let div = '<p>Building height: <b>' + Math.round(features[0].properties.height) + '</b> meters</p>';

                    if(features[0].properties.name){
                        div+= '<p>Name: <b>'+features[0].properties.name +'</b></p>';
                    }
                       
                    this.setPopup(e.lngLat,div);            
 
                } else {
                    for(var i = 1; i < this.layerHeights.length; i++){
                        this._map.setPaintProperty('building_layer-' + i,'fill-extrusion-opacity',0.7);
                    }
                    this.removePopup();
                }
            });
            this._map.on('mousemove', (e) =>{ //set cursor
                var features = this._map.queryRenderedFeatures(e.point, {all_added_layers});
                if (features.length > 0){
                    this._map.getCanvas().style.cursor = (features[0].properties.height != null) ? 'pointer' : '';
                } else {
                    this._map.getCanvas().style.cursor = '';
                }
            });
        });
    }

    setHeight(min, max){   
        this._map.setFilter(this.selectedBuildingsProps.id, ["==", "height", false]);
        this.removePopup();
        this.layerHeights.forEach((layer, i) => {   
            if (i !== 0){
                this._map.setPaintProperty('building_layer-' + i,'fill-extrusion-opacity',0.7);
                if(max >= layer[0] && min < this.layerHeights[i][0]){
                    var filters = ['all', ['<=', 'height', layer[0]], ['>=', 'height', this.layerHeights[i - 1][0]]];
                    this._map.setFilter('building_layer-' + i, filters);
                } else {
                    this._map.setFilter('building_layer-' + i, ["==", "height", false]);
                }
            }
        }); 
    }
}

var instance = new Map3DStore();

instance.dispatchToken = AppDispatcher.register(function(action) {
    if(Mapbox.isInitialized()){
        switch(action.actionType) {
            case EplConstants.Reset:
                instance.reset();
                instance.emitChanges();
                break;
            case EplConstants.LocateUser:
                instance.locateUser();
                break;
            case EplConstants.Identify:
                instance.identify(action.latLng);
                break;
            case EplConstants.HighlightZoomCenterMap:
                instance.highlightZoomCenter(action.geometry, action.zoom, action.center);
                break;
            case EplConstants.setMapsView:
                instance.setMapsView(action.latLng);
                break;
            case EplConstants.QuerySiteInfoComplete:
                instance.storeSiteInfo(action.results);
                instance.emitChanges();
                break;
            case EplConstants.SetBasemap:
                instance.setBasemap(action.basemapName);
                instance.emitChanges();
                break;
            default:
                //no op
        }
    }
});

export default instance;