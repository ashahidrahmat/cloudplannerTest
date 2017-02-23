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

import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';

class Layer extends React.Component {
    constructor(props) {
        super(props);

        this.toggleLayer = this.toggleLayer.bind(this);
        this.toggleInfographics = this.toggleInfographics.bind(this);
    }

    toggleLayer() {
        var layerName = this.props.layer.getName();
        //console.log(layerName);
        this.props.selected ? EplActionCreator.removeLayer(layerName) : EplActionCreator.addLayer(layerName);
    }

    toggleInfographics() {
        EplActionCreator.toggleLayerSummary(this.props.layer.getName());
    }

    render() {
        let layer = this.props.layer,
            highlighted = (this.props.selected) ? "al-table-li-disabled" : "";

        return (
            <li className={highlighted}>
                <table id="cate-layer">
                    <tbody>
                        <tr>
                            <td><span className="layer-icon-space"></span></td>
                            <td className="layer-name" onClick={this.toggleLayer}>{layer.getName()}</td>
                    <td><span className="layer-dialog" onClick={this.toggleInfographics}><i className="icon-info"></i></span></td>
                        </tr>
                    </tbody>
                </table>
            </li>
        );
    }
}

export default Layer;