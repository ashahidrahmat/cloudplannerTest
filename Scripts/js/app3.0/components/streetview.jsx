/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : leftpanel.js
 * DESCRIPTION     : Reactjs component for LeftPanel
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
import {findDOMNode} from 'react-dom';
import EplActionCreator from 'actions/eplactioncreator';

class StreetView extends React.Component {
    constructor(props){
        super(props);
        this.propsToState(props);
    }

    propsToState(props){
        let latitude = parseFloat(props.latitude), longitude = parseFloat(props.longitude);

        this.state = {
            coordinates: {lat: latitude, lng: longitude},
            error: null
        }
    }

    componentDidMount() {
        var sv = new google.maps.StreetViewService();
        sv.getPanorama({location: this.state.coordinates, radius: 50}, this.processSVData.bind(this));
    }

    processSVData(data, status){
        let container = findDOMNode(this.refs["street-view"]);
        if(status === "OK"){
            var panorama = new google.maps.StreetViewPanorama(
              container, {
                position: this.state.coordinates,
                pov: {
                  heading: 34,
                  pitch: 10
                }
              }
            );
        } else if(status === "ZERO_RESULTS"){
            // container.style.height = '5vh';
            // container.style.width = '25vw';
            this.setState({
                error: <p style={{textAlign:'center'}}>No street view imagery is found for this location</p>
            });
        }
    }

    render() {
        return (
            <div id="street-view" ref="street-view">{this.state.error}</div>
        );
    }
}

export default StreetView;