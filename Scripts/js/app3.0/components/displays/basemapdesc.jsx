/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : Reactjs component for 1 layer on the LeftPanel
 * AUTHOR          : louisz
 * DATE            : Jan 6, 2016
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

import Img from 'components/displays/img';
import React from 'react';

class BasemapDesc extends React.Component {
    render() {
        var imageUrl = this.props.imageUrl,
            desc = this.props.desc;

        return (
            <div id="popupMap-content" title="Basemap Information">
                <div id="map-image"><Img src={imageUrl} /></div>
                <div>
                    <h4>Description:</h4>
                <div id="map-2-description">{desc}</div>
                </div>
            </div>
        );
    }
}

export default BasemapDesc;