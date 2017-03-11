/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : dropdownlist.js
 * DESCRIPTION     : DropDownList component
 * AUTHOR          : louisz
 * DATE            : Apr 11, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) title:String (Title of the component)
                        2) options:Array[OptionObject] (List of objects to be translated to the options)
                            + OptionObject:Object ()
                                - title: String (The title to be shown in the option)
                                - value: String/Integer (The value to be captured in the option)
                        3) onChange:Function(event) (the function to call when dropdownlist changes)
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

export default class DropDownList extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            value: props.selected || 0
        };

    }

    componentWillReceiveProps(nextProps){
        if (nextProps.selected) {
            this.setState({
                value: nextProps.selected || 0
            });
        }
    }

    onChange(evt) {
        let value = evt.target.value;

        this.setState({
            value: value
        });

        if (this.props.onChange) {
            this.props.onChange(evt);
            //this.forceUpdate();
        }
    }

    componentDidMount() {
        this.refs.ddl.addEventListener('change', this.onChange);
    }

    componentWillUnmount() {
        this.refs.ddl.removeEventListener('change', this.onChange);
    }

    render() {
        var title = this.props.title,
            options = Util.listToOptions(this.props.options, this.state.value);
        
        return (
            <div className="ui_component">
                <div className="ui_component_label">{title}</div>
                <div className="ui-component-select">
                    <select ref='ddl' className="select" value={this.state.value} onChange={this.onChange.bind(this)}>{options}</select>
                </div>
            </div>
        );
    }
}