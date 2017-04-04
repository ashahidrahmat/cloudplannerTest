/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : rightpanel.js
 * DESCRIPTION     : Reactjs component for RightPanel
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
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



class RightPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showId: 0,
            expanded: false,
            siteInfo: MapStore.getSiteInfo() || Map3DStore.getSiteInfo(),
            selected: LayerManagerStore.getSelected(),
            identifyLoading: UiStore.getIdentifyLoadingState(),
            nearbyJsonData: ClusterStore.getUATImageData(),
            _map: Util.getMap()
        };

        this._onChange = this._onChange.bind(this);
        this._onUiChange = this._onUiChange.bind(this);
        this._onSiteInfoChange = this._onSiteInfoChange.bind(this);
    }

    componentDidMount() {
        UiStore.addChangeListener(this._onUiChange);
        MapStore.addChangeListener(this._onSiteInfoChange);
        Map3DStore.addChangeListener(this._onSiteInfoChange);
        LayerManagerStore.addChangeListener(this._onChange);
        this.centerMapOnIdentify();
        Util.logPanelView("identify");
    }

    componentWillUnmount() {
        UiStore.removeChangeListener(this._onUiChange);
        MapStore.removeChangeListener(this._onSiteInfoChange);
        Map3DStore.removeChangeListener(this._onSiteInfoChange);
        LayerManagerStore.removeChangeListener(this._onChange);
    }

    closeRightMenu() {
        EplActionCreator.clearHighlights();
        EplActionCreator.closeRightPanel();
    }

    _onChange() {

        this.setState({
            selected: LayerManagerStore.getSelected()
        });

    }

    _onUiChange() {
        this.setState({
            identifyLoading: UiStore.getIdentifyLoadingState()
        });
    }

    _onSiteInfoChange() {
        var siteInfo = {};
        Map3DStore.isInitialized() ? siteInfo = Map3DStore.getSiteInfo() : siteInfo = MapStore.getSiteInfo();

        this.setState({
            siteInfo: siteInfo
        });
    }

    _onRowClick(newId) {
        return (e) => {
            if (this.state.showId === newId) {
                newId = -1;
            }

            this.setState({
                showId: newId
            });
        }
    }

    _toggleRightPanelExpansion(evt) {
        this.setState({
            expanded: !this.state.expanded
        });

    }

    centerMapOnIdentify() {
        let offset = 20;
        if (Util.getIdentifyPoint()) {
            if (Util.getIdentifyPoint().point.x >= this.refs.siteInfoPanel.getBoundingClientRect().left - offset) {
                Util.centerMap();
            }
        }
    }

    //Loading all twitter data
    loadall() {

        //loading json file from Ajax Call
        $.ajax({
            dataType: 'json',
            async: false,
            url: '/Scripts/js/app3.0/libs/json/5k.json',
            //url: 'https://search-es-twitter-demo-4hsdxr4pskvhdotrrb5dphs5ba.us-west-2.es.amazonaws.com/twitter/_search/?size=10&from=9000&pretty',
            success: data => {
                console.log("Successful Ajax call");
                {

                    var markerClusters = L.markerClusterGroup();
                    //console.log(data.hits.hits);
                    //For loop over Array for output
                    //     for (var i = 0; i < data.hits.hits.length; i++) {
                    //         var obj = data.hits.hits[i];
                    //         console.log(obj);
                    //         var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                    //         m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                    //             + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                    //             + "<br>Text: " + obj._source.text + "</br>");
                    //         markerClusters.addLayer(m);
                    //         this.state._map.addLayer(markerClusters);

                    //     }

                    // }

                    for (var i = 0; i < data.features.length; i++) {
                        var obj = data.features[i];
                        if (obj._source.sentiments == "Positive") {
                            var icon6 = L.icon({
                                iconUrl: 'Content/img/green-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
                            this.state._map.addLayer(markerClusters);
                        }
                        else if (obj._source.sentiments == "Negative") {
                            var icon6 = L.icon({
                                iconUrl: 'Content/img/pink-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
                            this.state._map.addLayer(markerClusters);
                        }
                        else {
                            var icon6 = L.icon({
                                iconUrl: 'Content/img/blue-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
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

    //Loading Posstive sentiments
    loadpositive() {
        var icon6 = L.icon({
            iconUrl: 'Content/img/green-dot.png',
            iconAnchor: [16, 37]
        });

        //loading json file from Ajax Call
        $.ajax({
            dataType: 'json',
            async: false,
            url: '/Scripts/js/app3.0/libs/json/5k.json',
            //url: "https://search-es-twitter-demo-4hsdxr4pskvhdotrrb5dphs5ba.us-west-2.es.amazonaws.com/twitter/_search?q=sentiments:Positive&pretty",
            success: data => {
                console.log("Successful Ajax call");
                {
                    var markerClusters = L.markerClusterGroup();
                    //For loop over Array for output
                    // for (var i = 0; i < data.hits.hits.length; i++) {
                    //     var obj = data.hits.hits[i];
                    //     var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                    //     m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                    //         + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                    //         + "<br>Text: " + obj._source.text + "</br>"
                    //         + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                    //     markerClusters.addLayer(m);
                    //     this.state._map.addLayer(markerClusters);
                    // }

                    for (var i = 0; i < data.features.length; i++) {
                        var obj = data.features[i];
                        if (obj._source.sentiments == "Positive") {
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
                            this.state._map.addLayer(markerClusters);
                        }
                    }
                }
                return;
            },
        });
    }

    //Loading Negative sentiments
    loadnegative() {
        var icon6 = L.icon({
            iconUrl: 'Content/img/pink-dot.png',
            iconAnchor: [16, 37]
        });

        //loading json file from Ajax Call
        $.ajax({
            dataType: 'json',
            async: false,
            url: '/Scripts/js/app3.0/libs/json/5k.json',
            //url: 'https://search-es-twitter-demo-4hsdxr4pskvhdotrrb5dphs5ba.us-west-2.es.amazonaws.com/twitter/_search?q=*&pretty',
            success: data => {
                console.log("Successful Ajax call");
                {
                    var markerClusters = L.markerClusterGroup();
                    //For loop over Array for output
                    // for (var i = 0; i < data.hits.hits.length; i++) {
                    //     var obj = data.hits.hits[i];
                    //     var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                    //     m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                    //         + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                    //         + "<br>Text: " + obj._source.text + "</br>"
                    //         + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                    //     if (obj._source.sentiments === "Negative") {
                    //         markerClusters.addLayer(m);
                    //         this.state._map.addLayer(markerClusters);
                    //     }
                    // }

                    for (var i = 0; i < data.features.length; i++) {
                        var obj = data.features[i];
                        if (obj._source.sentiments == "Negative") {
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
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



    //Search text for twitter
    searchtext() {
        var icon6 = L.icon({
            iconUrl: 'Content/img/green-dot.png',
            iconAnchor: [16, 37]
        });
        var search = document.getElementById("twittertext").value;
        console.log(search);

        //loading json file from Ajax Call
        $.ajax({
            dataType: 'json',
            async: false,
            //url: '/Scripts/js/app3.0/libs/json/5k.json',
            url: "https://search-es-twitter-demo-4hsdxr4pskvhdotrrb5dphs5ba.us-west-2.es.amazonaws.com/twitter/_search?q=text:*" + search + "*&pretty",
            success: data => {
                console.log("Successful Text search");
                {
                    var markerClusters = L.markerClusterGroup();
                    //For loop over Array for output
                    for (var i = 0; i < data.hits.hits.length; i++) {
                        var obj = data.hits.hits[i];
                        if (obj._source.sentiments == "Positive") {
                            var icon6 = L.icon({
                                iconUrl: 'Content/img/green-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
                            this.state._map.addLayer(markerClusters);
                        }
                        else if (obj._source.sentiments == "Negative"){
                            var icon6 = L.icon({
                                iconurl: 'Content/img/pink-dot.png',
                                iconAnchor: [16, 37]
                            });
                            var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinatesp[0]],{icon:icon6});
                            m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                + "<br>Text: " + obj._source.text + "</br>"
                                < "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                            markerClusters.addLayer(m);
                            this.state._map.addLayer(markerClusters);
                        }
                        else
                        var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                        m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                            + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                            + "<br>Text: " + obj._source.text + "</br>"
                            + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                        markerClusters.addLayer(m);
                        this.state._map.addLayer(markerClusters);
                    }
                    //Search twitter Hastags
                    $.ajax({
                        dataType: 'json',
                        async: false,
                        //url: '/Scripts/js/app3.0/libs/json/5k.json',
                        url: "https://search-es-twitter-demo-4hsdxr4pskvhdotrrb5dphs5ba.us-west-2.es.amazonaws.com/twitter/_search?q=hashtags:*" + search + "&pretty",
                        success: data => {
                            console.log("Successful Hashtag Search");
                            {
                                var markerClusters = L.markerClusterGroup();
                                //For loop over Array for output
                                for (var i = 0; i < data.hits.hits.length; i++) {
                                    var obj = data.hits.hits[i];
                                    var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                                    m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                                        + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                                        + "<br>Text: " + obj._source.text + "</br>"
                                        + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                                    markerClusters.addLayer(m);
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
                return;
            },
            error: function (request, status, error) {
                console.log(error)
            }
        });
    }

    //Search hashtags for twitter
    searchhash() {
        var icon6 = L.icon({
            iconUrl: 'Content/img/green-dot.png',
            iconAnchor: [16, 37]
        });
        var search = document.getElementById("twitterhastag").value;
        console.log(search);

        //loading json file from Ajax Call
        $.ajax({
            dataType: 'json',
            async: false,
            //url: '/Scripts/js/app3.0/libs/json/5k.json',
            url: "https://search-es-twitter-demo-4hsdxr4pskvhdotrrb5dphs5ba.us-west-2.es.amazonaws.com/twitter/_search?q=hashtags:*" + search + "&pretty",
            success: data => {
                console.log("Successful Ajax call");
                {
                    var markerClusters = L.markerClusterGroup();
                    //For loop over Array for output
                    for (var i = 0; i < data.hits.hits.length; i++) {
                        var obj = data.hits.hits[i];
                        var m = L.marker([obj._source.coordinates.coordinates[1], obj._source.coordinates.coordinates[0]], { icon: icon6 });
                        m.bindPopup("<br>User: " + obj._source.user.name + "</br>"
                            + "<br>Sentiment: " + obj._source.sentiments + "</br>"
                            + "<br>Text: " + obj._source.text + "</br>"
                            + "<br>" + "<a href='https://twitter.com/intent/user?user_id=" + obj._source.user.id + "'>" + "Go to profile" + "</br>");
                        markerClusters.addLayer(m);
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

    render() {
        var infoId = this.state.selected.length,
            showSiteInfo = infoId === this.state.showId,
            expanded = this.state.expanded,
            resizeClass = expanded ? "reduce-icon expand-icon-color" : "expand-icon expand-icon-color",
            resizeInfoClass = expanded ? "icon-resize-small" : "icon-resize-full",
            resizeStyleMap = expanded ? { width: '66%' } : { width: '33%' },
            iconClass = showSiteInfo ? "cate-up-icon" : "cate-minus-icon",
            siteClass = showSiteInfo ? "show" : "hide",
            siteInfo = this.state.siteInfo;


        var featureImgStyle;

        var tempLatLng = {
            lat: Util.getIdentifyPoint().latLng.lat,
            lng: Util.getIdentifyPoint().latLng.lng
        }

        var temp = true, geoTagPhoto = [], photoCount = this.state.nearbyJsonData.length, currentDiameter, bounding;

        MapStore.removeCircles();

        //use circle marker as a reference
        if (!Map3DStore.isInitialized()) {
            currentDiameter = MapStore.createCircle([tempLatLng.lat, tempLatLng.lng], 100, {
                fill: false,
                color: 'none',
                opacity: 0
            });
            bounding = currentDiameter.getBounds();
        }

        //getNearbydata currently get all and check for nearby
        this.state.nearbyJsonData.map((nearbyData, j) => {

            //is it in the buffer range?
            if (bounding && bounding.contains([nearbyData.LatLng.lat, nearbyData.LatLng.lng])) {
                geoTagPhoto.push({ nearbyData })
            }

        });

        if (geoTagPhoto.length > 0) {

            featureImgStyle = {
                display: 'block'
            }

        } else {

            featureImgStyle = {
                display: 'none'
            }
        }


        return (
            <div ref="siteInfoPanel" id="siteinformation" className="siteinformation-color" style={resizeStyleMap}>
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Layer Results {this.state.identifyLoading && this.state.selected.length ? <i className="icon-spin5 animate-spin"></i> : null} </span>
                    <span id="siteinfo-resize" className={resizeClass} onClick={this._toggleRightPanelExpansion.bind(this)}><i className={resizeInfoClass}></i></span>
                    <span id="siteinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeRightMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div id="si-content">
                    <div id="lr-ul">
                        <IdentifyDisplay selected={this.state.selected} showId={this.state.showId} onRowClick={this._onRowClick.bind(this)} />
                    </div>
                    <div>
                        <div id="site-fixed" className="lr-title-wrapper site-fixed-unselected" onClick={this._onRowClick.bind(this)(infoId)}>
                            <span className="lr-title">Site Information</span>
                            <span className={iconClass}></span>
                        </div>
                        <div className={siteClass + " site-fixed-info"}>
                            <table className="site-fixed-info-table" border="1">
                                <tbody>
                                    <tr><td width="116px;">Address</td><td>{siteInfo.address}</td></tr>
                                    <tr><td>DA Polygon ID</td><td>{siteInfo.polygonId}</td></tr>
                                    <tr><td>Planning Area</td><td>{siteInfo.plngArea}</td></tr>
                                    <tr><td>Planning Subzone</td><td>{siteInfo.subZone}</td></tr>
                                    <tr><td>Constituency</td><td>{siteInfo.constituency}</td></tr>
                                    <tr><td>Divisional Ward</td><td>{siteInfo.ward}</td></tr>
                                    <tr><td>MP Name</td><td>{siteInfo.mp}</td></tr>
                                </tbody>
                            </table>
                            <div className="featured-image-wrapper">
                                <div id="two" style={featureImgStyle}><GeoPhotoDiv photoCount={geoTagPhoto.length} geophoto={geoTagPhoto} /></div>
                            </div>
                        </div>
                    </div>
                    <button onClick={this.loadall.bind(this)}> Load All Tweets </button>
                    <button onClick={this.loadpositive.bind(this)}> Load Positive Tweets </button>
                    <button onClick={this.loadnegative.bind(this)}> Load Negative Tweets </button>
                    <input name="twittertext" id="twittertext" text="Search" type="text"></input>
                    <input value="Search Text" type="submit" onClick={this.searchtext.bind(this)}></input>
                </div>
            </div>
        );
    }
}

export default RightPanel;
