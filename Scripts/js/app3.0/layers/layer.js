/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : basic class for layer
 * AUTHOR          : louisz
 * DATE            : Jan 5, 2016
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

//import Display from 'es6!display';
import L from 'leaflet';
import Img from 'components/displays/img';
import Ajax from 'wrapper/ajax';
import Util from 'utils';
import Esri from 'esri-leaflet';
import React from 'react';
import LayerColFunc from 'layers/layercolfunc'
import EsriLegend from 'components/esri/esrilegend';
import Unavailable from 'components/displays/unavailable';
import TableDisplay from 'components/displays/tabledisplay';
import EplActionCreator from 'actions/eplactioncreator';
import FeatureConstants from 'constants/featureconstants';
import ClickableTableCol from 'components/displays/clickabletablecol';
import MapStore from 'stores/mapstore';

export default class Layer {

    static PermittedConfigParams = [
        'name', 'class', 'src', 'layers', 'identifyid', 'tiled', 'legend', 'layerinfo', 'queryId', 'tolerance', 'displayAttrs', 'highlight', 'internet', 'columnLimit', 'exportCSV', 'defaultOpacity', 'opacitySlider',
        'dateFieldColumnName', 'queryOptions', 'legendFootnote', 'search'
    ];

    constructor(opts) {
        this.drawings = [];
        this.events = {};
        this.eventList = {
            PostAdd: 'postadd',
            PreRemove: 'preremove',
            SpatialReferenceChange: 'spatialrefchange',
            ZIndexChange: 'zindexchange'
        };
        this.results = [];
        this.resultsChanged = false;
        this.summary = "";
        this.defaultSettings = {
            defaultOpacity: opts.defaultOpacity || 1,
            exportCSV: opts.exportCSV,
            featureHighlightIndex: opts.highlight || 0,
            filterBoxShowsOpacitySlider: typeof opts.opacitySlider !== 'undefined' ? opts.opacitySlider : true,
            identifyTolerance: opts.tolerance || 10,
            columnLimit: opts.columnLimit || 3,
            legendFootnote: opts.legendFootnote || false
        };

        this.opts = opts;

        let layerObj = opts.tiled ? Esri.tiledMapLayer : Esri.dynamicMapLayer;

        //TODO: Warp map layer
        this.map = layerObj({
            url: opts.src,
            layers: opts.layers,
            opacity: 1,
            useCors: false
        });
       

        if(this.opts.ignoreload){
            this.map.on('load', function () {
                this.setZIndex(this.options.zIndex);
            });
        }else{
            this.map.on('load', function () {
                //hide loading icon
                let loadDiv = L.DomUtil.get('loading-div');
                if(loadDiv){
                    loadDiv.style.display = 'none';
                }
            
                //MapStore.enableMapOnClickIdentifyHandler();
                this.setZIndex(this.options.zIndex);
            });
        }       

        this.setIdentifyLayers(this.opts.identifyid);
        this.setLegend(this.opts.legend, false);
        this.exportCSV= this.exportCSV.bind(this);
        //L.esri.get = L.esri.Request.get.JSONP;
    }

    getName() {
        return this.opts.name;
    }

    getOpacity(){
        return this.map.options.opacity;
    }

    exportCSV(){
        if(this.displayCache.props.display){
            EplActionCreator.exportCSV(this.getName(), this.displayCache.props.display);
        }
        else if(this.displayCache.props.children){
            EplActionCreator.exportCSV(this.getName(), this.displayCache.props.children[0].props.display);
        }
    }

    getMapServiceUrl() {
        return this.opts.src;
    }

    getLegendUrl() {
        return this.getMapServiceUrl() + '/legend';
    }

    getLayerInfo() {
        return this.opts.layerinfo;
    }

    getDelay() {
        return this.opts.layerinfodelay;
    }

    getSearchObj() {
        return this.opts.search;
    }

    getMapCenter() {
        return this._map.getCenter();
    }

    getMapZoom() {
        return this._map.getZoom();
    }

    //Abort any existing identify request
    abortIdentify() {
        if (this.request) {
            try{
                this.request.abort();
                this.request = null;
            }
            catch(err){
                //do nothing
            }
        }
    }

    //Trigger the identify function of the layer
    identify(latLng) {
        var identify,
            defs = this.map.getLayerDefs();

        this.results = [];

        if (!this._map) {
            return;
        }

        this.abortIdentify();

        identify = this.map.identify();

        //Add layer definition to identify
        for (var layerId in defs) {
            identify.layerDef(layerId, defs[layerId]);
        }

        this.request = identify
        .on(this._map)
        .at(latLng)
        .tolerance(this.defaultSettings.identifyTolerance)
        .layers(this.opts.identifyIdProcessed)
        .run(this.identifyComplete.bind(this));

        return this.request;
    }

    identifyComplete(error, featureCollection) {
        this.request = null;
        this.postIdentify(featureCollection);
    }

    //Activate the postIdentify event
    postIdentify(featureCollection) {
        this.results = featureCollection;
        this.resultsChanged = true;
        EplActionCreator.identifyComplete();
    }

    retrieveSummaryAjax() { 
        let loading = L.DomUtil.get('layerinfo-loading');
        if(loading){
            loading.style.display = 'block';
        }
        Ajax.wait([
            this.retrieveSummary(),
            this.retrieveInfographics()
        ], (summaryResponse, infographicsResponse) => {
            this.summary = summaryResponse;
            this.infographics = infographicsResponse;
            if(loading){
                loading.style.display = 'none';
            }
            EplActionCreator.retrieveSummaryComplete();
        }, error => {
            EplActionCreator.displayMessage("Error retrieving summary");
        });
    }

    reloadInfographics() {
        return this.retrieveInfographics().then(response => {
            this.infographics = response;
        });
    }

    retrieveSummary() {
        return Ajax.call({
            url: Util.appendUrlWithParams(this.getMapServiceUrl(), {
                f: 'json'
            }),
            crossDomain: true,
            dataType: 'jsonp'
        });
    }

    retrieveInfographics() {
        let deferred = Ajax.deferred();
        
        deferred.resolve([null, null, null]);
        return deferred.promise();
    }

    getFilterBoxShowsOpacitySlider() {
        return this.defaultSettings.filterBoxShowsOpacitySlider;
    }

    getState() {
        //overlay ids
        //identify ids
        //definitation query
        //legend ids
        let overlayIds = this.getLayers(),
            identifyIds = this.getPreProcessedIdentifyIds(),
            defs = this.getLayerDefs(),
            legendIds = this.getLegendIds();

        return {
            overlay: overlayIds,
            identify: identifyIds,
            defs: defs,
            legend: legendIds
        };
    }

    getSummaryComponent() {
        return this.getSummary(this.summary[0]);
    }

    getSummary(summary) {
        return (summary) ? (summary.serviceDescription 
                        + '<br><br><strong>Credits</strong><br>' 
                        + summary.copyrightText).replace(/\n/g, "<br>") : null;
    }

    // es6: spread (https://babeljs.io/docs/learn-es2015/)
    getInfographicsComponent() {
        return this.infographics ? this.getInfographics(...this.infographics) : null;
    }

    getInfographics(error, featureCollection, response) { 
        return null; 
    }

    getLegend() {
        //TODO: Migrate into map layer class
        //TODO: Check if legendLayers provided is proper type
        let legend = this.getLegendIds(),
            legendDisplay = <Unavailable />;

        if ((typeof legend == "string") && legend.match(/\.(jpg|png|gif)$/gi)) {
            legendDisplay = <Img src={legend} />;
        } else if (this.legendLayers) {
            legendDisplay = <EsriLegend url={this.opts.src} title={this.opts.name} layers={this.legendLayers} legendIds={legend} />;
        }

        return legendDisplay;
    }

    getLegendFootnote(legendLayers){

        for(var i in legendLayers){
            Esri.get(this.getMapServiceUrl() + "/" + legendLayers[i].layerId,
                (error,response) => {
                    if(!error){
                        this.setLegendFootnote(response);
                    }
                });
        }
        
    }

    setLegendFootnote(layerResponse){
        for(var i in this.legendLayers){
            if(layerResponse.id == this.legendLayers[i].layerId){ 
                this.legendLayers[i].description = layerResponse.description;
                break;
            }
        }
    }

    getMetadata() { }

    showsFilterbox() { 
        return this.getFilterbox() !== null; 
    }

    getFilterbox() { return null; }

    getFeatureCollection() {
        return this.results;
    }

    //TODO: Validate displayAttrs
    processOutput(featureCollection, displayAttrs, colNum) {
        var features,
            table = [];

        if (featureCollection 
            && featureCollection.features 
            && featureCollection.features.length > 0) {

            //header
            features = featureCollection.features;

            //Check if custom displayAttrs is provided
            table = this.processIdentifyFeatures(features, displayAttrs, colNum);
        }               
        return table;
    }

    processIdentifyFeatures(features, displayAttrs, colNum=3) {
        var attr, rows, header, properties, selectedDisplayAttrs,
            results = [];

        //If [displayAttrs] parameters is provided
        if (displayAttrs) {
            results = features.map(feature => {
                let rowResult = null;
                if (Array.isArray(displayAttrs)) {
                    selectedDisplayAttrs = displayAttrs;
                } else if (typeof displayAttrs === 'object') {

                    attr = this.getDisplayAttrsByLayerId(displayAttrs, feature.layerId);
                    if (Number.isInteger(attr)) {
                        attr = displayAttrs[attr]
                    }

                    selectedDisplayAttrs = attr ? attr : displayAttrs.default || undefined;
                }
                    
                if (selectedDisplayAttrs) {
                    //get header
                    header = selectedDisplayAttrs.map((displayAttr, i) => {
                        return displayAttr.name;
                    });
                    //allow user-customized header in layer class
                    header = this.postProcessDisplayHeader(header, feature.layerId);

                    //allow feature.properties to locate individual layerId in a MapServer
                    if (!feature.properties._layerId){
                        feature.properties._layerId = feature.layerId;
                    }
                    rowResult = this.postProcessDisplayRow(this.processAttrRows(selectedDisplayAttrs, feature), feature.properties);
                }

                return rowResult;
            }).filter(row => { return row !== null; });

            //check if header exist
            if (header) {
                results.unshift(header);
            }

        } else {
            //Default to only display [colNum] of attributes
            properties = Object.keys(features[0].properties);
            rows = properties.map((title, i) => {
                return title;
            });

            results.push(rows.slice(0, colNum));

            //values only display [colNum] of attributes
            features.forEach((feature, i) => {
                var arr = Util.objectValues(feature.properties);

                rows = arr.map((val, i) => {
                    return this.generateCol(val, feature.geometry, i);
                });

                results.push(this.postProcessDisplayRow(rows.slice(0, colNum), feature.properties));
            });
        }

        return results;
    }
    
    postProcessDisplayHeader(header, layerId){
        return header;
    }

    postProcessDisplayRow(row, properties) {
        return row;
    }

    processAttrRows(displayAttr, feature) {
        return displayAttr.map((col, i) => {
            let text;
          
            //static value
            if (col.value) {
                text = [col.value];
            } else if (col.fields) {
                //array or string
                text = (Array.isArray(col.fields)) ? col.fields.map((ele, index) => {
                    return feature.properties[ele];
                }) : [feature.properties[col.fields]];
            } else {
                text = [feature.properties[col.name]];
            }

            if (!col.array) {
                text = this.retrieveFirstValidValue(text);
            }

            if (col.func) {
                text = LayerColFunc.format(text, col.func);
            }

            return this.generateCol(text, feature.geometry, i);
        });
    }

    //Generate column data. [defaultSettings.featureHighlightIndex] indicate which column can highlight map features.
    generateCol(text, geometry, index=null) {
        index = (index !== null) ? index : this.defaultSettings.featureHighlightIndex;
        text = (index === this.defaultSettings.featureHighlightIndex) ? this.generateClickableCol(text, this.getHighlightMapAreaFunc(geometry), true) : text;
        return text;
    }

    convertToClickableCol(row, rowId, onClick) {
        row[rowId] = this.generateClickableCol(row[rowId], onClick);
    }

    // Returns a [ClickableTableCol] component
    generateClickableCol(text, onClick, highlightCol=false) {
        return <ClickableTableCol text={text} onClick={onClick} highlightCol={highlightCol} />;
    }

    // Returns a function that will highlight geometry provided
    getHighlightMapAreaFunc(geometry) {
        geometry = Util.reversePolygonLatLng(geometry);
        return () => {
            EplActionCreator.highlightZoomCenterMap(geometry);
        };
    }

    // Function to retrieve the first valid value from the list of fields provided. If none are found, undefined will be returned.
    retrieveFirstValidValue(arr) {
        return arr.find((ele) => {
            return ele != null;
        });
    }

    getIdentifyDisplay(key) {
        let results = this.processOutput(this.getFeatureCollection(), this.opts.displayAttrs, this.defaultSettings.columnLimit);
        return <TableDisplay key={key} display={results} />;
    }

    getIdentifyDisplayCache(key) {
        if (!this.displayCache || this.resultsChanged) {
            this.displayCache = this.getIdentifyDisplay(key);
            this.resultsChanged = false;
        }

        return this.displayCache;
    }

    //By default, only the top most feature will be identified. Thus, to include all layer, 'all: 0,1,2' has to be added
    processIdentifyId(layerIds) {
        return this.getIdentifyOption() + ':' + (Array.isArray(layerIds) ? layerIds.join(",") : layerIds);
    }

    getIdentifyOption() {
        return 'visible';
    }

    resetCaching() {
        this.resultsChanged = true;
    }


    addTo(map) {
        var scope = this;
        this._map = map;
        this.map.addTo(map);

        if (!this.legendLayers) {
            //TODO: wrap $ into ajax class, path appending to Util
            Esri.Support.cors = false;
            Esri.get(this.getLegendUrl(), (error, response) => {
                if (!error) {
                    scope.legendLayers = response.layers;

                    if (this.defaultSettings.legendFootnote) {
                        //legend footnote
                        scope.getLegendFootnote(scope.legendLayers);
                    }

                } else {
                    EplActionCreator.displayMessage("Error retrieving legend");
                }
            });
        }

        //TODO: Migrate this to event object
        let events = this.events[this.eventList.PostAdd];
        if (events) {
            events.forEach(fn => {
                fn();   //TODO: consider the context of calling the function
            });
        }

    }

    on(type, fn) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(fn);
    }

    off(type, fn) {
        if (!fn) {
            delete this.events[type];
        } else {
            let i,
                listeners = this.events[type];
            for (i = listeners.length - 1; i >= 0; i--) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                }
            }
        }
    }

    removeMap() {
        //TODO: Migrate this to event object
        let events = this.events[this.eventList.PreRemove];
        if (events) {
            events.forEach(fn => {
                fn();   //TODO: consider the context of calling the function
            });
        }

        this.resetMap();
        this.map.remove();
        this._map = null;
    }

    clearDrawings() {
        this.drawings.forEach(drawing => {
            drawing.remove();
        });
        this.drawings = [];
    }

    clearLayerGroup(){
        if (!this.layerGroup){ 
            this.layerGroup = [];
        }
        else{
            this.layerGroup.forEach(feature => {
                this._map.removeLayer(feature);
            });
            this.layerGroup = [];
        }
    }

    resetMap() {
        this.clearDrawings();
        this.clearLayerGroup();
        this.setLayers(this.opts.layers);
        this.map.setLayerDefs({});
        this.setIdentifyLayers(this.opts.identifyid);
        this.setLegend(this.opts.legend, false);
    }

    getZIndex() {
        return this.zIndex;
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex;
        this.map.setZIndex(zIndex);

        this.triggerEvent(this.eventList.ZIndexChange, zIndex);
    }

    setSpatialReference(sr) {
        this.map.options.bboxSR = sr;
        this.map.options.imageSR = sr;

        this.triggerEvent(this.eventList.SpatialReferenceChange, sr);
    }

    setOpacity(value) {
        this.map.setOpacity(value);

        this.drawings.forEach(drawing => {
            drawing.setStyle({fillOpacity: value, opacity: value});
        });
    }

    getLayers() {
    //To solve bug T945: If map layers is empty array, incorect map image is returned
        //To solve this, we introduce invalid map id
        var layers = this.map.getLayers();
        return (layers.length === 1 && layers[0] === -1) ? [] : this.map.getLayers();
    }

    getIdentifyIds() {
        return this.opts.identifyIdProcessed
    }

    getPreProcessedIdentifyIds() {
        return this.opts.identifyIdPreProcessed;
    }

    setLayer(layerId) {
        if (!Number.isInteger(layerId)) {
            layerId = parseInt(layerId);
        }
        this.setLayers([layerId]);
    }

    setLayers(layers) {
        //To solve bug T945: If map layers is empty array, incorect map image is returned
        //To solve this, we introduce invalid map id
        this.map.setLayers(layers.length === 0 ? [-1] : layers);
    }

    setIdentifyLayer(layerId) {
        if (!Number.isInteger(layerId)) {
            layerId = parseInt(layerId);
        }
        this.setIdentifyLayers([layerId]);
    }

    setIdentifyLayers(layers) {
        this.opts.identifyIdPreProcessed = layers;
        this.opts.identifyIdProcessed = this.processIdentifyId(layers);
    }

    //TODO: synchronise getter/setter legend function name
    setLegend(legend, forceRefresh=true) {
        this.opts.newLegend = legend;
        //TODO: Compare for changes before refresh [data is array]
        if (forceRefresh) {
            EplActionCreator.refreshDisplay();
        }
    }

    getLegendIds() {
        return this.opts.newLegend;
    }

    getLayerDefs() {
        return this.map.getLayerDefs();
    }

    setLayerDef(layerId, def) {
        let defs = this.getLayerDefs();
        defs = defs ? defs : {};
        defs[layerId] = def;
        this.map.setLayerDefs(defs);
    }

    loadModal() {
        EplActionCreator.loadModal(this.getName());
    }

    loadModalComplete() {
        EplActionCreator.loadModalComplete(this.getName());
    }

    // Function to show Modal
    showModal(modal) {
        EplActionCreator.showModal(modal);
    }

    triggerEvent(type, data) {
        let events = this.events[type];
        if (events) {
            events.forEach(fn => {
                fn(data);   //TODO: consider the context of calling the function
            });
        }
    }

    getLayerBufferIdentifyUrl() {
        return this.getMapServiceUrl() + '/identify';
    }

    abortBuffer() {
        if(this.bufferRequest){
            this.bufferRequest.abort();
            this.bufferRequest = null;
        }
    }

    //default buffer layer intersect with geometry
    //ATTN: circle in geoJSON is point, using nearby query needs ArcGIS 10.3+
    bufferTask(polygon) {
        var scope = this;
        var url = this.getLayerBufferIdentifyUrl();
        var params = this.getLayerBufferIdentifyParams(polygon);
        
        this.abortBuffer();

        this.bufferRequest = Esri.post(url, params, function(error, response){
            if(error){
                let loading = L.DomUtil.get('buffer-loading');
                if(loading){
                    loading.style.display = 'none';
                }
                //console.log('Buffer tool error: ' + error.message);
                EplActionCreator.bufferDone();
            } else {
                var featureCollection = Esri.Util.responseToFeatureCollection(response);
                scope.postBufferTask.call(scope, featureCollection);
            }
        });
    }

    getLayerBufferIdentifyIds(){
        return this.getIdentifyIds();
    }
    
    //get identify parameters for post request (buffer)
    getLayerBufferIdentifyParams(polygon){
        var params = {
            sr: 4326,
            layers: this.getLayerBufferIdentifyIds(),
            tolerance: 1,
            returnGeometry: true
        };
        var extent = Esri.Util.boundsToExtent(this._map.getBounds());
        var size = this._map.getSize();
        var layerDefs = this.map.getLayerDefs();

        for (var key in layerDefs) {
            layerDefs[key] = decodeURI(layerDefs[key]);
        }

        params.layerDefs = layerDefs;
        params.mapExtent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
        params.imageDisplay = [size.x, size.y, 96];
        params.geometry = polygon;
        params.geometryType = 'esriGeometryPolygon';

        return params;
    }

    postBufferTask(featureCollection){
        this.bufferRequest = null;
        this.postBufferComplete(featureCollection);
    }

    postBufferComplete(featureCollection){
         //add layerId to mock the featureCollection as the same as identify results to reuse the template
         featureCollection.features.forEach((fc) => {
            fc.layerId = this.opts.identifyIdPreProcessed[0];
        });
        this.results = featureCollection;
        this.resultsChanged = true;

        EplActionCreator.bufferDone();
    }

    getDisplayAttrsByLayerId(displayAttrs, layerId){
        var attr = displayAttrs[layerId];
        //only one layerId mapping
        if(attr){
            return attr;
        }

        //check for many layerIds '1-2-3' as key
        for(let prop in displayAttrs){
            var ids = prop.split('-');
            var flag = true;
            for(let id of ids){
                if(layerId == id){
                    attr = displayAttrs[prop];
                    flag = false;
                    break;
                }
            }
          
            if(!flag){
                break;
            }
        }

        return attr;
    }

    drawFeatures(geometry, markerOpts) {
        let drawing = this.geometryToDrawing(geometry, markerOpts);
        this.drawings.push(drawing);
    
        drawing.addTo(this._map).bringToFront();

        return drawing;
    }

    geometryToDrawing(geometry, markerOpts) {
        let drawing;
        switch (geometry.type) {
            case FeatureConstants.Point:
                drawing = new L.marker(geometry.coordinates[0], markerOpts);
                break;
            case FeatureConstants.Line:
                drawing = new L.Polyline(geometry.coordinates, markerOpts);
                break;
            case FeatureConstants.Polygon:
                drawing = new L.polygon(geometry.coordinates, markerOpts);
                break;
            case FeatureConstants.MultiLine:
                drawing = new L.Polyline(geometry.coordinates, markerOpts);
                break;
            case FeatureConstants.MultiPolygon:
                drawing = new L.polygon(geometry.coordinates, markerOpts);
                break;
            default:
                console.log("geometryToDrawing: Unknown geometry type");
                break;
        }

        return drawing;
    }
}
