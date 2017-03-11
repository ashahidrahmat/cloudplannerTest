/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : geotagphotodetail.jsx
 * DESCRIPTION     : geo tag photo gallery right panel
 * AUTHOR          : xingyu
 * DATE            : Feb 1, 2017
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
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';
import ClusterStore from 'stores/clusterstore';
import UiStore from 'stores/uistore';
import Util from 'utils';
import Layer from 'layers/layer';
import Masonry from 'react-masonry-component';
import Lphoto from 'libs/leafletphoto/Leaflet.Photo.js';
import L from 'leaflet';
import $ from 'jquery';
import Ajax from 'wrapper/ajax';
import fancybox from 'fancybox';

class GeoTagPhoto extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            _map:Util.getMap(),
            uiState: UiStore.getUiState(),
            showStatus : ClusterStore.getClusterStatus(),
            nearbyJsonData : ClusterStore.getNearbyJsonData(),
            clusterLayer : null,
            tempMarker:null
        };

        this.onSelectImage = this.onSelectImage.bind(this);

        this._onChange = this._onChange.bind(this);

        this.showClusterStatus = this.showClusterStatus.bind(this);

        this._onUiChange = this._onUiChange.bind(this);
    }

    componentDidMount() {
        LayerManagerStore.addChangeListener(this._onChange);
        ClusterStore.addChangeListener(this.showClusterStatus);
        UiStore.addChangeListener(this._onUiChange);

        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content);
        fancybox($);
    }

    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
        ClusterStore.removeChangeListener(this.showClusterStatus);
        UiStore.removeChangeListener(this._onUiChange);

        //clear existing photo marker layer
        if(this.state.clusterLayer != null){

            this.state.clusterLayer.clear()

        }

        //clear individual markers only, not islandwide
        if(ClusterStore.getClusterStatus() == false){
            console.log("clear temp marker false")
            EplActionCreator.clearPhotoTempMarker(true);
        }

         
    }

    showClusterStatus(){
        
        this.setState({
            showStatus : ClusterStore.getClusterStatus()
        });
    }


    onSelectImage (index, image) {

        //get marker json data
        var markerJsonLayer = ClusterStore.getPhotoMarkers();

        var id;
        var images = this.state.nearbyJsonData.slice();
        var img = images[index];


        if(img.isSelected == true){
            img.isSelected = false

        }else{

            img.isSelected = true;

            markerJsonLayer.map((item, j) => {

                //use img url for comparison and find its id
                if(item._details.url == image.src){

                    this.id = item._leaflet_id;
                    this.latlng = item._latlng

                    //move to marker and open pop up
                    this.state._map.panTo([item._latlng.lat,item._latlng.lng])

                }

            });
        }


        this.setState({
            images: images
        });


    }

    _onChange() {

        this.setState({
            nearbyJsonData : ClusterStore.getNearbyJsonData()
        });

    }

    _onUiChange() {

        this.setState({
            uiState: UiStore.getUiState()
        });
    }


    closeMenu() {

        //closeMenu
        EplActionCreator.closeGeoPhotoMenu();

        //clear existing photo marker layer
        if(this.state.clusterLayer != null){

            this.state.clusterLayer.clear();

        }
    }

    //show photo marker on map
    imageBinding(element){
         
        /*Follow the format*/
        EplActionCreator.customGeoPhotoData([element.nearbyData]);
         

    }

    highlight(value){

        $(".thumbnail").css('border-color', '');  
        $(value.target.parentElement).css('border-color', '#4787ed');
        
    }

    render() {

        var scope = this;

        var popUpModal = {
            display: "block",
            minHeight: "1px",
            width: "100%",
            border: "1px solid #ddd",
            overflow: "auto"
        }

        var masonryOptions = {
            transitionDuration: 750,
            itemSelector: '.col-lg-4 col-md-4 col-sm-6 col-xs-12'
        };



        var childElements = this.state.nearbyJsonData.map(function(element){
  
            return (
                 <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 geotagphtoto" style={{boxSizing:'border-box'}} onClick={scope.imageBinding.bind(scope,element)}>
                        <a className="thumbnail article" onClick={scope.highlight.bind(this)}><img className ="article-image" src={element.nearbyData.Url}/></a>
                    </div>
              )});


                    return (
                        <div id="legend-div" className="legend-color"  >
                            <div className="si-title-wrapper si-title-color">
                                <span className="si-title">Photo</span>
                                <span id="legend-close-btn" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-left-circled"></i></span>
                            </div>


                               <div style={{height:'95%',position:'relative',top:'15px'}}>
              <div ref="cateContent" className="row" style={{height:'100%'}}>
                <div>
              <Masonry
        className={''} // default ''
        elementType={'div'} // default 'div'
        options={masonryOptions} // default {}
        disableImagesLoaded={true} // default false
        updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false

    >
              {childElements}
         </Masonry>
        </div>
        </div>

        </div>
        </div>
       );
              }
}
export default GeoTagPhoto;
