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


class PostgresQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            _map:Util.getMap(),
            uiState: UiStore.getUiState(),
            geojson: null
        };

        this._onUiChange = this._onUiChange.bind(this);

        this._onQueryChange = this._onQueryChange.bind(this);
    }

    componentDidMount() {

        UiStore.addChangeListener(this._onUiChange);
        QueryStore.addChangeListener(this._onQueryChange);

        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content);
        fancybox($);

        //add map to outside variable

    }

    componentWillUnmount() {

        UiStore.removeChangeListener(this._onUiChange);
        QueryStore.removeChangeListener(this._onQueryChange);

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

            $.ajax({
                dataType: 'json',
                type:'GET',
                url:'https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1/pgquery',
                success:(data) => {

                    this.setState({
                        geojson:new L.geoJson(data,{style:this.style.bind(this),onEachFeature: this.onEachFeature.bind(this)})
                    })

                    //add to map
                    this.state.geojson.addTo(this.state._map);


                },
                error: function (request, status, error) {
                    console.log(error)
                }
            });


    }

    getColor(d) {
		return d > 1000 ? '#800026' :
			   d > 500  ? '#BD0026' :
			   d > 200  ? '#E31A1C' :
			   d > 100  ? '#FC4E2A' :
			   d > 50   ? '#FD8D3C' :
			   d > 20   ? '#FEB24C' :
			   d > 10   ? '#FED976' :
						  '#FFEDA0';
	}

    style(feature){
        //feature.properties.gid
        let color = this.getColor(feature.properties.gid);

       return {
           fillColor: color,
           weight: 2,
           opacity: 1,
           color: 'white',
           dashArray: '3',
           fillOpacity: 0.7
       };
    }

    onEachFeature(feature, layer){

       layer.on({
           mouseover: this.highlightFeature,
           mouseout: this.resetHighlight.bind(this),
           click: this.zoomToFeature
       });
    }


     highlightFeature(e) {
		var layer = e.target;

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

	 resetHighlight(e) {
         if(this.state.geojson){
             this.state.geojson.resetStyle(e.target);
         }

		//info.update();
	}

	 zoomToFeature(e) {
		this._map.fitBounds(e.target.getBounds());
	}


    render() {
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
