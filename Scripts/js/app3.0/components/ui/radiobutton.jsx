/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : input.js
 * DESCRIPTION     : Input component
 * AUTHOR          : louisz
 * DATE            : May 10, 2016
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

import React from 'react';

export default class RadioButton extends React.Component {

    constructor (props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        if (this.props.onChange) {
            this.props.onChange(evt);
        }
    }

    componentDidMount() {
        this.refs.radio.addEventListener('change', this.onChange);
    }

    componentWillUnmount() {
        this.refs.radio.removeEventListener('change', this.onChange);
    }

    render() {
        return (<div>
            <label>
                <input ref='radio' type="radio" name={this.props.name} value={this.props.value} checked={ this.props.checked ? "checked" : null } />{this.props.title}
            </label>
        </div>);
    }
}