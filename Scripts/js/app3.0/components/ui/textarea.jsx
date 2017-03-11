/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : textarea.js
 * DESCRIPTION     : Reactjs component for textarea
 * AUTHOR          : cbenjamin
 * DATE            : Dec 22, 2016
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
import {ProtoTypes}from 'react';
import Util from 'utils';

export default class TextArea extends React.Component {

    constructor(props) {
        super(props);
        this.state={value:'Query'};
     
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }

    onChange(evt) {
        if (this.props.onChange) {
            this.props.onChange(evt);
        }
    }

    componentDidMount() {
        this.refs.textarea.addEventListener('change', this.onChange);
    }

    componentWillUnmount() {
        this.refs.textarea.removeEventListener('change', this.onChange);
    }

    handleChange(evt){
        this.setState({value:event.target.value});
    }

    static updateValue(foo){
        this.setState({value:foo}).bind(this);
    };

    componentWillReceiveProps(nextProps){
        this.setState({
            value:nextProps.value
        });
    }

    shouldComponentUpdate(){
        return true;
    }

    render() {
        var title = this.props.title;
            
        return (
            <div className="ui_component">
                <div className="ui_component_label">{title}</div>
                <div className="ui-component-textarea">
                    <textarea  ref='textarea' value = {this.state.value} handleChange={this.handleChange.bind(this)}>  Query  </textarea>
                </div>
            </div>
        );
    }
}

