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

import Util from '\\util';
import React from 'react';
import DropDownList from 'components/ui/dropdownlist';

class ViewSwitchDropDownList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.selected || 0
        };
    }

    onChange (evt) {
        let value = evt.target.value;

        this.setState({
            value: value
        });

        if (this.props.onChange) {
            this.props.onChange(evt);
        }
    }

    render() {
        let titles = React.Children.map(this.props.children, (child, index) => {
                return child.props.title;
            }),
            options = Util.arrayToList(titles, false),
            view = React.Children.toArray(this.props.children)[this.state.value];

        return (
            <div>
                <DropDownList title={this.props.title} options={options} selected={this.state.value} onChange={this.onChange.bind(this)} />
                {view}
            </div>
        );
    }
}

export default ViewSwitchDropDownList;