/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : rangeslider.jsx
 * DESCRIPTION     : Reactjs component for jQrangeslider
 * AUTHOR          : xingyu
 * DATE            : Mar 30, 2017
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
import ReactDOM from 'react-dom';
import Jqueryui from 'jquery-ui';
import Rangeslider from 'libs/jQRangeSlider/jQAllRangeSliders-min';
import $ from 'jquery';
import Util from 'utils';
import BarChart from 'components/charts/barchart';
import {ChartColors, ChartOrientation} from 'constants/chartconstants';

class RangeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            _map:Util.getMap(),
            minMax:null,
            geojson: null,
            info:null

        }

    }
    componentDidMount() {


         var scope = this;

         scope.toggleLayer();

         const parent = ReactDOM.findDOMNode(this);

         scope.state.info = L.control({position: 'topleft'});

         scope.state.info.onAdd = function (map) {
     		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
     		this.update();
     		return this._div;
     	};

        // method that we will use to update the control based on feature properties passed
        scope.state.info.update = function (props) {

            this._div.innerHTML = '<h4>Number of Approved Planning Decisions</h4>' +  (props ?
                '<b>Planing Area: ' + props.pln_area_n + '</b><br />' + props.gid + ' applications'
                : 'Hover over a hexagon');
        };

        scope.state.info.addTo(this.state._map);

         //initial jslider
         const slider = $(parent).dateRangeSlider({
          bounds:{
              min: new Date(2013, 1, 1),
              max: new Date(2017, 2, 28)
          },
          defaultValues:{
              min: new Date(2017, 1, 1),
              max: new Date(2017, 2, 28)
          }
          });

         //save initial jslider values
         var dvalues = $(parent).dateRangeSlider("values");
         var s = dvalues.min.toISOString();
         var e = dvalues.max.toISOString();

         //save initial values
         this.setState({
             minMax: {"s":s,"e":e}
         })


         //listen to maps moveend movement, need turn on postgres panel to start listening
         scope.state._map.on('moveend', function(x) {
     	       console.log("map moved");
               scope.loadData()
     	});

       // Preferred method
       $(parent).on("valuesChanged", function(e, data){
         //console.log("Something moved. min: " + data.values.min + " max: " + data.values.max);

         var s = data.values.min.toISOString();
 	   	 var e = data.values.max.toISOString();

         //save to state
         scope.setState({
             minMax: {"s":s,"e":e}
         })

         scope.loadData()
         //this.loadData(s,e).bind(this);
       });

     }

     componentWillUnmount() {
       //const parent = ReactDOM.findDOMNode(this);
       //$(parent).dateRangeSlider("destroy");
   }

   loadData(){
       var xmin = this.state._map.getBounds().getSouthWest().lng;
       var ymin = this.state._map.getBounds().getSouthWest().lat;
       var xmax = this.state._map.getBounds().getNorthEast().lng;
       var ymax = this.state._map.getBounds().getNorthEast().lat;

       var bounds = "ST_MakeEnvelope(" + xmin + ", " + ymin + ", " + xmax + ", " + ymax + ", 4326)";

       //console.log(this.state.minMax)
   };

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
              mouseover: this.highlightFeature.bind(this),
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
   		this.state.info.update(layer.feature.properties);
   	}

   	 resetHighlight(e) {
            if(this.state.geojson){
                this.state.geojson.resetStyle(e.target);
            }

   		this.state.info.update();
   	}

   	 zoomToFeature(e) {
   		this._map.fitBounds(e.target.getBounds());
   	}


    render() {

        let time =['x'],chartVolume = ['Time (24h)'];

            time.push("12");
            chartVolume.push("1")



           let barData = [
               time,
               chartVolume
           ]

        return (
            <div>

                        <div id="jrangeslider"></div>
                    {<BarChart title={"Planning Decisions"} x='x' data = {barData} orientation={ChartOrientation.Vertical} />}




            </div>
        );
    }
}

export default RangeSlider;
