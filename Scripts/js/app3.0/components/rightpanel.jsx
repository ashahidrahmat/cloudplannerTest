/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : rightpanel.js
 * DESCRIPTION     : Reactjs component for RightPanel
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
"use strict";

import React from 'react';
import UiStore from 'stores/uistore';
import MapStore from 'stores/mapstore';
import Map3DStore from 'stores/3dmapstore';
import IdentifyDisplay from 'components/identifydisplay';
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';
import Util from '\\util';
import GeoPhotoDiv from 'components/geophoto/geophotodiv'
import ClusterStore from 'stores/clusterstore'; 
import L from 'leaflet';

class RightPanel extends React.Component {

    constructor(props) {
        super(props);
            
        this.state = {
            showId: 0,
            expanded: false,
            siteInfo: MapStore.getSiteInfo() || Map3DStore.getSiteInfo(),
            selected: LayerManagerStore.getSelected(),
            identifyLoading: UiStore.getIdentifyLoadingState(),
            nearbyJsonData:ClusterStore.getUATImageData()
        };

        this._onChange = this._onChange.bind(this);
        this._onUiChange = this._onUiChange.bind(this);
        this._onSiteInfoChange = this._onSiteInfoChange.bind(this);
    }

    componentDidMount() {
        UiStore.addChangeListener(this._onUiChange);
        MapStore.addChangeListener(this._onSiteInfoChange);
        Map3DStore.addChangeListener(this._onSiteInfoChange);
        LayerManagerStore.addChangeListener(this._onChange);
        this.centerMapOnIdentify();
    }

    componentWillUnmount() {
        UiStore.removeChangeListener(this._onUiChange);
        MapStore.removeChangeListener(this._onSiteInfoChange);
        Map3DStore.removeChangeListener(this._onSiteInfoChange);
        LayerManagerStore.removeChangeListener(this._onChange);
    }

    closeRightMenu() {
        EplActionCreator.clearHighlights();
        EplActionCreator.closeRightPanel();
    }

    _onChange() {

        this.setState({
            selected: LayerManagerStore.getSelected()
        });
       
    }

    _onUiChange() {
        this.setState({
            identifyLoading: UiStore.getIdentifyLoadingState()
        });
    }

    _onSiteInfoChange() {
        var siteInfo = {};
        Map3DStore.isInitialized() ? siteInfo = Map3DStore.getSiteInfo() : siteInfo = MapStore.getSiteInfo();

        this.setState({
            siteInfo: siteInfo
        });
    }

    _onRowClick(newId) {
        return (e) => {
            if (this.state.showId === newId) {
                newId = -1;
            }

            this.setState({
                showId: newId
            });
        }
    }

    _toggleRightPanelExpansion(evt) {
        this.setState({
            expanded: !this.state.expanded
        });

    }

    centerMapOnIdentify(){
        let offset = 20;
        if(Util.getIdentifyPoint()){
            if(Util.getIdentifyPoint().point.x >= this.refs.siteInfoPanel.getBoundingClientRect().left - offset){
                Util.centerMap();
            }
        }
    }

    render() {
        var infoId = this.state.selected.length,
            showSiteInfo = infoId === this.state.showId,
            expanded = this.state.expanded,
            resizeClass = expanded ? "reduce-icon expand-icon-color" : "expand-icon expand-icon-color",
            resizeInfoClass = expanded ? "icon-resize-small" : "icon-resize-full",
            resizeStyleMap = expanded ? { width: '66%' } : { width: '33%' },
            iconClass = showSiteInfo ? "cate-up-icon" :  "cate-minus-icon",
            siteClass = showSiteInfo ? "show" : "hide",
            siteInfo = this.state.siteInfo;
            
       
        var featureImgStyle;

        var tempLatLng = {
            lat:Util.getIdentifyPoint().latLng.lat,
            lng:Util.getIdentifyPoint().latLng.lng
        }

        var temp = true, geoTagPhoto = [], photoCount = this.state.nearbyJsonData.length, currentDiameter, bounding;
        
        MapStore.removeCircles();

        //use circle marker as a reference
        if(!Map3DStore.isInitialized()) {
            currentDiameter = MapStore.createCircle([tempLatLng.lat,tempLatLng.lng], 100,{fill: false,
                color: 'none',
                opacity: 0}); 
            bounding = currentDiameter.getBounds();
        }

        //getNearbydata currently get all and check for nearby
        this.state.nearbyJsonData.map((nearbyData, j) => { 
            
            //is it in the buffer range?
            if(bounding && bounding.contains([nearbyData.LatLng.lat,nearbyData.LatLng.lng])){
                geoTagPhoto.push({nearbyData})
            }  
    
        });

        if(geoTagPhoto.length > 0){ 
             
            featureImgStyle={
                display:'block'
            }

        }else{ 
               
            featureImgStyle={
                display:'none'
            }
        }
        

        return (
            <div ref="siteInfoPanel" id="siteinformation" className="siteinformation-color" style={resizeStyleMap}>
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Layer Results {this.state.identifyLoading && this.state.selected.length ? <i className="icon-spin5 animate-spin"></i> : null} </span>
                    <span id="siteinfo-resize" className={resizeClass} onClick={this._toggleRightPanelExpansion.bind(this)}><i className={resizeInfoClass}></i></span>
                    <span id="siteinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeRightMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div id="si-content">
                    <div id="lr-ul">
                        <IdentifyDisplay selected={this.state.selected} showId={this.state.showId} onRowClick={this._onRowClick.bind(this)}/>
                    </div>
                    <div>
                        <div id="site-fixed" className="lr-title-wrapper site-fixed-unselected" onClick={this._onRowClick.bind(this)(infoId)}>
                            <span className="lr-title">Site Information</span>
                            <span className={iconClass}></span>
                        </div>
                        <div className={siteClass + " site-fixed-info"}>
                            <table className="site-fixed-info-table" border="1">
                                <tbody>
                                    <tr><td width="116px;">Address</td><td>{siteInfo.address}</td></tr>
                                    <tr><td>DA Polygon ID</td><td>{siteInfo.polygonId}</td></tr>
                                    <tr><td>Planning Area</td><td>{siteInfo.plngArea}</td></tr>
                                    <tr><td>Planning Subzone</td><td>{siteInfo.subZone}</td></tr>
                                    <tr><td>Constituency</td><td>{siteInfo.constituency}</td></tr>
                                    <tr><td>Divisional Ward</td><td>{siteInfo.ward}</td></tr>
                                    <tr><td>MP Name</td><td>{siteInfo.mp}</td></tr>
                                </tbody>
                            </table>
                            
                            <div className="featured-image-wrapper">
                        
                         <div id="two" style={featureImgStyle}><GeoPhotoDiv photoCount={geoTagPhoto.length} geophoto ={geoTagPhoto}/></div>  
                        
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RightPanel;