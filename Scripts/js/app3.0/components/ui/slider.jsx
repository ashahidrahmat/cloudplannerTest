/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : selected.js
 * DESCRIPTION     : Reactjs component for LeftPanel
 * AUTHOR          : louisz
 * DATE            : Apr 6, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) Layer name:String - Name of the layer that control will affect
                        2) onSlide:Function(value) - Function to trigger on slide
                        3) Attributes
                            min: The min value of the slider (default - 0)
                            max: The max value of the slider (default - 100)
                            value: The initial value of the slider (default - 80)
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

import $ from 'jquery';
import rangeslider from 'libs/slider/2.1.1/rangeslider.js';

class Slider extends React.Component {

    componentDidMount() {
        //settimeout hack to make slider work on buffer without disrupting css transition
        setTimeout(() => { 
            $(this.refs.slider).rangeslider({
                polyfill: false,
                onSlide: (position, value) => {
                    if (this.props.onSlide) {
                        this.props.onSlide(value);
                    }
                }
            });
        }, 0);
    }

    render() {
        let x,
            labels = [],
            showLabels = this.props.showLabels || false,
            min = this.props.min || 0,
            max = this.props.max || 100,
            step = this.props.step || 1,
            value = this.props.value || 80,
            onChange = e => {};

        for (x=min; x <=max; x+=step) {
            labels.push(x);
        }

        return (<div>
            <input ref='slider'
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
            />
            { showLabels ? <div className='rangeslider__ruler'>{labels.join(' ')}</div> : null }
        </div>);
    }
}

export default Slider;