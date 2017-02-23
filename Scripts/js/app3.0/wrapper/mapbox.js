/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : mapbox.js
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

"use strict";

import M from 'libs/mapbox-gl.js';
import EplActionCreator from 'actions/eplactioncreator';
import Basemap3DConfig from 'basemap3dconfig';
import Ajax from 'wrapper/ajax';
import {ControllerUrl} from 'constants/urlconstants';

export default class Mapbox {
    constructor(opts) {
        this.defaultConfig = Basemap3DConfig.Mapbox.config;

        this.config = {
            style: "",
            center: this.defaultConfig.center,
            zoom: this.defaultConfig.zoom,
            bearing: this.defaultConfig.bearing,
            pitch: this.defaultConfig.pitch,
            maxBounds: this.defaultConfig.maxBounds
        };
        this.markers = [];
        this.map = null;
        this.layers = [];
    }

    initialize(){
        this.map = new mapboxgl.Map({
            container: this.container,
            style: this.config.style,
            center: this.config.center,
            zoom: this.config.zoom,
            bearing: this.config.bearing,
            pitch: this.config.pitch,
            maxBounds: this.config.maxBounds
        });
        this.loadingInProgress();
        if(this.map){
            var scope = this;
            this.map.off('load');
            this.map.on('load',function(e){scope.loadingComplete()});
        }
    }

    reset() {
        this.map.remove();
        this.layers = [];
        this.config = this.defaultConfig;
        this.initialize();
    }

    destroy() {
        if(this.map){
            this.map.remove();
            this.map = null;
        }
        this.loadingComplete();
    }

    loadingInProgress(){
        document.getElementById('loading-div').style.display = 'block';
    }

    loadingComplete(){
        let loadDiv = document.getElementById('loading-div');
        if(loadDiv){
            loadDiv.style.display = 'none';
        }
    }

    convertToLngLat(coordinates){
        if(Array.isArray(coordinates)){
            if(coordinates[0] > 90){
                return [coordinates[0],coordinates[1]];
            } else {
                return [coordinates[1],coordinates[0]];
            }
        } 
        return coordinates;
    }

    isInitialized(){
        if(this.map){
            return true;   
        } else {
            return false;
        }
    }

    getMap(){
        return this.map;
    }

    flyTo(lngLat){
        var lnglat = this.convertToLngLat(lngLat);
        this.map.flyTo({center: lnglat});
    }

    panTo(lngLat){
        var lnglat = this.convertToLngLat(lngLat);
        this.map.panTo(lnglat, {
            'duration': 0
        });
    }

    addLayer(layerProp){
        this.map.addLayer(layerProp);
        this.layers.push(layerProp.id);
    }

    getLayer(id){
        for(var i = 0; i < this.layers.length; i++){
            if(id === this.layers[i]){
                return true;
            }
        }  
        return false;
    }

    removeLayer(id){
        for(var i = 0; i < this.layers.length; i++){
            console.log(this.layers[i]);
            if(id == this.layers[i]){
                this.map.removeLayer(id);
                break;
            }
        }  
    }

    removeAllLayers(){
        for (var i = 0; i < this.layers.length; i++){
            this.map.removeLayer(this.layers[i]);
            this.layers = [];
        }
    }

    addMarker(icon,lngLat){
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(' + icon.icon + ')';
        el.style.width = icon.width + 'px';
        el.style.height = icon.height + 'px';
        var lnglat = this.convertToLngLat(lngLat);
        this.markers.push(new mapboxgl.Marker(el, {offset:[-15, -30]})
            .setLngLat(lnglat)
            .addTo(this.map));
    }

    removeMarkers(){
        for (var i = 0; i < this.markers.length; i++){
            this.markers[i].remove();
        }
    }

    setPopup(lngLat,content){
        this.removePopup();
        this.popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true
        });
        this.popup.setLngLat(lngLat);
        this.popup.setHTML(content);
        this.popup.addTo(this.map);
    }

    removePopup(){
        if(this.popup){
            this.popup.remove();
            this.popup = null;
        }
    }

    setContainer(dom){
        this.container = dom;
    }

    getContainer(){
        return this.dom;
    }

    setStyle(style){
        this.config.style = style;
        this.config.center = this.getCenter();
        this.config.zoom = this.getZoom();
        this.config.bearing = this.getBearing();
        this.config.pitch = this.getPitch();

        this.map.remove();  
        this.initialize();
    }

    setCenter(center){
        this.map.setCenter(center);
    }

    setZoom(zoom){
        this.map.setZoom(zoom);
    }

    setBearing(bearing){
        this.map.setBearing(bearing);
    }

    setPitch(pitch){
        this.map.setPitch(pitch);
    }

    setBasemap(basemap) {
        this.map.setBasemap(basemap);
    }

    setBounds(bounds){
        this.map.setMaxBounds(bounds);
    }

    getCenter() {
        return this.map.getCenter();
    }

    getZoom() {
        return this.map.getZoom();
    }
    
    getBearing() {
        return this.map.getBearing();
    }

    getPitch() {
        return this.map.getPitch();
    }

    getBounds() {
        return this.map.getBounds();
    }
}

export default new Mapbox();