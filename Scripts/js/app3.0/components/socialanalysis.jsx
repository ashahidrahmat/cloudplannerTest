/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : socialmediaanalysis.jsx
 * DESCRIPTION     : Social media layer right panel
 * AUTHOR          : Thomas Lee
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
"use strict";

import React from 'react';
import UiStore from 'stores/uistore';
import MapStore from 'stores/mapstore';
import Map3DStore from 'stores/3dmapstore';
import IdentifyDisplay from 'components/identifydisplay';
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';
import Util from 'utils';
import GeoPhotoDiv from 'components/geophoto/geophotodiv'
import ClusterStore from 'stores/clusterstore';
import L from 'leaflet';
import Ajax from 'wrapper/ajax';
import $ from 'jquery';
import PieChart from 'components/charts/piechart';
import BarChart from 'components/charts/barchart';
import * as d3 from 'd3';
import { ChartColors, ChartOrientation } from 'constants/chartconstants';


class socialmediaanalysis extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            _map: Util.getMap(),
            uiState: UiStore.getUiState(),
            showStatus: ClusterStore.getClusterStatus(),
            nearbyJsonData: ClusterStore.getNearbyJsonData(),
            clusterLayer: null,
            tempMarker: null,
            geojsonfeature: null,
            piechartData: [],
            barchartData: []
        };
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
    }

    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
        ClusterStore.removeChangeListener(this.showClusterStatus);
        UiStore.removeChangeListener(this._onUiChange);

    }

    showClusterStatus() {
        this.setState({
            showStatus: ClusterStore.getClusterStatus()
        });
    }



    _onChange() {
        this.setState({
            nearbyJsonData: ClusterStore.getNearbyJsonData()
        });
    }

    _onUiChange() {
        this.setState({
            uiState: UiStore.getUiState()
        });
    }

    closeRightMenu() {
        EplActionCreator.clearHighlights();
        EplActionCreator.closeRightPanel();
    }



    // *** Making Twitter Ajax Calls ***//
    //
    //Loading all twitter data from json

    loadall() {
        $.ajax({
            //Loading Twitter json call
            dataType: 'json',
            async: false,
            url: '/Scripts/js/app3.0/libs/json/5k.json',
            success: data => {
                console.log("Successfully loaded all tweets from json")
                {
                    //Defining makerclusters to plot markers in
                    var markerClusters = L.markerClusterGroup();
                    for (var i = 0; i < data.features.length; i++) {
                        var obj = data.features[i];
                        //
                        //Checking Positive tweets
                        if (obj._source.sentiments == "Positive") {
                            var positiveicon = L.icon({
                                iconUrl: 'Content/img/green-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var marker = L.marker([obj._source.coordinates.coordinates[1],
                            obj._source.coordinates.coordinates[0]]
                                , { icon: positiveicon });
                            marker.bindPopup("<br>Text: " + obj._source.text + "</br>"
                                + "<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + "<img src='Content/img/happy.jpg'/>" + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id="
                                + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(marker);
                            this.state._map.addLayer(markerClusters);
                        }
                        //Checking Negative tweets
                        else if (obj._source.sentiments == "Negative") {
                            var negativeicon = L.icon({
                                iconUrl: 'Content/img/pink-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var marker = L.marker([obj._source.coordinates.coordinates[1],
                            obj._source.coordinates.coordinates[0]]
                                , { icon: negativeicon });
                            marker.bindPopup("<br>Text: " + obj._source.text + "</br>"
                                + "<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + "<img src='Content/img/annoyed.jpg'/>" + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id="
                                + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(marker);
                            this.state._map.addLayer(markerClusters);
                        }
                        //Remainder tweets assume neutral
                        else {
                            var neutralicon = L.icon({
                                iconUrl: 'Content/img/blue-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var marker = L.marker([obj._source.coordinates.coordinates[1],
                            obj._source.coordinates.coordinates[0]]
                                , { icon: neutralicon });
                            marker.bindPopup("<br>Text: " + obj._source.text + "</br>"
                                + "<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + "<img src='Content/img/lukewarm.jpg'/>" + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id="
                                + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(marker);
                            this.state._map.addLayer(markerClusters);
                        }
                    }
                }
                return;
            },
            error: function (request, status, error) {
                console.log(error)
            }
        });
    }


    //Loading all Positive function
    loadPositive() {
      // mongoose.connect('mongodb://user:password@54.209.116.114:27017/Tweetdata');
      // var db = mongoose.connection;
      // db.on('error', console.error.bind(console, 'Connection error:'));
      // db.once('open', function(){
      //     console.log('Successfully connected to MongoDB')
      // })

    //     var positiveicon = L.icon({
    //         iconUrl: 'Content/img/green-dot.png',
    //         iconAnchor: [16, 37]
    //     });
    //     $.ajax({
    //         dataType: 'json',
    //         async: false,
    //         url: '/Scripts/js/app3.0/libs/json/5k.json',
    //         success: data => {
    //             console.log("Successfully loaded Positive Tweets");
    //             {
    //                 var markerClusters = L.markerClusterGroup();
    //                 for (var i = 0; i < data.features.length; i++) {
    //                     var obj = data.features[i];
    //                     if (obj._source.sentiments == "Positive") {
    //                         var marker = L.marker([obj._source.coordinates.coordinates[1],
    //                         obj._source.coordinates.coordinates[0]]
    //                             , { icon: positiveicon });
    //                         marker.bindPopup("<br>Text: " + obj._source.text + "</br>"
    //                             + "<br>User: " + obj._source.user.name + "</br>"
    //                             + "<br>Sentiment: " + "<img src='Content/img/happy.jpg'/>" + "</br>"
    //                             + "<br>" + "<a href='https://twitter.com/intent/user?user_id="
    //                             + obj._source.user.id + "'>" + "Go to profile" + "</br>");
    //                         markerClusters.addLayer(marker);
    //                         this.state._map.addLayer(markerClusters);
    //                     }
    //                 }
    //             }
    //             return;
    //         },
    //         error: function (request, status, error) {
    //             console.log(error)
    //         }
    //     });
    // }coun

    // //Loading all Negative Function
    // loadNegative() {
    //     var positiveicon = L.icon({
    //         iconUrl: 'Content/img/pink-dot.png',
    //         iconAnchor: [16, 37]
    //     });
    //     $.ajax({
    //         dataType: 'json',
    //         async: false,
    //         url: '/Scripts/js/app3.0/libs/json/5k.json',
    //         success: data => {
    //             console.log("Successfully loaded Negative Tweets");
    //             {
    //                 var markerClusters = L.markerClusterGroup();
    //                 for (var i = 0; i < data.features.length; i++) {
    //                     var obj = data.features[i];
    //                     if (obj._source.sentiments == "Negative") {
    //                         var marker = L.marker([obj._source.coordinates.coordinates[1],
    //                         obj._source.coordinates.coordinates[0]]
    //                             , { icon: positiveicon });
    //                             console.log(marker);
    //                         marker.bindPopup("<br>Text: " + obj._source.text + "</br>"
    //                             + "<br>User: " + obj._source.user.name + "</br>"
    //                             + "<br>Sentiment: " + "<img src='Content/img/annoyed.jpg'/>" + "</br>"
    //                             + "<br>" + "<a href='https://twitter.com/intent/user?user_id="
    //                             + obj._source.user.id + "'>" + "Go to profile" + "</br>");
    //                         markerClusters.addLayer(marker);
    //                         this.state._map.addLayer(markerClusters);
    //                     }
    //                 }
    //             }
    //             return;
    //         },
    //         error: function (request, status, error) {
    //             console.log(error)
    //         }
    //     });
    //console.log(twitterdata.find());
    }

    //Load Bus Route
    loadbusroute() {
        var positiveicon = L.icon({
            iconUrl: 'Content/img/pink-dot.png',
            iconAnchor: [16, 37]
        })
        $.ajax({
            dataType: 'json',
            async: false,
            url: '/Scripts/js/app3.0/libs/json/routes66.json',
            success:data => {
                console.log("Successfully loaded bus ")
                {
                    var markerClusters = L.markerClusterGroup();
                    for (var i=0; i<data.features.length;i++){
                        var obj = data.features[i];
                        console.log([obj.c1,obj.c2]);
                        var marker = L.marker([obj.c1[1],obj.c2[0]] + {icon:positiveicon});
                         markerClusters.addLayer(marker);
                         this.state._map.addLayer(markerClusters);
                    }
                }
                return;
            },
            error: function (request, status, error) {
                console.log(error)
            }
        });
    }


    //Calculating Sentiment analysis output
    loadCalculations() {
        var positive = 0;
        var neutral = 0;
        var negative = 0;
        var confuse = 0;
        var total = 0;
        $.ajax({
            //
            //Loading Twitter Json Data
            //
            dataType: 'json',
            async: false,
            url: '/Scripts/js/app3.0/libs/json/5k.json',
            success: data => {
                console.log("Successfully loaded Data for calculations")
                {
                    for (var i = 0; i < data.features.length; i++) {
                        var obj = data.features[i];
                        if (obj._source.sentiments == "Positive") {
                            positive++;
                        }
                        else if (obj._source.sentiments == "Negative") {
                            negative++;
                        }
                        else if (obj._source.sentiments == "Neutral") {
                            neutral++;
                        }
                        else if (obj._source.sentiments == "Confused") {
                            confuse++;
                        }
                    }
                    var total = positive + negative + neutral + confuse;
                    positive = positive / total * 100;
                    negative = negative / total * 100;
                    neutral = neutral / total * 100;
                    confuse = confuse / total * 100;
                    var sentimentdata = [];
                    sentimentdata.push([positive, negative, neutral, confuse])
                    this.setState({
                        piechartData: sentimentdata
                    })
                }
                console.log(positive)
                console.log(negative)
                console.log(neutral)
                console.log(confuse)
                var percentage = []
                percentage = [positive, negative, neutral, confuse]
                console.log(percentage)
                return percentage;
            },
            error: function (request, status, error) {
                console.log(error)
            }
        });
    }

    getChartGroup(percentage, dataType) {
        var temp = [];
        if (percentage != null) {
            for (var i = 0; i < percentage.length; i++) {
                temp.push(percentage[i]["0"])
                if (dataType == "chartvolume") {
                    temp.push(percentage[i]["1"])
                }
                else {
                    temp.push(percentage[i]["0"])
                }
            }
        }
        return temp;
    }

    render() {
        //Loading Barchart <button onClick={this.loadNegative.bind(this)}> Negative </button>-->
        let percentage = this.getChartGroup(this.state.barchartData, "chartpercentage");
        let volume = this.getChartGroup(this.state.barchartData, "chartvolume");
        let percent = ['x'], chartVolume = ['Sentiment Analysis'];
        for (var i = 0; i < percentage.length; i++) {
            percent.push(percentage[i]);
            chartVolume.push(volume[i])
        }
        //console.log(Twitterschema);
        let barData = [
            percentage,
            chartVolume
        ]

        return (
            <div id="legend-div" className="legend-color"  >
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Social Analysis</span>
                    <span id="siteinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeRightMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                {<BarChart title={"Breakdown of Sentiment Analysis"} x='x' data={barData} orientation={ChartOrientation.Vertical} />}
                <button onClick={this.loadall.bind(this)}> All </button>
                <button onClick={this.loadPositive.bind(this)}> Positive </button>

                <button onClick={this.loadCalculations.bind(this)}> Generate Report </button>
                <button onClick={this.loadbusroute.bind(this)}> Load Bus 66 </button>
            </div>
        );
    }
}
export default socialmediaanalysis;
