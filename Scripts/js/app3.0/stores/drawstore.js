/**---------------------------------------------------------------------------
 * PROGRAM ID      : drawstore.js
 * DESCRIPTION     : Drawing Tools Flux Store
 * AUTHOR          : jianmin
 * DATE            : May 31, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
----------------------------------------------------------------------------*/

import React from 'react';
import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import MapStore from 'stores/mapstore';
import DrawConstants, {DrawColors} from 'constants/drawconstants';
import EplActionCreator from 'actions/eplactioncreator';
import L from 'leaflet';
import StreetView from 'components/streetview';
class DrawStore extends BaseStore {

    constructor() {
        super();
        this.buttonStatus = {};
        this.drawResult = '';
        this.colorId = 'color-1';
        this._registeredDrawEventHandler = false;
        this._drawManager = null;
        this._drawStop = 'draw:drawstop';
        this._drawCreated = 'draw:created';
        this._drawnItem = null;
        this.resetButtonStatus();
        this._layerGeoJSON = null;
    }

    resetButtonStatus (){
        for(var dc in DrawConstants){
            this.disselectButtonStatus(DrawConstants[dc]);
        }
    }
   
    //update the current selected btn
    selectButtonStatus(drawType){
        this.buttonStatus[drawType] = true;
    }

    disselectButtonStatus(drawType){
        this.buttonStatus[drawType] = false;
    }
    
    getButtonStatus(){
        return this.buttonStatus;
    }

    getDrawResult(){
        return this.drawResult;
    }

    setDrawResult(result){
        this.drawResult = result;
    }

    getColorId(){
        return this.colorId;
    }

    setColorId(colorId){
        this.colorId = colorId;
    }

    _getSelectedColor(){
        return DrawColors[this.colorId];
    }
     
    _setDrawManager(){
        if(!this._drawManager){
            this._drawManager = MapStore.drawManager;
        }
    }

    drawCreatedHandler(e){
        this._layerGeoJSON = e.layer.toGeoJSON();
        this._drawManager.drawnItems.addLayer(e.layer);
    }

    reactDrawStopHandler(e){
        EplActionCreator.drawDone(e); 
    }

    normalDrawStopHandler(e){}

    drawPreprocess(){
        this._setDrawManager();
       
        this.disablePreviousDrawTool();
        //reset btn css
        this.resetButtonStatus();

        this.initDrawEventHandler();
    }
    
    drawFeatureEnable(){
        this._drawnItem.enable();
    }

    drawMarker(){
        var greenIcon = this._drawManager.icon;
        if(this._drawnItem){
            this._drawnItem.remove();
        }
        this._drawnItem = new L.Draw.Marker(this._drawManager.map,  {
            icon: greenIcon
        });
    }

    drawStreetViewMarker(){       
        var icon = this._drawManager.streetViewIcon;
        this._drawnItem = new L.Draw.Marker(this._drawManager.map,  {
            icon: icon,
            streetView: true
        });
    }

    drawLine(){
        this._drawnItem = new L.Draw.Polyline(this._drawManager.map,  {
            showArea: true,
            allowIntersection: false,
            shapeOptions: {
                weight: 3,
                color: this._getSelectedColor()
            }
        });
    }

    drawPolygon(){
        this._drawnItem = new L.Draw.Polygon(this._drawManager.map,  {
            showArea: true,
            allowIntersection: false,
            shapeOptions: {
                weight: 1,
                color: this._getSelectedColor()
            }
        });
    }

    drawRectangle(){
        this._drawnItem = new L.Draw.Rectangle(this._drawManager.map,  {
            showArea: true,
            allowIntersection: false,
            shapeOptions: {
                weight: 1,
                color: this._getSelectedColor()
            }
        });    
    }

    drawCircle(){
        this._drawnItem = new L.Draw.Circle(this._drawManager.map,  {
            showArea: true,
            allowIntersection: false,
            shapeOptions: {
                weight: 1,
                color: this._getSelectedColor()
            }
        });    
    }

    clearDrawing(){
        this.resetButtonStatus();

        var drawManager = this._drawManager;
        if(drawManager){
            drawManager.drawnItems.eachLayer((layer) => {
                layer.remove();
            });
        }

        this.setDrawResult('');
    }

    clearStreetViewMarker(){
        var drawManager = this._drawManager;
        if(drawManager && drawManager.drawnItems._layers){
            drawManager.drawnItems.eachLayer((layer) => {
                if(layer.options.icon === this._drawManager.streetViewIcon){
                    layer.remove();
                }        
            });
        }
    }

    updateDrawnItemColor(colorId){
        this.setColorId(colorId);
    }

    //user click pin location then do nothing and click to trigger draw line
    disablePreviousDrawTool(){
        if(this._drawnItem){
            var map = this._drawManager.map;
            map.off(this._drawStop, this.reactDrawStopHandler);
            map.on(this._drawStop, this.normalDrawStopHandler);
            this.clearStreetViewMarker();
            this._drawnItem.disable();
            this._drawnItem = null;
            map.off(this._drawStop, this.normalDrawStopHandler);
            map.on(this._drawStop, this.reactDrawStopHandler);
        }
    }

    initDrawEventHandler(){
        if (!this._registeredDrawEventHandler){
            this._registeredDrawEventHandler = true;
            var map = this._drawManager.map;
            this.enableDrawHandler();          
        }
    }

    drawDone(e){
        //reset css
        this.resetButtonStatus();
        var type = e.layerType;
        //var layer = e.target;
        switch (type){
            case 'marker':
                if(this._layerGeoJSON){
                    if(this._drawnItem.options.streetView){
                        if(this._layerGeoJSON){
                            setTimeout(()=>EplActionCreator.showModal(<StreetView latitude={this._layerGeoJSON.geometry.coordinates[1].toFixed(7)} longitude={this._layerGeoJSON.geometry.coordinates[0].toFixed(7)} />),0);                        
                        }
                    } else {
                        let markerRes = 'Location Lat/Lng: (' + this._layerGeoJSON.geometry.coordinates[1].toFixed(7) + 
                                        ', ' + this._layerGeoJSON.geometry.coordinates[0].toFixed(7) + ')';
                        this.setDrawResult(markerRes);
                    }
                }
            break;

            case 'polyline':
                let distance = (this._drawnItem._measurementRunningTotal).toFixed(2);
                let distanceLabel = 'Distance: '+ distance + ' Meters';
                this.setDrawResult(distanceLabel);
            break;

            case 'polygon':
                let coords = this._layerGeoJSON.geometry.coordinates[0].map((coord) => {
                    return {
                        lat: coord[1],
                        lng: coord[0]
                    };
                });

                //calc distance by adding up distances between all the points
                let polydistance = 0;
                for(var i = 0; i < coords.length - 1 ; i++){
                    polydistance += L.latLng(coords[i].lat,coords[i].lng).distanceTo(L.latLng(coords[i+1].lat,coords[i+1].lng))
                }

                let area = L.GeometryUtil.geodesicArea(coords).toFixed(2);

                let dlabel = 'Perimeter: '+ polydistance.toFixed(2) + ' Meters',
                    alabel = ' Area: ' + area + ' Square Meters';

                this.setDrawResult(dlabel + ' ' + alabel);
            break;

            case 'rectangle':
                if(this._layerGeoJSON && this._layerGeoJSON.geometry.type === 'Polygon'){
                    let coords = this._layerGeoJSON.geometry.coordinates[0].map((coord) => {
                        return {
                            lat: coord[1],
                            lng: coord[0]
                        };
                    });
                    let recArea = L.GeometryUtil.geodesicArea(coords).toFixed(2);
                    let recLabel = 'Area: ' + recArea + ' Square Meters';
                    this.setDrawResult(recLabel);
                }
            break;

            case 'circle':
                if(this._layerGeoJSON && this._layerGeoJSON.geometry.type === 'Point'){
                    
                    let circleRes = 'Centre Lat/Lng: (' + this._layerGeoJSON.geometry.coordinates[1].toFixed(5) +
                                    ', ' + this._layerGeoJSON.geometry.coordinates[0].toFixed(5) + ')';

                    this.setDrawResult(circleRes);
                }
            break;
        }
    }

    enableDrawHandler(){
        if(this._drawManager && this._drawManager.map){
            this._drawManager.map.on(this._drawCreated, this.drawCreatedHandler, this);
            this._drawManager.map.on(this._drawStop, this.reactDrawStopHandler);
            this.disableMapOnClickIdentifyHandler();
        }
    }

    disableDrawHandler(){
        if(this._drawManager && this._drawManager.map){
            this._drawManager.map.off(this._drawCreated, this.drawCreatedHandler, this);
            this._drawManager.map.off(this._drawStop, this.reactDrawStopHandler);
            this.enableMapOnClickIdentifyHandler();
        }
    }

    //enable map on click
    enableMapOnClickIdentifyHandler(){
        MapStore.enableMapOnClickIdentifyHandler();
    }

    //disable map on click
    disableMapOnClickIdentifyHandler(){
        MapStore.disableMapOnClickIdentifyHandler();
    }
}

var instance = new DrawStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case EplConstants.DrawStreetViewMarker:
            instance.drawPreprocess();
            instance.drawStreetViewMarker();
            instance.selectButtonStatus(DrawConstants.Marker);
            instance.drawFeatureEnable();
            instance.emitChanges();
            break;
        case EplConstants.DrawMarker:
            instance.drawPreprocess();
            instance.drawMarker();
            instance.selectButtonStatus(DrawConstants.Marker);
            instance.drawFeatureEnable();
            instance.emitChanges();
            break;
        case EplConstants.DrawPolygon:
            instance.drawPreprocess();
            instance.drawPolygon();
            instance.selectButtonStatus(DrawConstants.Polygon);
            instance.drawFeatureEnable();
            instance.emitChanges();
            break;
        case EplConstants.DrawLine:
            instance.drawPreprocess();
            instance.drawLine();
            instance.selectButtonStatus(DrawConstants.Line);
            instance.drawFeatureEnable();
            instance.emitChanges();
            break;
        case EplConstants.DrawCircle:
            instance.drawPreprocess();
            instance.drawCircle();
            instance.selectButtonStatus(DrawConstants.Circle);
            instance.drawFeatureEnable();
            instance.emitChanges();
            break;
        case EplConstants.DrawRectangle:
            instance.drawPreprocess();
            instance.drawRectangle();
            instance.selectButtonStatus(DrawConstants.Rectangle);
            instance.drawFeatureEnable();
            instance.emitChanges();
            break;
        case EplConstants.ClearDrawing:
            instance.clearDrawing();
            instance.emitChanges();
            break;
        case EplConstants.UpdateDrawnItemColor:
            instance.updateDrawnItemColor(action.colorId);
            instance.emitChanges();
            break;
        case EplConstants.DrawDone:
            instance.drawDone(action.result);
            instance.emitChanges();
            break;
    }
});

export default instance;
