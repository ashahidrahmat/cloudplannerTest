/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : multiselecttogglebutton.js
 * DESCRIPTION     : MultiSelectToggleButton component
 * AUTHOR          : louisz
 * DATE            : Apr 11, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) layer:Layer (Layer that this component is associate with)
                        2) layerList:Array <Object{name, layerId}> (Toggle object list)
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import Util from '\\util';
import React from 'react';
import ToggleButton from 'components/ui/togglebutton';

class MultiViewToggleButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            layerList: this.props.layerList || []
        };
    }

    render() {
        var layer = this.props.layer,
            layerList = this.state.layerList,
            func = (i, selected) => {
                let details = layerList[i],
                    layerId = details.layerId,
                    layers = layer.getLayers(),
                    layerIdArr = Array.isArray(layerId) ? layerId : [layerId];

                if (this.props.resetLayerList){
                    layers = [];
                }

                if (typeof layerId !== 'undefined') {
                    layerIdArr.forEach(layerId => {
                        if (selected) {
                            layers.push(layerId)
                        } else {
                            layers = Util.removeItemFromArray(layers, layerId);
                        }
                    });
                }

                if (this.props.setIdentify) {
                    layer.setIdentifyLayers(layers);
                }

                if (this.props.setLegend) {
                    layer.setLegend(layers);
                }

                layer.setLayers(layers);
                layerList[i].selected = selected;

                this.setState({
                    layerList: layerList
                });

                if (this.props.onClick) {   
                    this.props.onClick(i, selected, layerId);
                }
            },
            btnList = layerList.map((row, i) => {
                let selected = row.selected || false,
                    rowDisableAttr = row.disabled || false;

                return <ToggleButton key={i} text={row.name} disabled={rowDisableAttr} onClick={func.bind(this, i)} selected={selected} selectedClass={this.props.selectedClass} unselectedClass={this.props.unselectedClass} />
            });
            
        return (
            <div>{btnList}</div>
        );
    }
}

export default MultiViewToggleButton;