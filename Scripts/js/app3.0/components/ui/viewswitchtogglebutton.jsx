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

class ViewSwitchToggleButton extends React.Component {

    constructor(props) {
        super(props);

        var index = this.props.initialIndex || 0;
        this.state = {
            selectedIndex: index
        };
    }

    onChange (index) {

        this.setState({
            selectedIndex: index
        });

        if (this.props.onChange) {
            this.props.onChange(index);
        }
    }

    render() {
        let btnList = React.Children.map(this.props.children, (child, index) => {
                var selected = index === this.state.selectedIndex;
                return <ToggleButton key={index} text={child.props.title} onClick={this.onChange.bind(this, index)} selected={selected} />;
            }),
            view = React.Children.toArray(this.props.children)[this.state.selectedIndex];

        return (
            <div>
                {this.props.title} {btnList}
                {view}
            </div>
        );
    }
}

export default ViewSwitchToggleButton;