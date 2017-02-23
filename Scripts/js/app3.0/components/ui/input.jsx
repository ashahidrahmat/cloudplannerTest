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

export default class Input extends React.Component {

    constructor (props) {
        super(props);
        this.state={
            value:props.value || ''
        };

        this.onChange = this.onChange.bind(this);
        this.rerender = function(){this.render();}
    }

    onChange(evt) {
        if (this.props.onChange) {
            this.props.onChange(evt);
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            value:nextProps.value
        });
    }

    shouldComponentUpdate(){
        return true;
    }


    getInputClass() {
        return "calc";
    }

    render() {
        var className = this.getInputClass();
        return (
            <input ref={(input)=>{this.textInput = input;}} value={this.state.value} type={this.props.type || "text"} className={this.props.type  || className} placeholder={this.props.placeholder}  onChange={this.onChange.bind(this)} style={this.props.style} />
        );
    }
}