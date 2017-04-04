/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : socialmedia-analysis.jsx
 * DESCRIPTION     : component for social media eg: foursquare
 * AUTHOR          : xingyu
 * DATE            : Jan 18, 2017
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
import $ from 'jquery';
import Ajax from 'wrapper/ajax';
import EplActionCreator from 'actions/eplactioncreator';
import PieChart from 'components/charts/piechart';
import BarChart from 'components/charts/barchart';
import {ChartColors, ChartOrientation} from 'constants/chartconstants';
import HeatMap from 'leaflet-heatmap'
import Util from '\\util';
import SentimentAnalysis from 'sentiment-analysis';
import MapStore from 'stores/mapstore';
import Underscore from 'underscore';
import Modal from 'components/modal';
import DLayout from 'libs/leafletphoto/d3-layout'
import Excanvas from 'libs/leafletphoto/excanvas'
class SocialAnalysis extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            map:Util.getMap(),
            heatMapData:[],
            expanded: false,
            heatmapLayer:null,
            toggleHeatMap:true,
            sortedGroup:[],
            piechartData:[],
            barchartData:[],
            timing:null,
            volume:null,
            sentences:["Dinosaurs are awesome!",
                "Everything works well",
                "Singapore is gloomy today because of all the smog",
                "I am so grateful for all the presents, thank you!",
                "Really enjoying the warm weather",
                "It was a catastrophic disaster",
                "Well,what a bad day.",
                "It's my birthday!",
                "Feeling excited",
                "It started to rain again.",
                "Going for holiday"
                
            ],
            sentimentValue:[]

        }; 
    }

    componentDidMount() {

        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content);

        Ajax.call({ 
            dataType: 'json',
            async: false,
            url:'Scripts/js/app3.0/libs/json/twit.json',
            //url:'/Scripts/js/app3.0/libs/json/poi.json',  
            success: data => {
                //console.log("poi.json working");
                console.log("twit.json working");

                this.loadData(data);
                
                return ;

            },
            error: function (request, status, error) {
                console.log(error)
            }
        });   
    }

    loadData(data){
         
            var temp = [];

            data.map((item,j)=>{
                temp.push(item.location)
            })

            const names = temp;
            //console.log(names)

            const count = names => 
                names.reduce((a, b) => 
                    Object.assign(a, {[b]: (a[b] || 0) + 1}), {})

            const duplicates = dict => 
                Object.keys(dict).filter((a) => dict[a] > 1)

           
            
            let a = count(names);
            
             
            var tempchartdata = [];

            duplicates(count(names)).map((item,j)=>{
              
                if(a[item] > 300){ 
                    tempchartdata.push([item,a[item]])
                }
            })
             

            //start of barchart grouping 
            var tempTime = [];
            var dataType = "hh";
            data.map((item,j)=>{
                tempTime.push(item.hh)
            })

           // this.getGroupData(tempTime,dataType);

            var barChart = this.getGroupData(tempTime,dataType);
            
            
        //sentiment value
            var tempSentiment = [];
             
            this.state.sentences.map((item,j)=>{
                tempSentiment.push(SentimentAnalysis(item))
            })
           
            

            this.setState({ 
                piechartData:tempchartdata,
                barchartData:barChart,
                sentimentValue:tempSentiment
            }) 


    }

    componentWillUnmount() {
        
    }

    closeMenu() {
        EplActionCreator.closeMenu();
    }

    getGroupData(groupDate,dataType){

        var tempchartdata = [];

        const names = groupDate;
        //console.log(names)

        const count = names => 
            names.reduce((a, b) => 
                Object.assign(a, {[b]: (a[b] || 0) + 1}), {})

        const duplicates = dict => 
            Object.keys(dict).filter((a) => dict[a] > 1)

        //console.log(count(names)) // { Mike: 1, Matt: 1, Nancy: 2, Adam: 1, Jenny: 1, Carl: 1 }
        //console.log(duplicates(count(names))) // [ 'Nancy' ]

        let a = count(names);

        duplicates(count(names)).map((item,j)=>{
            //console.log(item)
            // console.log(a[item])

            if(dataType == "hh"){
                //push to bar char 
                tempchartdata.push([item,a[item]]) 
            } 
        })


        if(dataType == "hh"){
            
            
                return tempchartdata
             
        } 
       
    }

    toggleHeatMap(){

        if(this.state.toggleHeatMap == true){ 

            //sorting
            //sorting

             /*
            var uniqueNames = [];
            for(var i = 0; i< this.state.heatMapData.length; i++){    
                if(uniqueNames.indexOf(this.state.heatMapData[i].location) === -1){
                    uniqueNames.push(this.state.heatMapData[i].location);   
                }        
            }

            for(i = 0; i< uniqueNames.length; i++){    
                console.log(uniqueNames[i]);      
            }
            
            */

            	/*
            var temp = [];

            this.state.heatMapData.map((item,j)=>{
                temp.push(item.location)
            })

            const names = temp;
            //console.log(names)

            const count = names => 
              names.reduce((a, b) => 
                Object.assign(a, {[b]: (a[b] || 0) + 1}), {})

            const duplicates = dict => 
              Object.keys(dict).filter((a) => dict[a] > 1)

            //console.log(count(names)) // { Mike: 1, Matt: 1, Nancy: 2, Adam: 1, Jenny: 1, Carl: 1 }
            //console.log(duplicates(count(names))) // [ 'Nancy' ]
            
            let a = count(names);
            
            //[["head",2],["leg",4]]
            
            var tempchartdata = [];

            duplicates(count(names)).map((item,j)=>{
                //console.log(item)
               // console.log(a[item])

                if(a[item] > 300){ 
                tempchartdata.push([item,a[item]])
                }
            })

            //end of sorting pie chart grouping


            //start of barchart grouping 
            var tempTime = [];
            var dataType = "hh";
            this.state.heatMapData.map((item,j)=>{
                tempTime.push(item.hh)
            })

            this.getGroupData(tempTime,dataType);

            */

            
            var tempData = [];
                 
            this.state.heatMapData.map((item,j)=>{
                tempData.push({
                    lat:item.lat,
                    lng:item.lng,
                    count:1
                    
                })
            })
                 
                  
            var testData = {
                max: 8,
                data: tempData
            };

            var cfg = {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                // if scaleRadius is false it will be the constant radius used in pixels
                "radius": 15,
                "maxOpacity": .8, 
                // scales the radius based on map zoom
                "scaleRadius": false, 
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries 
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": true,
                // which field name in your data represents the latitude - default "lat"
                latField: 'lat',
                // which field name in your data represents the longitude - default "lng"
                lngField: 'lng',
                // which field name in your data represents the data value - default "value"
                //valueField: 'location'
            };
       
            var heatmapLayer = new HeatMap(cfg);

            this.setState({
                heatmapLayer:heatmapLayer,
                toggleHeatMap:false
                 
            })

            this.state.map.addLayer(heatmapLayer);
            heatmapLayer.setData(testData);

        }else{
            this.state.heatmapLayer.onRemove(this.state.map);

            this.setState({ 
                toggleHeatMap:true 
            })

           // this.state.map.removeLayer()

        }

    }

    toggleClusterMap(){

        var markers = L.markerClusterGroup();

        //online random phrase api
        var randomQuote; 
 

        for(var i=0;i<this.state.heatMapData.length;i++){

            
            $.ajax({ 
                dataType: 'json',
                async: false,
                url:'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',  
                success:function(data) {

                    randomQuote = data[0].content;

                },
                error: function (request, status, error) {
                    console.log(error)
                }
            });


            markers.addLayer(L.marker([this.state.heatMapData[i].lat,this.state.heatMapData[i].lng]).bindPopup('<b>'+randomQuote+'</b>').openPopup()); 
        } 

        

        this.state.map.addLayer(markers);

    }

    toggleSocialPanel(){
        this.setState({
            expanded: !this.state.expanded
        });
    }



    getTimingGroup(timing,dataType){
    
        //["7:30am","7:40am"]
        var temp = [];

        if(timing !=null){ 

        for(var i=0;i<timing.length;i++){
            temp.push(timing[i]["0"])
            //console.log(timing[i]["0"])

            if(dataType == "chartvolume"){
                temp.push(timing[i]["1"])
                //console.log(timing[i]["1"])
            }else{
                temp.push(timing[i]["0"])
            }
        }
        } 

        return temp; 
    }

    toggleSummary(){

        //EplActionCreator.showModal(<SocialMediaSummary/>);
        // <button type="button" style={{height:'60px',margin:'5px'}} onClick={this.toggleSummary.bind(this)}>Show Summary</button>
    }

    getCloudWord(){

        

            
        /*
        //use sentiment as a guide

        var temp = [];
        var dataType = "hh";
        data.map((item,j)=>{
            temp.push(item.hh)
        })

        // this.getGroupData(tempTime,dataType);

        var barChart = this.getGroupData(tempTime,dataType);

        return tempchartdata;
        */
    }

    toggleSample(){

        var markers = L.markerClusterGroup();

        var point; 
     
            $.ajax({ 
                dataType: 'json',
                async: false,
                url:'http://onemilliontweetmap.com/subscribe',  
                success:function(data) {
                    console.log(data)

                    //point = data[0].content;

                },
                error: function (request, status, error) {
                    console.log(error)
                }
            });


    // markers.addLayer(L.marker([this.state.heatMapData[i].lat,this.state.heatMapData[i].lng]).bindPopup('<b>'+randomQuote+'</b>').openPopup()); 
        
       // this.state.map.addLayer(markers);

    }

   
    render() {

        //inline css
        var divStyle = {
            marginBottom: '20px',
            textAlign:'center'
        };
        var lableStyle = {
            marginTop: '20px'
        };
        let bufferOptionClass = this.state.bufferOptionExpanded ? 'cate-up-icon' : 'cate-minus-icon',
            bufferOptionStyle = this.state.bufferOptionExpanded ? {display: 'block'} : {display: 'none'};
        let expanded = this.state.expanded,
            resizeClass = expanded ? "reduce-icon expand-icon-color" : "expand-icon expand-icon-color",
            resizeInfoClass = expanded ? "icon-resize-small" : "icon-resize-full",
            resizeStyleMap = expanded ? { width: '66%' } : { width: '33%' };
        
        //buffer range of 300m

        var currentDiameter;

        if(Util.getIdentifyPoint() != null){ 

            console.log("buffer at social media layer")

        var tempLatLng = {
            lat:Util.getIdentifyPoint().latLng.lat,
            lng:Util.getIdentifyPoint().latLng.lng
        }


        MapStore.removeCircles();


        //use circle marker as a reference
        currentDiameter = MapStore.createCircle([tempLatLng.lat,tempLatLng.lng], 100,{fill: true,
            color: 'red',
            opacity: 1}); 
        
        

        //get bound
        var bounding = currentDiameter.getBounds();

        }



        //pie chart
        let pieTitle = 'Breakdown of CheckedIn Location '
        var pieData = this.state.piechartData

       // console.log(pieData)
        // timing:this.getTimingGroup(barChart,"charttiming"),
       // volume: this.getTimingGroup(barChart,"chartvolume")
        //console.log(this.state.barchartData)

        //bar chart
        let timings = this.getTimingGroup(this.state.barchartData,"charttiming");
        let volume =  this.getTimingGroup(this.state.barchartData,"chartvolume");

        
         

        let time =['x'],chartVolume = ['Time (24h)'];
        for (var i = 0; i < timings.length; i++){
            time.push(timings[i]);
            chartVolume.push(volume[i])
        }
     
        let barData = [
            time,
            chartVolume
        ]
            

        if(!$('#myCanvas').tagcanvas({
            textColour: '#ff0000',
            outlineColour: '#ff00ff',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05
        },'tags')) {
            // something went wrong, hide the canvas container
            $('#myCanvasContainer').hide();
        }

        let cloudWord = this.getCloudWord();
 
          
        return (
               <div id="bufferinfo" className="bufferinfo-color" style={resizeStyleMap}  >
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Social Media Analysis</span>
                      <span id="bufferinfo-resize" className={resizeClass} onClick={this.toggleSocialPanel.bind(this)}>
                        <i className={resizeInfoClass}></i>
                    </span>
                    <span id="legend-close-btn" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div className="legend-wrapper" ref="cateContent">
                    <div id="mapLegend-content" title="Map Legend">
                        <div id="ll-content">
                            <div id="ll-content-select">
                               
                               
                                <button type="button" style={{height:'60px',margin:'5px'}} onClick={this.toggleHeatMap.bind(this)}>Show Heat Map</button>
                                <button type="button" style={{height:'60px',margin:'5px'}} onClick={this.toggleClusterMap.bind(this)}>Show Cluster Map</button>
                                <button type="button" style={{height:'60px',margin:'5px'}} onClick={this.toggleSample.bind(this)}>Sample</button>
                                

                            {<PieChart title={pieTitle}
                              data={pieData} />}
                            {<BarChart title={"Breakdown of CheckedIns hourly"} x='x' data = {barData} orientation={ChartOrientation.Vertical} />}
                             

                            <div style={{fontSize:'35px',textAlign:'center'}}>Summary</div>

                                 

                          <div id="myCanvasContainer">
                                  <canvas width="500" height="300" id="myCanvas">
                                    <p>Anything in here will be replaced on browsers that support the canvas element</p>
                                  </canvas>
                                </div>
                                <div id="tags">
                                  <ul>
                                    <li><a>Bad day</a></li>
                                     <li><a>Birthday</a></li>
                                      <li><a>Holiday</a></li>
                                       <li><a>Excited</a></li>
                                        <li><a>Raining</a></li>
                                        <li><a>Bad day</a></li>
                                     <li><a>Birthday</a></li>
                                      <li><a>Greatful</a></li>
                                       <li><a>Thank You</a></li>
                                        <li><a>Raining</a></li>
                                         
                                  </ul>
                                </div>

                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
         )
                            }

                            }

export default SocialAnalysis;
