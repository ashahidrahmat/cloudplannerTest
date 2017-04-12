/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : drawsmanager.js
 * DESCRIPTION     : Functions for Drawing Tools
 * AUTHOR          : jianmin
 * DATE            : May 31, 2016
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
import L from 'leaflet';

export default class DrawManager {

    //set default properties
    constructor(map) {
        this.map = map;
        this.icon = L.icon({
            iconUrl: 'Content/img/green-dot.png',
            iconAnchor: [16, 37]
        });

        this.streetViewIcon = L.icon({
            iconUrl: 'Content/img/red-dot.png',
            iconAnchor: [16, 37]
        });

        //fix change basemap with drawing line/polygon bug
        let newUpdateGuide = function(t) {
            if(this._markers && this._markers.length) {
                var e = this._markers.length;
                e > 0 && (t = t || this._map.latLngToLayerPoint(this._currentLatLng),
                this._clearGuides(),
                this._drawGuide(this._map.latLngToLayerPoint(this._markers[e - 1].getLatLng()), t))
            }
        }; 
        
        L.Draw.Polyline = L.Draw.Polyline.extend({
            _updateGuide: newUpdateGuide
        });

        L.Draw.Polygon = L.Draw.Polygon.extend({
            _updateGuide: newUpdateGuide
        });
        
        this.drawnItems = new L.featureGroup();
        
    }

    initialize(){
        var drawnItems = this.drawnItems;
        this.map.addLayer(drawnItems);
    }

}
 