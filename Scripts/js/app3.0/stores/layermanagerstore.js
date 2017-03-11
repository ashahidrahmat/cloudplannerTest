/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layermanagerstore.js
 * DESCRIPTION     : 
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

import EplActionCreator from 'actions/eplactioncreator';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplConstants from 'constants/eplconstants';
import LayerFactory from 'layers/layerfactory';
import BaseStore from 'stores/basestore';
import MapData from 'layers/mapdata';
import MapStore from 'stores/mapstore';
import Ajax from 'wrapper/ajax';
import Util from 'utils';

class LayerManagerStore extends BaseStore {

    constructor(opts) {
        super();
        this.opts = opts;
        this.maps = [];
        this.layers = [];
        this.selected = [];
        this.layersByName = {};
        this.detailedLayer = null,
        this.layersByCategories = [];
        this.searchedLayersByCategories = [];
        this.searchedLayersByCategories1 = {"result":["Maps"]}
        this.openedCategory = null;


        let 
                         results = this.searchedLayersByCategories1.result,
                         catLen = MapData.length;

        //for each category
        for (var j = catLen - 1; j >= 0; j--) {
            let layers = MapData[j].layers,
                len = layers.length;

            //for each layer in category
            // for (var i = len - 1; i >= 0; i--) {
            //     var layer = layers[i];
            //     let src = layer.src,
            //         pattern = src.split('services/')[1];

            //     if ((src.indexOf('//') < 0 && results.indexOf(pattern) < 0)) {

            //         //delete layer
            //         layers.splice(i, 1);
            //     }
            // }

            if (MapData[j].layers.length <= 0) {
                MapData.splice(j, 1);
            }
        }

        this.loadLayers();
        this.emitChanges();

    }

    reset() {
        this.removeAllLayers();
    }

    getTotalLayerCount() {
        return this.searchedLayersByCategories.length > 0 ? this.searchedLayersByCategories.map(category => {
            return category.layers.length;
        }).reduce((prev, curr) => {
            return prev + curr;
        }) : 0;
    }

    getLayerByName(layerName) {
        return this.layersByName[layerName];
    }

    getLayersByCategories() {
        return this.searchedLayersByCategories;
    }

    isSelected(layerName) {
        var hasLayer = false;
        for (var i = 0, len = this.selected.length; i < len; i++) {
            if (this.selected[i].getName() === layerName) {
                hasLayer = true;
                break;
            }
        }

        return hasLayer;
    }

    getSelected() {
        return this.selected;
    }

    getIdentifyDisplay() {
        return this.selected.map((layer, i) => {
            return layer.getIdentifyDisplayCache(i);
        });
    }

    clearSelected() {
        this.selected = [];
    }

    identify(latLng) {
        this.selected.map(layer => {
            layer.identify(latLng);
        });
    }

    addLayer(layerName) {
        let layer = this.layersByName[layerName];
        this.selected.unshift(layer);
        layer.setZIndex(this.selected.length);
        this.resetSelectedZIndex();
    }

    removeLayer(layerName) {
        this.selected.forEach((layer, i) => {
            if (layer.getName() === layerName) {
                this.selected.splice(i, 1);
                return;
            }
        });

        this.resetSelectedZIndex();
    }

    removeAllLayers() {
        this.clearSelected();
    }

    resetSelectedZIndex() {
        var length = this.selected.length;
        this.selected.forEach((layer, i) => {
            layer.setZIndex((length-i).toString());
        });
    }

    getLegend(layerName) {
        return this.layersByName[layerName].getLegend();
    }

    getSelectedNames() {
        return this.selected.map(layer => {
           return layer.getName();
        }); 
    }

    loadLayers() {
        MapData.forEach(categoryConfig => {
            let type, category,
                image = categoryConfig.image;
            
            if (/\.jp(g|eg)$/.test(image)) {
                type = 'image/jpeg';
            } else if (/\.png$/.test(image)) {
                type = 'image/png';
            } else if (/\.svg/.test(image)) {
                type = 'image/svg+xml';
            }
                
            category = {
                name: categoryConfig.category,
                icon: categoryConfig.image,
                type: type,
                layers: []
            };

            categoryConfig.layers.forEach(layerConfig => {
                

                let layer = LayerFactory.getLayer(layerConfig.class, layerConfig);

                category.layers.push(layer);
                this.layersByName[layer.getName()] = layer;
            });

            this.layersByCategories.push(category);
            this.clearSearchDataset();
        });
    }

    exportCSV(layerName, data){
        if(data!=null && data.length > 0){
            let scope = this,
                selected = this.selected,
                link = document.createElement("a");

            var blob = new Blob([Util.generateCSVString(data)],{type: "text/csv;charset=utf-8;"});

            if (navigator.msSaveBlob) {              

                navigator.msSaveBlob(blob, layerName.replace(" ","_") + ".csv")

            }
            else{    
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", layerName.replace(" ","_")+".csv");
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }      
        
    }

    addFeatureCollectionToMap(layerName, featureArray){   
        let layer = this.layersByName[layerName];
        var featureCollection, layerGroup, overlays; 
        layerGroup = L.layerGroup();

        if (!layer.layerGroup){ 
            layer.layerGroup = [];
        }
        else{
            layer.layerGroup.forEach(feature => {
                layer._map.removeLayer(feature);
            });
            layer.layerGroup = [];
        }

        for(var catg in featureArray){
            if (featureArray.hasOwnProperty(catg)) {
                featureCollection = [];
                for(var i= 0; i< featureArray[catg][0].length; i++){
                    var featureGeomCoords = Util.reversePolygonLatLng(featureArray[catg][0][i][0]).coordinates[0]; 

                    var polygon = L.polygon(featureGeomCoords, featureArray[catg][1] );

                    polygon.addTo(layerGroup);
                    layer.layerGroup.push(polygon); 
                }               
            }
        }             
 
        layer._map.addLayer(layerGroup);
    }

    filterDataset(searchText) {
        let regex = new RegExp(searchText, 'i');

        return this.layersByCategories.map(category => {
            return {
                name: category.name,
                icon: category.icon,
                type: category.type,
                layers: category.layers.filter(layer => {
                    return regex.test(layer.getName());
                })
            };
        }).filter(category => {
            return category.layers.length > 0;
        });
    }

    searchDataset(searchText) {
        this.searchedLayersByCategories = this.filterDataset(searchText);
    }

    searchLayer(searchText) {
        let layers = [];

        this.filterDataset(searchText).forEach(category => {
            layers = layers.concat(category.layers);
        });

        return layers.filter(layer => {
            return typeof layer.opts.search !== "undefined";
        });
    }

    retriveLayerSummary(layerName) {
        this.detailedLayer = this.layersByName[layerName];
        this.detailedLayer.retrieveSummaryAjax();
    }

    getSummary() {
        return this.detailedLayer ? this.detailedLayer.getSummaryComponent() : null;
    }

    getInfographics() {
        return this.detailedLayer ? this.detailedLayer.getInfographicsComponent() : null;
    }

    clearSearchDataset() {
        this.searchedLayersByCategories = this.layersByCategories;
    }

    reorderSelected(order) {
        this.selected = order.map(index => {
            return this.selected[index];
        });

        this.resetSelectedZIndex();
    }

    setLayerOpacity(layerName, value) {
        var layer = this.getLayerByName(layerName);

        layer.setOpacity(value / 100);
    }

    hasLayerWithFilter() {
        var has = false;
        for (var i = 0, len = this.selected.length; i < len; i++) {
            if (this.selected[i].showsFilterbox()) {
                has = true;
                break;
            }
        }

        return has;
    }

    getSelectedWithFilterbox() {
        return this.selected.filter(layer => {
            return layer.showsFilterbox();
        });
    }

    addedLayerHasInfoDisplay() {
        let latest = this.selected[0];
        return latest ? latest.getLayerInfo() !== undefined : false;
    }

    getLatestLayer() {
        return this.selected[0];
    }

    getLatestLayerInfo() {
        let latest = this.selected[0];

        return latest && latest.getLayerInfo() ? latest.getLayerInfo() : '';
    }

    latestLayerHasInfo() {
        return this.getLatestLayerInfo() !== '';
    }

    getOpenedCategory(){
        return this.openedCategory;
    }

    setOpenedCategory(category){
        this.openedCategory = category;
    }
    
}

var instance = new LayerManagerStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case EplConstants.RefreshDisplay:
            instance.emitChanges();
            break;
        case EplConstants.Reset:
            AppDispatcher.waitFor([MapStore.dispatchToken]);
            instance.reset();
            instance.emitChanges();
            break;
        case EplConstants.AddLayer:
            AppDispatcher.waitFor([MapStore.dispatchToken]);
            if (!instance.isSelected(action.layerName)) {
                instance.addLayer(action.layerName);
                instance.emitChanges();
            }
            break;
        case EplConstants.RemoveLayer:
            AppDispatcher.waitFor([MapStore.dispatchToken]);
            instance.removeLayer(action.layerName);
            instance.emitChanges();
            break;
        case EplConstants.RemoveAllLayers:
            AppDispatcher.waitFor([MapStore.dispatchToken]);
            instance.removeAllLayers();
            instance.emitChanges();
            break;
        case EplConstants.ReorderLayer:
            instance.reorderSelected(action.order);
            instance.emitChanges();
            break;
        case EplConstants.ShowLayerSummary:
            break;
        case EplConstants.ShowLayerStatistics:
            break;
        case EplConstants.Identify:
            instance.identify(action.latLng);
            break;
        case EplConstants.IdentifyComplete:
            instance.emitChanges();
            break;
        case EplConstants.SearchDataset:
            instance.searchDataset(action.layerFilterText);
            instance.emitChanges();
            break;
        case EplConstants.QueryLayerSummary:
            instance.retriveLayerSummary(action.layerName);
            break;
        case EplConstants.RetrieveSummaryComplete:
            instance.emitChanges();
            break;
        case EplConstants.SetLayerOpacity:
            instance.setLayerOpacity(action.layerName, action.value);
            //instance.emitChanges();
            break;
        case EplConstants.ExportCSV:
            instance.exportCSV(action.layerName, action.data);
            break;
        case EplConstants.AddFeatureCollection:
            instance.addFeatureCollectionToMap(action.layerName, action.data);            
            instance.emitChanges();
            break;
        case EplConstants.LoadModalComplete:
            instance.loadModalComplete(action.layerName);
            break;
        default:
            //no op
    }
});

export default instance;