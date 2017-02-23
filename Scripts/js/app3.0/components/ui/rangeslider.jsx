/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : rangeslider.jsx
 * DESCRIPTION     : Reactjs component for rc-slider
 * AUTHOR          : liangjs
 * DATE            : Jan 3, 2017
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
import Slider from 'rc-slider-extended';

class RangeSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.propsToState(props);
    }

    propsToState(props) {
        return {
            min: props.min || 0,
            max: props.max|| 100,
            range: (typeof props.range !== "undefined") ? props.range : 0,
            defaultValue: props.defaultValue || (!props.range? 0 : [props.min,props.max]),
            marks: props.marks || null,
            step: props.step || null,
            style: props.style || { 
                width: props.width || 400, 
                margin: '24px 16px 8px 10px' 
            },
            allowCross: props.allowCross || false,
            prefix: props.prefix || '',
            suffix: props.suffix || '',
            title: props.title || '',
            inverted: props.inverted || false,
            handleStyle: props.handleStyle || null
        };
    }

    onChange(e) {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.propsToState(nextProps));
    }

    render() {
        return <div className="ui_component">
            { this.state.title ? <div className="ui_component_label">{this.state.title}:</div> : null }
            <div style={this.state.style}>
                <Slider range={this.state.range} allowCross={this.state.allowCross} inverted={this.state.inverted} step={this.state.step} marks={this.state.marks} handle={<CustomHandle range={this.state.range} style={this.state.handleStyle} prefix={this.state.prefix} suffix={this.state.suffix} />} onChange={this.onChange.bind(this)} defaultValue={this.state.defaultValue} min={this.state.min} max={this.state.max}/>
            </div>
        </div>;
    }
}

const wrapperStyle = { width: 400, margin: 50 };

    let handleStyle = {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        padding: '5px',
        backgroundColor: '#fff',
        color: '#4787ed',
        borderRadius: '3px',
        fontSize: '14px',
        textAlign: 'center',
        'zIndex': '1',
        boxShadow: '#4787ed 0px 0px 1px 2px;',
    };

const CustomHandle = React.createClass({
    propTypes: {
        value: React.PropTypes.any,
        offset: React.PropTypes.number,
    },
    render() {
        const props = this.props;
        //let left = this.props.range === 1 ? `${props.offset}%` : `${100-props.offset}%`;
        //let value = this.props.range === 1? props.value : 100-props.value;
        const style = Object.assign({ left: `${props.offset}%` }, (props.style || handleStyle));
        return (
            <div style={style}>{props.prefix + props.value + props.suffix}</div>
        );
    },
});

export default RangeSlider;