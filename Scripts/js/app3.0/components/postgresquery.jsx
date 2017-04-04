/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : postgresquery.jsx
 * DESCRIPTION     : dynamic postgresquery right panel
 * AUTHOR          : xingyu
 * DATE            : April 3, 2017
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
import QueryStore from 'stores/querystore'
import Jrangeslider from 'components/ui/jrangeslider'

var emptyObject = (d) => {

  return d > 1000 ? '#800026' :
   d > 40  ? '#BD0026' :
   d > 30  ? '#E31A1C' :
   d > 20  ? '#FC4E2A' :
   d > 15   ? '#FD8D3C' :
   d > 10   ? '#FEB24C' :
   d > 5   ? '#FED976' :
              '#FFEDA0';
};


var highlightFeature = (e) => {
   var layer = e.target;

 //console.log(layer)

   layer.setStyle({
       weight: 5,
       color: '#666',
       dashArray: '',
       fillOpacity: 0.7
   });

   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
       layer.bringToFront();
   }
   //info.update(layer.feature.properties);
}

var geojson;

var resetHighlight = (e) =>{
 geojson.resetStyle(e.target);
// info.update();
}

var zoomToFeature = (e) => {
 map.fitBounds(e.target.getBounds());
}


class PostgresQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            _map:Util.getMap(),
            uiState: UiStore.getUiState(),
            showStatus : ClusterStore.getClusterStatus(),
            nearbyJsonData : ClusterStore.getNearbyJsonData(),
            clusterLayer : null,
            tempMarker:null,
            geojsonfeature:null
        };



        this._onChange = this._onChange.bind(this);

        this.showClusterStatus = this.showClusterStatus.bind(this);

        this._onUiChange = this._onUiChange.bind(this);

        this._onQueryChange = this._onQueryChange.bind(this);


    }

    componentDidMount() {
        LayerManagerStore.addChangeListener(this._onChange);
        ClusterStore.addChangeListener(this.showClusterStatus);
        UiStore.addChangeListener(this._onUiChange);
        QueryStore.addChangeListener(this._onQueryChange);

        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content);
        fancybox($);
    }

    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
        ClusterStore.removeChangeListener(this.showClusterStatus);
        UiStore.removeChangeListener(this._onUiChange);
        QueryStore.removeChangeListener(this._onQueryChange);

    }

    showClusterStatus(){

        this.setState({
            showStatus : ClusterStore.getClusterStatus()
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

    _onQueryChange(){

    }


    closeRightMenu() {
        EplActionCreator.clearHighlights();
        EplActionCreator.closeRightPanel();
    }

    toggleLayer(){


      //EplActionCreator.dynamicQuery(this.state._map);

      var scope =this;

            $.ajax({
                dataType: 'json',
                type:'GET',
                url:'https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1/pgquery',
                success:function(data) {

                  scope.setState({
                    geojsonfeature: new L.geoJson(data,{style:scope.style,onEachFeature: scope.onEachFeature})
                  })

                  geojson = new L.geoJson(data,{style:scope.style,onEachFeature: scope.onEachFeature})

                  scope.state.geojsonfeature.addTo(scope.state._map);


                },
                error: function (request, status, error) {
                    console.log(error)
                }
            });


    }

    style(feature){

       return {
           fillColor: emptyObject(feature.properties.gid),
           weight: 2,
           opacity: 1,
           color: 'white',
           dashArray: '3',
           fillOpacity: 0.7
       };
    }

    onEachFeature(feature, layer){

       layer.on({
           mouseover: highlightFeature,
           mouseout: resetHighlight,
           click: zoomToFeature
       });
    }





    render() {

      console.log(this.state._map)
                    return (
                        <div id="legend-div" className="legend-color"  >
                            <div className="si-title-wrapper si-title-color">
                                <span className="si-title">Postgres Query</span>
                                <span id="siteinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeRightMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                            </div>

                            <button onClick={this.toggleLayer.bind(this)}>Show</button>
                            <Jrangeslider/>
                    </div>
                   );
            }
      }
export default PostgresQuery;
