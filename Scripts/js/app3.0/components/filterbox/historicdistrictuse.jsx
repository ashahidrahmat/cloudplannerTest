/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : historicdistrictuse.js
 * DESCRIPTION     : Filterbox component for historic district use layer
 * AUTHOR          : jianmin
 * DATE            : Jul 28, 2016
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

import Util from '\\util';
import React from 'react';
import DropDownList from 'components/ui/dropdownlist';
import EplActionCreator from 'actions/eplactioncreator';

export default class HistoricDistrictUseFilterbox extends React.Component {

    constructor(props) {
        super(props);
        this.layer = this.props.layer;

        this.state = {
            showBuilding: this.layer.selectedLayerId || 0,
            storeys: this.layer.getFBStoreys(),
            years : this.layer.getFBYears(),
            conservNames : this.layer.getFBConservNames(),
            categories : this.layer.getFBCategories()
        };

        this.onUiChange = this.onUiChange.bind(this);
        this.onYearUiChange = this.onYearUiChange.bind(this);        
    }    

    onAggregationChange(evt) {
        if(this.layer){
            let layerId = (this.refs.hduAggregation.value === "District") ? 0 : 1;
            layerId === 1 ? this.drawFeaturesOnMap() : this.refreshLayer(layerId);
        }

        EplActionCreator.clearHighlights();        
        EplActionCreator.removeIdentifyMarker();
    }

    onDistrictChange(evt) {
        let district = evt.target.value;
        if(this.layer){
            this.props.layer.zoomToDistrict(district);
        }

        EplActionCreator.removeIdentifyMarker();
        EplActionCreator.refreshDisplay();
    }
    
    onYearChange(evt) {
        this.drawFeaturesOnMap();
    }

    onStoreyChange(evt) {
        this.drawFeaturesOnMap();
    }

    onCategoryChange(evt){
        this.drawFeaturesOnMap();
    }

    onUiChange(evt){
        this.setState({
            showBuilding: this.state.showBuilding ^ 1
        });
    }

    onYearUiChange(evt){
        let year = evt.target.value;
        let storeys = [];
        let filteredTableStats = this.layer.tableStats["All"]["CAT_" + year];

        for(var st in filteredTableStats){

            filteredTableStats[st] && st != "All" ? storeys.push({ title: st + ' Storey', value: st }) : null;
        }
        
        this.setState({
            storeys: storeys
        });
    }

    componentDidMount() {
        this.refs.hduAggregation.addEventListener('change', this.onUiChange);
        this.refs.hduYear.addEventListener('change', this.onYearUiChange);  
        
        this.refs.hduAggregation.value = this.layer.selectedLayerId === 0 ? this.refs.hduAggregation[0].value : this.refs.hduAggregation[1].value;        

        if(Object.keys(this.layer.tableStats).length == 0){
            this.layer.getFeatureData(this);
        }     
        
        this.layer.selectedLayerId === 1 ? this.drawFeaturesOnMap() : null;        

    }

    componentWillUnmount() {
        this.refs.hduAggregation.removeEventListener('change', this.onUiChange);
        this.refs.hduYear.removeEventListener('change', this.onYearUiChange);
    }

    refreshLayer(layerId){
        
        if(this.layer){           

            if (this.layer.layerGroup.length > 0){                
                this.layer.layerGroup.forEach(layer => {
                    this.layer._map.removeLayer(layer);
                });
                this.layer.layerGroup = [];
            }

            EplActionCreator.setLayerOpacity(this.layer.getName(), 100);

            this.layer.selectedLayerId = layerId;
            let defs = {};
            this.layer.setLayers([this.layer.selectedLayerId]);
            this.layer.setIdentifyLayers([this.layer.selectedLayerId]);
            this.layer.setLegend([this.layer.selectedLayerId]);
        }
    }
    
    drawFeaturesOnMap(){
        //this.forceUpdate();
        this.layer.selectedLayerId = 1;
        this.layer.setIdentifyLayers([1]);
        this.layer.setLegend([1]);
        EplActionCreator.setLayerOpacity(this.layer.getName(), 0);
        let year = this.refs.hduYear.value,
            storey = this.refs.hduStorey.value,
            catg = this.refs.hduCategory.value,
            buildingFeature, storeyData,
            catgLayerData = {};     

        this.layer.filterBoxValues = { year : year, storey : storey, catg : catg };

        var dataColors = this.layer.uniqKeyValues.catgColors;

        if(this.layer.infographics){
            this.layer.drawings = [];

            for(var c= 0; c< this.layer.uniqKeyValues.categories.length; c++){
                catgLayerData[this.layer.uniqKeyValues.categories[c]] = [[]];
            }

            for(var i= 0; i< this.layer.infographics[1].features.length; i++){
                if (i == this.layer.infographics[1].features.length){
                    break;
                }
                buildingFeature = this.layer.infographics[1].features[i];
                if(buildingFeature.properties["CAT_" + year]){
                    storeyData = buildingFeature.properties["CAT_" + year].split(",");
                }
                else{
                    continue;
                }
                
                if(catg == "All"){
                    var category = storeyData[this.layer.uniqKeyValues.storeys.indexOf(storey)-1].trim();
                    catgLayerData[category] ? catgLayerData[category][0].push( [buildingFeature.geometry] ) : null;
                    catgLayerData[category] ? catgLayerData[category][1] = { fill : true, fillColor : dataColors[category] , color : "#111111" , opacity : 0.5, fillOpacity : 1, weight : 0.5, clickable: false} : null;
                   
                }
                else if(storeyData[this.layer.uniqKeyValues.storeys.indexOf(storey)-1].trim() == catg){                  
                    catgLayerData[catg] ? catgLayerData[catg][0].push( [buildingFeature.geometry] ) : null;
                    catgLayerData[catg] ? catgLayerData[catg][1] = { fill : true, fillColor : dataColors[catg] , color : "#111111" , opacity : 0.5, fillOpacity : 1, weight : 0.5, clickable: false} : null;
               }        
            }
                        
            EplActionCreator.addFeatureCollection(this.layer.getName(), catgLayerData);
        }
    }

    render() {
        let aggregationOptions = Util.listToOptions(this.props.aggregationOptions),
            districtOptions = Util.listToOptions(this.state.conservNames),
            years = Util.listToOptions(this.state.years),
            storeys = Util.listToOptions(this.state.storeys),
            categories = Util.listToOptions(this.state.categories);

        let show = (this.state.showBuilding) ? 'show' : 'hide';        

        return (
            <div>
                <div className="ui_component">
                    <div className="ui_component_label">{'Aggregation'}</div>
                    <div className="ui-component-select">
                        <select ref='hduAggregation' className="select" onChange={this.onAggregationChange.bind(this)}>{aggregationOptions}</select>
                    </div>
                </div>

                <div className="ui_component">
                    <div className="ui_component_label">{'District'}</div>
                    <div className="ui-component-select">
                        <select ref='hduDistrict' className="select" onChange={this.onDistrictChange.bind(this)}>{districtOptions}</select>
                    </div>
                </div>
                 <div className={show}>
                        <div className="ui_component">
                            <div className="ui_component_label">{'Year'}</div>
                            <div className="ui-component-select">
                                <select ref='hduYear' className="select" onChange={this.onYearChange.bind(this)}>{years}</select>
                            </div>
                        </div>

                        <div className="ui_component">
                            <div className="ui_component_label">{'Storey'}</div>
                            <div className="ui-component-select">
                                <select ref='hduStorey' className="select" onChange={this.onStoreyChange.bind(this)}>{storeys}</select>
                            </div>
                        </div>
                        <div className="ui_component">
                            <div className="ui_component_label">{'Category'}</div>
                            <div className="ui-component-select">
                                <select ref='hduCategory' className="select" onChange={this.onCategoryChange.bind(this)}>{categories}</select>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}