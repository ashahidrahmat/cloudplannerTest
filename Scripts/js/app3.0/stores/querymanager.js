/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : querymanager.js
 * DESCRIPTION     :
 * AUTHOR          : xingyu
 * DATE            : April 4, 2017
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


import $ from 'jquery';
import Util from 'utils';

export default class QueryManager {

    //set default properties
    constructor(map) {
        this.map = map;
        this.geojsonfeature = null;
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
  		info.update(layer.feature.properties);
  	}

  	 resetHighlight(e) {
  		geojson.resetStyle(e.target);
  		info.update();
  	}

  	 zoomToFeature(e) {
  		map.fitBounds(e.target.getBounds());
  	}

  	 onEachFeature(feature, layer) {
  		layer.on({
  			mouseover: this.highlightFeature,
  			mouseout: this.resetHighlight,
  			click: this.zoomToFeature
  		});
  	}

    showLayer(customMap){
      //console.log("showlayer");
      var scope = this;
      $.ajax({
          dataType: 'json',
          type:'GET',
          url:'https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1/pgquery',
          success:function(data) {


              customMap.addLayer(new L.geoJson(data,{style:scope.style,onEachFeature: scope.onEachFeature}));



                  //this.geojsonfeature =  new L.geoJson(data,{style:scope.style,onEachFeature: scope.onEachFeature})


              //this.geojsonfeature.addTo(customMap);

          },
          error: function (request, status, error) {
              console.log(error)
          }
      });

    }

    initialize(){

      //  fancybox(jquery);
        //this.map.options.maxZoom = 18;
    }
}
