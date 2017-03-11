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

import Util from 'utils';
import React from 'react';
import ToggleButton from 'components/ui/togglebutton';

class SingleViewToggleButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: this.props.initialIndex || 0
        };
    }

    render() {
        var layer = this.props.layer,
            layerList = this.props.layerList,
            funcList = (index) => {
                let toggle = true,
                    row = layerList[index],
                    layerId = row.layerId,
                    identifyId = row.identifyId,
                    legend = row.legend;

                if (this.props.allowNoSelection && this.state.selectedIndex === index) {
                    this.setState({
                        selectedIndex: -1
                    });

                    //does not touch identify
                    layerId = [];
                    legend = -1;
                    toggle = false;
                } else {
                    this.setState({
                        selectedIndex: index
                    });
                }

                if (Number.isInteger(layerId)) {
                    layer.setLayer(layerId);
                } else if (Util.isArray(layerId)) {
                    layer.setLayers(layerId);
                }

                if (Number.isInteger(legend)) {
                    layer.setLegend([legend]);
                }
                
                // set identify id
                if (identifyId) {
                    layer.setIdentify(identifyId);
                }

                //Trigger all OnChangeEvent
                if (this.props.onChange) {
                    this.props.onChange(row.name, row.layerId, toggle);
                }
            },
            btnList = layerList.map((row, index) => {
                var selected = index === this.state.selectedIndex;
                return <ToggleButton key={index} text={row.name} onClick={funcList.bind(this, index)} selected={selected} selectedClass={this.props.selectedClass} unselectedClass={this.props.unselectedClass} unselectedClass={this.props.unselectedClass} />;
            });
            
        return (
            <div>{btnList}</div>
        );
    }
}

export default SingleViewToggleButton;