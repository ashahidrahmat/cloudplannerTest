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
import {invokeApig} from 'components/restapi/awsLib';
import config from 'components/restapi/config';
import BarChart from 'components/charts/barchart';
import {ChartColors, ChartOrientation} from 'constants/chartconstants';

class PostgresQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showId: 0,
            expanded: false,
            identifyLoading: UiStore.getIdentifyLoadingState(),
            _map:Util.getMap(),
            uiState: UiStore.getUiState(),
            geojson: null,
            unmountSlider:false,
            barchartX:QueryStore.getBarchartDataX(),
            barchartY:QueryStore.getBarchartDataY()
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

        //toggle jrangeslider
        //shoe slider at the same time
        EplActionCreator.togglejrangeslider("jrangeslider");

    }

    componentWillUnmount() {
        UiStore.removeChangeListener(this._onUiChange);
        QueryStore.removeChangeListener(this._onQueryChange);
    }


    _onUiChange() {

        this.setState({
            uiState: UiStore.getUiState(),
            identifyLoading: UiStore.getIdentifyLoadingState()
        });
    }

    _onQueryChange(){

      this.setState({
        barchartX:QueryStore.getBarchartDataX(),
        barchartY:QueryStore.getBarchartDataY()
      });
    }


    closeRightMenu() {
        EplActionCreator.clearHighlights();
        EplActionCreator.closeRightPanel();
    }

    toggleLayer(){

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

  query(){
    console.log("query");

    return invokeApig({
      path: '/pgquery',
      method: 'POST',
      body: '{"myquery":"query1"}',
    });

  }

  _toggleRightPanelExpansion(evt) {
      this.setState({
          expanded: !this.state.expanded
      });

  }


    render() {

        var expanded = this.state.expanded,
            resizeClass = expanded ? "reduce-icon expand-icon-color" : "expand-icon expand-icon-color",
            resizeInfoClass = expanded ? "icon-resize-small" : "icon-resize-full",
            resizeStyleMap = expanded ? { width: '66%' } : { width: '33%' };

            let time =['x'],chartVolume = ['Decision Date'];
            var i = 0;

            if(this.state.barchartX != null){
            for(i = 0;i < this.state.barchartX.length;i++){
                time.push(this.state.barchartX[i]);
                chartVolume.push(this.state.barchartY[i])
            }
          }
               let barData = [
                   time,
                   chartVolume
               ]


                    return (
                        <div id="legend-div" className="legend-color"  style={resizeStyleMap}>
                            <div className="si-title-wrapper si-title-color">
                                <span className="si-title">Postgres Query</span>
                                <span id="siteinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeRightMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                                <span id="siteinfo-resize" className={resizeClass} onClick={this._toggleRightPanelExpansion.bind(this)}><i className={resizeInfoClass}></i></span>
                            </div>

                            <button onClick={this.toggleLayer.bind(this)}>Show</button>
                              <button onClick={this.query.bind(this)}>query</button>

                                {<BarChart title={"Planning Decisions"} x='x' data = {barData} orientation={ChartOrientation.Vertical} />}
                    </div>
                   );
            }
      }
export default PostgresQuery;
