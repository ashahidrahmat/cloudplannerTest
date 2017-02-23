/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : clustermanger.js
 * DESCRIPTION     : 
 * AUTHOR          : xingyu
 * DATE            : Feb 8, 2017
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

import jquery from 'jquery';
import ClusterStore from 'stores/clusterstore';
import fancybox from 'fancybox';
import CustomPhotoMarkerCluster from 'libs/leafletphoto/leaflet.markercluster-src.js'
 
export default class ClusterManager {

    //set default properties
    constructor(map) {
        this.map = map;
        this.clusterLayer = null; 
        this.imageData = [];
        this.photoList=[];
        this.markerClusterGroup = new L.MarkerClusterGroup({
            enablePhotoClusterMode: true,
            spiderfyDistanceMultiplier: 1.2,
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            // this value should be 2x width of the .photo-cluster class
            maxClusterRadius: 140
        });
        this.customDataType = "";
        this.toggleMarker = null;
        this.tempMarker = null;
        this.triggerOnce=true;
    }

    initialize(){

        fancybox(jquery);
        //this.map.options.maxZoom = 18;
    }
    
    clearGeoPhotoLayer(){
         
        this.markerClusterGroup.clearLayers();
        this.photoList=[];
         
    }

    onClick(e) { 
        
        var scope = this;
   
        jquery(".fullscreen-photo").fancybox({
            autoSize	: true,
            fitToView	: true,
            openEffect	: 'none',
            closeEffect	: 'none',
            afterClose: function() { 
                jquery(".fullscreen-photo").css('display', 'block'); 
            } 
  
        }); 
    }

    //pass in custom data here
    //param: uat/custom
    showGeoPhotoLayer(customImageData,dataType){
        
        //set map max zoom
        this.map.options.maxZoom = 18

        //date type
        //uat or custom
        this.customDataType = dataType;

        var scope = this;

           
        if(this.customDataType == "uat"){
             
            //clear list and group
            this.markerClusterGroup.clearLayers();
            this.photoList=[];

            //retrieve image value from clusterstore
            this.imageData = customImageData;
              
            for (var i = 0; i < scope.imageData .length; i++) {
  
                var marker = L.marker([scope.imageData[i].LatLng.lat,scope.imageData[i].LatLng.lng], {photo_url: scope.imageData[i].Url});
                var title = scope.imageData[i].DateTime;

               
                marker.bindPopup(L.Util.template('<div width="auto" href="'+scope.imageData[i].Url+'" class="fullscreen-photo" title="'+title +'"><span class="photo-cluster-zoom"><a><img src="' + scope.imageData[i].Url + '" /></a></span>' + title + ' </div>', this), {
                    className: 'leaflet-popup-photo',
                    minWidth: 400
                }).openPopup();
                
                marker.on('click', scope.onClick);
                
                this.markerClusterGroup.addLayer(marker); 
                this.photoList.push(marker);
                  
            }
            this.map.addLayer(this.markerClusterGroup);
             

        }else if(this.customDataType == "custom"){
              
            var scope = this;
             
            //when islandwide photo is on
             
            if(ClusterStore.getClusterStatus() == true){ 

                //abstract data id
                if(this.photoList !=null){

                    this.photoList.map((item, j) => { 
                      
                        //if found remove marker from list
                        if(item.options.photo_url == customImageData[0].Url){
                         
                            //popup marker
                            var m = scope.photoList[j];

                            //scope.map.panTo([m.getLatLng().lat,m.getLatLng().lng+0.0010])

                            //scope._map.flyTo(e.latlng)

                            scope.markerClusterGroup.zoomToShowLayer(m, function() {
                            
                               

                                m.openPopup();
                                jquery(".fullscreen-photo").fancybox({
                                    autoSize	: true,
                                    fitToView	: true,
                                    openEffect	: 'none',
                                    closeEffect	: 'none',
                                    afterClose: function() {
                                        jquery(".fullscreen-photo").css('display', 'block');
                                    }
  
                                });


                                var southWest = new L.LatLng(m.getLatLng().lat,m.getLatLng().lng+0.002),
                                      northEast = new L.LatLng(m.getLatLng().lat,m.getLatLng().lng),
                                      bounds = new L.LatLngBounds(southWest, northEast);

                                scope.map.fitBounds(bounds, {padding: [20, 20],animate:true,duration:0.25,easeLinearity:0.25})

                                

                            });

                        }
                    
                    }); 
                }
            }else{
                //when islandwide photo is off
        
                //clear list and group
                this.markerClusterGroup.clearLayers();
                this.photoList=[];

                //add to temp
                //this.tempMarker
                var marker = L.marker([customImageData[0].LatLng.lat,customImageData[0].LatLng.lng], {photo_url: customImageData[0].Url});
                var title = customImageData[0].DateTime;
                
                marker.bindPopup(L.Util.template('<div width="auto" href="'+customImageData[0].Url+'" class="fullscreen-photo" title="'+title +'"><span class="photo-cluster-zoom"><a><img src="' + customImageData[0].Url + '" /></a></span>' + title + ' </div>', this), {
                    className: 'leaflet-popup-photo',
                    minWidth: 400
                }).openPopup();
                     
                marker.on('click', scope.onClick);

                this.markerClusterGroup.addLayer(marker);
                this.photoList.push(marker);

                this.map.addLayer(this.markerClusterGroup);

                //open individual popup
                var m = scope.photoList[0];
                         
                scope.markerClusterGroup.zoomToShowLayer(m, function() {
                    //console.log(m.getLatLng())
                    m.openPopup();
               
                    jquery(".fullscreen-photo").fancybox({
                        autoSize	: true,
                        fitToView	: true,
                        openEffect	: 'none',
                        closeEffect	: 'none',
                        afterClose: function() {
                            jquery(".fullscreen-photo").css('display', 'block');
                        } 
                    });


                    var southWest = new L.LatLng(m.getLatLng().lat,m.getLatLng().lng+0.002),
                        northEast = new L.LatLng(m.getLatLng().lat,m.getLatLng().lng),
                        bounds = new L.LatLngBounds(southWest, northEast);

                    scope.map.fitBounds(bounds, {padding: [20, 20],animate:true,duration:0.25,easeLinearity:0.25})
                
                    //scope._map.flyTo([m.]);

                }); 

            }
             
        } 
         
    } 
}
 