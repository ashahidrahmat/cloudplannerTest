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
import ReactDOM from 'react-dom';
import MapStore from 'stores/mapstore';

class EsriLeaflet extends React.Component {

    componentDidMount() {
        MapStore.initialize(this.props.mapId, ReactDOM.findDOMNode(this));
    }

    componentWillUnmount() {
        MapStore.destroy(this.props.mapId, ReactDOM.findDOMNode(this));
    }

    render() {
        return <div id={this.props.id}></div>;
    }
}

export default EsriLeaflet;