/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : tourguide.js
 * DESCRIPTION     : Reactjs component for TourGuide
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
import EplActionCreator from 'actions/eplactioncreator';

import $ from 'jquery';

export default class LayerInfo extends React.Component {
     
    componentDidMount() {
        let delay = this.props.delay;

        this.component = $(this.refs.layerInfo).show();
        
        if (delay === null || delay > 0) {
            this.component.delay(delay || 5000).fadeOut(400, () => {
                EplActionCreator.hideLayerInfo();
            });
        }
    }

    componentDidUpdate() {
        let delay = this.props.delay;
        if (delay === null || delay > 0) {
            this.component.delay(delay || 5000).fadeOut(400, () => {
                EplActionCreator.hideLayerInfo();
            });
        }
    }

    render() {
        let rawHtml = <span id="li-msg" dangerouslySetInnerHTML={{__html: this.props.info}}></span>;

        return (
            <div ref='layerInfo' className="layer-info layer-info-color">
                <div className="layer-info-wrapper">
                    <p>{rawHtml}</p>
                </div>
            </div>
        );
    }
}
