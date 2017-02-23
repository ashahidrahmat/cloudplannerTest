/**-------------------------------------------------------------------------------
 * PROGRAM ID      : mapboxgl.jsx
 * DESCRIPTION     : mapboxgl component
 * AUTHOR          : liangjs
 * DATE            : Dec 23, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : 
----------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------*/

"use strict";

import Util from 'util';
import React from 'react';
import ReactDOM from 'react-dom';
import Map3DStore from 'stores/3dmapstore';
import RangeSlider from 'components/ui/rangeslider';
import $ from 'jquery';

class MapBoxGL extends React.Component {

    componentDidMount() {
        Map3DStore.initialize(this.props.mapId, ReactDOM.findDOMNode(this));
    }

    componentWillUnmount() {
        Map3DStore.destroy(ReactDOM.findDOMNode(this));
    }

    render() {
        const marks = {
            0: '',
            15: '',
            30: '',
            50: '',
            100: '',
            200: '',
            300: ''
        };
    
        let onChange = e => {
            let min = e[0], max = e[1],layers = Map3DStore.getLayers(), colors = '';

            Map3DStore.setHeight(min,max);

            for(var i = 1; i< layers.length; i++){
                if(max >= layers[i][0] && min <= layers[i-1][0]){
                    colors += layers[i][1] + ',';                  
                }
            }
            colors = colors.replace(/,\s*$/, "");
            $('.rc-slider-track').css('background','linear-gradient(to right,'+colors+')');
        }

        let handleStyle = {
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            padding: '5px',
            backgroundColor: '#fff',
            color: 'rgb(254, 178, 76)',
            borderRadius: '3px',
            fontSize: '14px',
            textAlign: 'center',
            'zIndex': '1',
            boxShadow: 'rgb(254, 178, 76) 0px 0px 1px 2px;',
        };

        var slider = <div className='mapbox-slider-container'><div className='mapbox-slider'><h2>Building Height</h2><span>Use right mouse button to navigate 3d space.</span><br />
                        <span>Click on the base of a building to see its height.</span><RangeSlider range={1} inverted={false} marks={marks} min={0} max={300} onChange={onChange} suffix='m' handleStyle={handleStyle}/></div></div>;
        return <div id={this.props.id}>{slider}</div>;
    }

}

export default MapBoxGL;
