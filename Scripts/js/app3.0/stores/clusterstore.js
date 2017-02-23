/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : clusterstore.js
 * DESCRIPTION     : static data file for eplanner clustering
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

import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import MapStore from 'stores/mapstore';
import DrawConstants, {DrawColors} from 'constants/drawconstants';
import EplActionCreator from 'actions/eplactioncreator';
import Lphoto from 'libs/leafletphoto/Leaflet.Photo.js';
import L from 'leaflet';
import EXIF from 'exif-js'; 
import Cloudinaryupload from 'cloudinary-jquery-file-upload';
import $ from 'jquery';
import Ajax from 'wrapper/ajax';

class ClusterStore extends BaseStore {
     
    constructor() {
        super();
        this.showCluster = false;
        this._clusterManager = null;
        this.changeClassName = '';
        this.imageFiles = [];
        this.nearbyImageFiles = [];
        this.nearbyJsonData = [];
        this.uatJsonData = [];
        this.customImageData = [];
        this.clearPhotoTempMarkerStatus = false;
        

        //start fetching from UAT using ajax
        //"~/Scripts/js/app3.0/libs/turf/turf.min.js",

        Ajax.call({ 
            dataType: 'json',
            async: true,
            url:'/Scripts/js/app3.0/libs/json/UATImages.json',  
            success: jsonData => {
               
                this.uatJsonData = jsonData.UATImages;
        
                return ;

            },
            error: function (request, status, error) {
                console.log(error)
            }
        });  
    } 

    

    getGeoTagPhotoCount(){
        return this.uatJsonData.length
    }


    /*
    Generate Image Data From UAT Step 1
    */
    getImageDataFromUAT(){
        console.log("fetch image data from uat...");

        //process image data
        this.processImageDataFromUAT();

    }

    /*
   Generate Image Data From UAT Step 2
   */
    processImageDataFromUAT(){ 
        var scope = this;

        //range from 0000 - 1000
        //From: DJI_0000m.jpg to DJI_1000m.jpg

        for (var i = 0; i <=1000; i++) {

            //format number first
            var numberFormat = "";

            if(i<10){
                numberFormat = "000"
            }else if(i>=10 && i<100){
                numberFormat = "00"
            }else if(i>=100 && i<1000){
                numberFormat = "0"
            }else if(i == 1000){
                numberFormat = ""
            }


            var url = '';

            var newImageDataRequest = $.ajax({
                url: url,
                async :true,
                type:'GET',
                dataType : "jsnop",
                beforeSend: function(jqXHR, settings) {

                    //store original image url because is in asyn mode
                    jqXHR.url = settings.url;
                }
                 
            }); 
            newImageDataRequest.fail(function(jqXHR, textStatus)
            {
                if (jqXHR.status === 0)
                {
                    //console.log('Not connect.n Verify Network.');
                }
                else if (jqXHR.status == 404)
                {
                    //console.log('Image url not found. [404]');
                }
                else if (jqXHR.status == 500)
                {
                    //console.log('Internal Server Error [500].');
                }else if(jqXHR.status == 200){
                    //console.log('Valid image url');
                     
                    //since is aysn mode, call method here,passed in valid image url
                    scope.getImageMetaDataFromUAT(jqXHR.url);

                }
            });    
        }  
    }


    /*
   Generate Image Data From UAT Step 3
   */
    getImageMetaDataFromUAT(uatImageUrl){
        var scope = this;


        var blob = null;
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", uatImageUrl); 
        xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
        xhr.onload = function() 
        {
            blob = xhr.response;//xhr.response is now a blob object
             
            //extract exif info from blob file
            EXIF.getData(blob, function() {
                
                //var allMetaData = EXIF.getAllTags(this); 

                var lat = EXIF.getTag(this, "GPSLatitude");
                var lng = EXIF.getTag(this, "GPSLongitude");
                var fileName = EXIF.getTag(this, "GPSLongitude");
                var dateTime = EXIF.getTag(this, "DateTime");

                var d = (lat[0].numerator/lat[0].denominator);
                var min = (lat[1].numerator/lat[1].denominator);
                var sec = (lat[2].numerator/lat[2].denominator);

                var latValue = (d+((min/60)+(sec/3600)));

                //gps lng
                var d1 = (lng[0].numerator/lng[0].denominator);
                var min1 = (lng[1].numerator/lng[1].denominator);
                var sec1 = (lng[2].numerator/lng[2].denominator);

                var lngValue = (d1+((min1/60)+(sec1/3600)));

                var allMetaData = EXIF.getAllTags(this);

                var make = EXIF.getTag(this, "Make");
                var model = EXIF.getTag(this, "Model");
                var dateTimeOriginal = "";
                var datetimeDigitized = "";

                var tempMetaData = [];
                tempMetaData.push(allMetaData);
                
                //before push format the value properly
                tempMetaData[0].Make = "DJI";
                tempMetaData[0].Model = "FC300X";
                tempMetaData[0].DateTimeOriginal = "";
                tempMetaData[0].DateTimeDigitized = "";
                tempMetaData[0].undefined = "";
                tempMetaData[0]["LatLng"] = {lat:latValue,lng:lngValue};
                tempMetaData[0]["Url"] = uatImageUrl;
                
                //copy and paste to UATImage.json file
                console.log(JSON.stringify(tempMetaData[0], null, 2));

                tempMetaData = [];
                 
            })
        }
        xhr.send(); 
    }


 

    //customize function
    //@params: accept [] type
    
    fetchData(data){
        var scope = this;
       
        //cloudinary config
        $.cloudinary.config({ cloud_name: 'demophotoupload', api_key: '289529251592669'})
            
        //cloudinary return json format
        //extra fetch params of: 
        //tags
        // image_metadata: lat|lng
        var fetchUrl = $.cloudinary.image(data[0].jsonType, {type: "list",image_metadata: true ,tags :true })

        //fetch data from cloudinary
        $.ajax({ 
            dataType: 'json',
            url:fetchUrl[0].src,  
            success:function(data) {

                var tempData = [];
                
                //assign
                data.resources.map((item, j) => { 
                     
                    tempData.push({
                        id:item.public_id,
                        format:item.format,
                        lat:item.context.custom.lat,
                        lng:item.context.custom.lng 
                    });    
                });  
                 
                scope.updateData(tempData,data.returnJsonType);

            },
            error: function (request, status, error) {
                console.log(error)
            }
        });

    } 

    //@param: type of json file

    getCloudUrl(jsonType){ 
        //cloudinary config
        $.cloudinary.config({ cloud_name: 'demophotoupload', api_key: '289529251592669'})
            
        //cloudinary return json format
        //extra fetch params of: 
        //tags
        // image_metadata: lat|lng
        var fetchUrl = $.cloudinary.image(jsonType, {type: "list",image_metadata: true ,tags :true })

        return fetchUrl[0].src; 
    }
  
    getClusterStatus(){
        return this.showCluster;
    }


    showGeoPhotoQuicklink(){
         
        this._clusterManager = MapStore.clusterManager;
        var clusterManager = this._clusterManager;
         
        if(clusterManager && !this.showCluster){
            
            this.showCluster = true;
            this.changeClassName = 'off';
        
            //fetch image data from UAT
            //uncomment to generate image json
            //this.getImageDataFromUAT();
            //uat
            clusterManager.showGeoPhotoLayer(this.uatJsonData,"uat");
        }else{
            
            this.showCluster = false;
            clusterManager.clearGeoPhotoLayer();
            
        } 
    }
   
    clearGeoPhotoLayer(){
       
        //reset cluster image icon ui
        if(this.showCluster){
            MapStore.clusterManager.clearGeoPhotoLayer();
            this.showCluster = false; 
        }  

        if(this.clearPhotoTempMarkerStatus == true){
             
            MapStore.clusterManager.clearGeoPhotoLayer();
            this.clearPhotoTempMarkerStatus = false; 
        }
        
        
    }
  
    getClassName(){
        return this.changeClassName;
    }

    getUATImageData(){

        return this.uatJsonData;
    }


    getImageData(){

        //console.log(this.imageFiles);

        return this.imageFiles;
    }

    getNearbyImageData(){
        return this.nearbyImageFiles;
    }

    addImageFile(file){
        
        var scope = this;
        //use exif extra file metadata and set to state
        EXIF.getData(file, function() {
            var allMetaData = EXIF.getAllTags(this);
           
            console.log(allMetaData);

            //gps lat
            var d = (allMetaData.GPSLatitude[0].numerator/allMetaData.GPSLatitude[0].denominator);
            var min = (allMetaData.GPSLatitude[1].numerator/allMetaData.GPSLatitude[1].denominator);
            var sec = (allMetaData.GPSLatitude[2].numerator/allMetaData.GPSLatitude[2].denominator);

            var lat = (d+((min/60)+(sec/3600)));

            //gps lng
            var d1 = (allMetaData.GPSLongitude[0].numerator/allMetaData.GPSLongitude[0].denominator);
            var min1 = (allMetaData.GPSLongitude[1].numerator/allMetaData.GPSLongitude[1].denominator);
            var sec1 = (allMetaData.GPSLongitude[2].numerator/allMetaData.GPSLongitude[2].denominator);

            var lng = (d1+((min1/60)+(sec1/3600)));

            // console.log("gps lat: "+(d+((min/60)+(sec/3600))));
            // console.log("gps lng: "+(d1+((min1/60)+(sec1/3600))));

            scope.imageFiles.push({
                name:file.name,
                lat:lat,
                lng:lng,
                DateTime:allMetaData.DateTime

            }); 
        });  
    }

    updateNearbyData(nearbyJsonData){
        
        this.nearbyJsonData = nearbyJsonData;
    }

    getNearbyJsonData(){
        return this.nearbyJsonData;
    }

    customGeoPhotoData(customData){
         
        //update clustermanager
        MapStore.clusterManager.showGeoPhotoLayer(customData,"custom");

    }

    clearPhotoTempMarker(clearData){
         
        //set value
        this.clearPhotoTempMarkerStatus = clearData;
        this.clearGeoPhotoLayer();
    }


}

var instance = new ClusterStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
    
        case EplConstants.ToggleGeoPhotoQuicklink:
            instance.showGeoPhotoQuicklink();
            instance.emitChanges();
            break;

        case EplConstants.AddImageFile:
            instance.addImageFile(action.file);
            instance.emitChanges();
            break; 

        case EplConstants.UpdateNearbyJsonData: 
            instance.updateNearbyData(action.updateData); 
            instance.emitChanges();
            break;

        case EplConstants.CustomGeoPhotoData: 
            instance.customGeoPhotoData(action.customData); 
            instance.emitChanges();
            break;
        case EplConstants.ClearPhotoTempMarker: 
            instance.clearPhotoTempMarker(action.customData); 
            instance.emitChanges();
            break;
            
        default:
    }
});

export default instance;