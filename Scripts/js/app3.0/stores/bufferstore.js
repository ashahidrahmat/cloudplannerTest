/**---------------------------------------------------------------------------
 * PROGRAM ID      : bufferstore.js
 * DESCRIPTION     : Buffer Tool Flux Store
 * AUTHOR          : jianmin
 * DATE            : Jun 08, 2016
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

import BaseStore            from 'stores/basestore';
import EplConstants         from 'constants/eplconstants';
import AppDispatcher        from 'dispatcher/appdispatcher';
import MapStore             from 'stores/mapstore';
import EplActionCreator     from 'actions/eplactioncreator';
import L                    from 'leaflet';
import LayerManagerStore    from 'stores/layermanagerstore';
import UrlConstants         from 'constants/urlconstants';
import Ajax                 from 'wrapper/ajax';
import Util                 from 'util';
import ConfigStore          from 'stores/configstore';
import Esri                 from 'esri-leaflet';
import SpeechStore          from 'stores/speechstore';

class BufferStore extends BaseStore {

    constructor() {
        super();
        this._bufferDrawCreated = 'draw:created';
        this._bufferDrawStop = 'draw:drawstop';
        this._color = '#f00';
        this._units = 'kilometers';
        this.isPoint = true;
        this.isPolygon = false;
        this.radius = 400;
        this._map = null;
        this._icon = L.icon({
            iconUrl: 'Content/img/red-pushpin.png',
            iconAnchor: [16, 37]
        });
        this._bufferDrawnItem = null;
        this._bufferDrawnItems = new L.featureGroup();
        this._isBufferOn = false;

        //check if buffer is drawn by query
        this.queried = false;
    }

    initialize(){
        if (!this._map){
            this._map = MapStore.firstMap;
            this._map.addLayer(this._bufferDrawnItems);
        }
    }

    enableBufferDrawHandler(){
        if(this._map){
            this._map.on(this._bufferDrawCreated, this.bufferDrawCreatedHandler, this);
            this._map.on(this._bufferDrawStop, this.reactBufferDrawStopHandler);
        }
    }

    disableBufferDrawHandler(){
        if (this._map){
            this._map.off(this._bufferDrawCreated, this.bufferDrawCreatedHandler, this);
            this._map.off(this._bufferDrawStop, this.reactBufferDrawStopHandler);
        }
    }

    setPointBufferStatus(status){
        this.isPoint = status;
    }

    getPointBufferStatus(){
        return this.isPoint;
    }

    setPolygonBufferStatus(status){
        this.isPolygon = status;
    }

    getPolygonBufferStatus(){
        return this.isPolygon;
    }

    setRadius(radius){
        this.radius = radius;
    }

    getRadius(){
        return this.radius;
    }

    setQueried(status){
        this.queried = status;
    }

    getQueried(){
        return this.queried;
    }

    pointBuffer(){
        this.initialize();
        this.setPolygonBufferStatus(false);
        this.setPointBufferStatus(true);
        this.disableBufferDrawnItem();
        this.disableBufferDrawHandler();
        this.drawBufferPoint();
        this.enableBufferDrawnItem();
        this.enableBufferDrawHandler();
    }

    drawBufferPoint(){
        this._bufferDrawnItem = new L.Draw.Marker(this._map,  {
            icon: this._icon
        });
    }

    pointBufferByCoords(coords){
        this.disableBufferDrawHandler();
        this.initialize();
        this.setPolygonBufferStatus(false);
        this.setPointBufferStatus(true);
        var marker = new L.marker(coords,{
            icon: this._icon
        })
        this._bufferDrawnItems.addLayer(marker);
        var circle = this.bufferDrawCircle(coords);
        this.queryBufferableLayers(circle, "marker");
    }

    polygonBuffer(){
        this.initialize();
        this.setPointBufferStatus(false);
        this.setPolygonBufferStatus(true);
        this.disableBufferDrawnItem();
        this.disableBufferDrawHandler();
        this.drawBufferPolygon();
        this.enableBufferDrawnItem();
        this.enableBufferDrawHandler();
    }

    drawBufferPolygon(){
        this._bufferDrawnItem = new L.Draw.Polygon(this._map,  {
            showArea: false,
            allowIntersection: false,
            shapeOptions: {
                color: this._color
            }
        });
    }

    clearBuffer(){
        this.setPointBufferStatus(false);
        this.setPolygonBufferStatus(false);
        this.clearBufferDrawnItems();
        this.disableBufferDrawnItem();
    }

    clearBufferDrawnItems(){
        if(this._bufferDrawnItems){
            var map = this._map;
            this._bufferDrawnItems.eachLayer((layer) => {
                layer.remove();
            });
        }
    }

    bufferDone(){
        this.setPointBufferStatus(false);
        this.setPolygonBufferStatus(false);
    }

    bufferSliderChange(value){
        this.setRadius(value);
    }
    //ATTN: turf.js buffer a point returns a imperfect circle
    bufferDrawCreatedHandler(e){
        this._bufferDrawnItems.addLayer(e.layer);
        //console.log(e);
        switch (e.layerType){
            case 'marker':
                //draw circle
                var center = e.layer.getLatLng();
                var circle = this.bufferDrawCircle(center);
                //begin request
                this.queryBufferableLayers(circle, e.layerType);
                break;
            case 'polygon':
                var geojsonPolygon = e.layer.toGeoJSON();
                if (this.getRadius() > 0){
                    var bufferPolygon = this.bufferDrawPolygon(geojsonPolygon);
                    var temp = Esri.Util.geojsonToArcGIS(bufferPolygon);
                    this.queryBufferableLayers(temp.geometry, e.layerType);

                }else{
                    var polygon = Esri.Util.geojsonToArcGIS(geojsonPolygon);
                    this.queryBufferableLayers(polygon.geometry, e.layerType);
                }

                break;
        }
    }
    //add circle
    bufferDrawCircle(center){
        var radius = this.getRadius();
        var circle = L.circle(center, radius, {
            opacity: 0.8,
            weight: 1,
            fillOpacity: 0.4
        });

        this._bufferDrawnItems.addLayer(circle);

        return circle;
    }
    //use Turf.js buffer to draw buffered polygon
    bufferDrawPolygon(geojsonPolygon){
        var radius = this.getRadius() * 0.001;
        var buffered = turf.buffer(geojsonPolygon, radius, this._units);
        var polygonStyle = {
            style: { 'weight':2, 'color':this._color }
        };
        var bufferLayer = L.geoJson(buffered, polygonStyle);
        this._bufferDrawnItems.addLayer(bufferLayer);

        return buffered;
    }

    reactBufferDrawStopHandler(e){
        //console.log(e);
    }

    enableBufferDrawnItem(){
        if(this._bufferDrawnItem){
            //settimeout hack to make slider work on buffer without disrupting css transition
            setTimeout(() => {
                this._bufferDrawnItem.enable();
            }, 0);
        }
    }

    disableBufferDrawnItem(){
        if(this._bufferDrawnItem){
            this._bufferDrawnItem.disable();
        }
    }

    //query layers factory
    queryBufferableLayers(geometry, layerType){
        EplActionCreator.buffer();
        let scope = this,
            selected = LayerManagerStore.selected;

        if(!selected.length){
            EplActionCreator.bufferDone();
            return;
        }

        selected.forEach((layer) => {
            //attach token
            if(!scope._token){
                scope._token = layer.token;
            }
            switch (layerType){
                case 'marker':
                    //circle in leaflet is just a point
                    scope.convertCircleToPolygon(geometry, (polygon) => {
                        layer.bufferTask(polygon);
                    });
                    break;
                case 'polygon':
                    layer.bufferTask(geometry);
                    break;
            }

        });
    }
    //ATTN: circle in geoJSON is point, using nearby query needs ArcGIS 10.3+
    convertCircleToPolygon(circle, callback){
        Ajax.wait([
           this.runArcGISBufferPointService(circle)
        ], (bufferResponse) => {
            if (typeof bufferResponse === 'object' && bufferResponse.geometries){
                callback(bufferResponse.geometries[0]);
            }else{
                EplActionCreator.displayMessage("Convert circle to polygon error");
            }

        }, error => {
            EplActionCreator.displayMessage("Convert circle to polygon error");
        });
    }
    

    runArcGISBufferPointService(circle){
        var scope = this;
        var geometry = {
            geometryType:"esriGeometryPoint",
            geometries:[
                {
                    x:circle.getLatLng().lng,
                    y:circle.getLatLng().lat,
                    spatialReference:{ wkid:4326 }
                }
            ]
        };
        return Ajax.call({
            url: Util.appendUrlWithParams(UrlConstants.ArcGisBufferService, {
                token: scope._token || ConfigStore.token,
                f: 'json',
                inSR:4326,
                geometries:JSON.stringify(geometry),
                bufferSR:3414,
                outSR:4326,
                distances:circle.getRadius(),
                unit:9001
            }),
            crossDomain: true,
            dataType: 'jsonp'
        });
    }

}

var instance = new BufferStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case EplConstants.PointBuffer:
            instance.pointBuffer();
            instance.emitChanges();
            break;
        case EplConstants.PolygonBuffer:
            instance.polygonBuffer();
            instance.emitChanges();
            break;
        case EplConstants.ClearBuffer:
            instance.clearBuffer();
            instance.emitChanges();
            break;
        case EplConstants.BufferDone:
            instance.bufferDone();
            instance.emitChanges();
            break;
        case EplConstants.BufferSliderChange:
            instance.bufferSliderChange(action.value);
            instance.emitChanges();
            break;
    }
});

export default instance;
