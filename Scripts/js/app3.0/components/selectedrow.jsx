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
import Slider from 'components/ui/slider';
import ReactDOM from 'react-dom';
import EplActionCreator from 'actions/eplactioncreator';

class SelectedRow extends React.Component {

    static getSelectable() {
        return "added-layer-top";
    }

    componentDidMount() {
        this.updateDomPos();
    }

    componentDidUpdate() {
        this.updateDomPos();
    }

    updateDomPos() {
        ReactDOM.findDOMNode(this).dataset.reactSortablePos = this.props.reactSortablePos;
    }

    removeLayer(name) {
        EplActionCreator.removeLayer(name);
    }

    onSlide(value) {
        var layer = this.props.item;

        EplActionCreator.setLayerOpacity(layer.getName(), value);
    }

    render() {
        var layer = this.props.item;

        return (
            <li>
                <div className={this.constructor.getSelectable()}><label className="sl-label"><span>{layer.getName()}</span></label></div>
                <div className="close-div" onClick={this.removeLayer.bind(this, layer.getName())}><span className="s-close"></span></div>
                <Slider onSlide={this.onSlide.bind(this)} />
            </li>
        );
    }
}

export default SelectedRow;