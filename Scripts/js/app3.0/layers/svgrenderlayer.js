/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : svgRenderLayer.js
 * DESCRIPTION     : layer class which renders svg polygons
 * AUTHOR          : cbenjamin  
 * DATE            : Feb 9, 2017
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


import d3 from 'libs/d3/3.4.13/d3';
import Util from 'utils';
import Layer from 'layers/layer';

export default class svgRenderLayer extends Layer {

    constructor(opts) {
        super(opts);
        this.renderId = Util.makeid();
        this.drawingId = "svg."+this.renderId;
        this.opacityLevel = 0.7;
        this.renderBufferGeoJSON = [];
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex;
        this.map.setZIndex(zIndex);
        d3.selectAll(this.drawingId).style("z-Index",this.zIndex);
        this.triggerEvent(this.eventList.ZIndexChange, zIndex);
    }

    setOpacity(value) {
        this.map.setOpacity(value);
        d3.selectAll(this.drawingId).style({'fillOpacity': value, 'opacity': value});
    }

    removeRenders(){
        this.renderBufferGeoJSON=[];
        d3.selectAll(this.drawingId).remove();
    }

    addToRender_GeoJSON(geoJSON,styleObj){
        var geoJSONobj = {};
        geoJSONobj['GeoJSON'] = geoJSON;
        geoJSONobj['style'] = styleObj;
        this.renderBufferGeoJSON.push(geoJSONobj);
    }

    drawRenders(){
        if(!this._map ){return;}
        
        this.renderBufferGeoJSON.map((eachGeoJSON)=>{
            this.drawGeoJSON(eachGeoJSON['GeoJSON'], eachGeoJSON['style']);
        });  
    }

    drawGeoJSON(geoJson,styleObj){
 
        if(this._map && geoJson!=null ){
            let Lmap = this._map ,
             svg = d3.select(Lmap.getPanes().overlayPane).append("svg").attr("class", this.renderId) ,
             g= null; 
    
 
            g = svg.append("g").attr("class", "leaflet-zoom-hide"); 
   
            var bounds = d3.geo.bounds(geoJson);
      
            var path = d3.geo.path().projection(project);
            
            if(this.lastDrawings){this.lastDrawings.remove();}
            var feature = g.selectAll("path")
                .data(geoJson.features)
                .enter().append("path")
                .attr('class','hexagons')
                .style(styleObj);
                /*
                .style("fill",(d,i)=>{return this.getColor(d.properties.pt_count , this.legendRanges,this.colorPalatte)})
                .style("opacity",this.opacityLevel)
                .style("stroke","black");
                */

            this.lastDrawings = svg;
            if(this.zIndex) { d3.selectAll(this.drawingId).style("z-Index",this.zIndex);}
      
            Lmap.on("viewreset", reset);
      
            reset();
      
            function project(x) {
                var point = Lmap.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
                return [point.x, point.y];
            }
      
            function reset() {
                var bottomLeft = project(bounds[0]); 
                var topRight = project(bounds[1]);
                svg.attr("width", topRight[0] - bottomLeft[0])
                  .attr("height", bottomLeft[1] - topRight[1])
                  .style("margin-left", bottomLeft[0] + "px")
                  .style("margin-top", topRight[1] + "px");
                g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
                feature.attr("d", path);
            }
        }
    }



    }