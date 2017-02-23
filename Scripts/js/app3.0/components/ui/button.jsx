/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : button.js
 * DESCRIPTION     : Button component
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

export default class Button extends React.Component {

    constructor (props) {
        super(props);

        this.onClick = this.onClick.bind(this);

        this._class = this.props.class || "more-info";
    }

    onClick(evt) {
        if (this.props.onClick) {
            this.props.onClick(evt);
        }
    }

    componentWillReceiveProps(nextProps) {
        this._class = nextProps.class || "more-info";
    }

    componentDidMount() {
        this.refs.btn.addEventListener('click', this.onClick);
    }

    componentWillUnmount() {
        this.refs.btn.removeEventListener('click', this.onClick);
    }

    getBtnClass() {
        return this._class;
    }

    render() {
        var className = this.getBtnClass();
        return (
            <button title={this.props.title} className={className} ref='btn'>{this.props.text}</button>
        );
    }
}