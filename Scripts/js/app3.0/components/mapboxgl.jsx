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

import Util from 'utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Map3DStore from 'stores/3dmapstore';
import RangeSlider from 'components/ui/rangeslider';
import $ from 'jquery';
import EplConstants from 'constants/eplconstants';
import EplActionCreator from 'actions/eplactioncreator';

class MapBoxGL extends React.Component {

    constructor(props) {
        super(props);

        this.defaultHeightValues = [0,300];

        this.heightValues = this.defaultHeightValues;

        this._reset = this._reset.bind(this);
    }

    _reset(){
        if(Map3DStore.getResetStatus()){
            this.heightValues = this.defaultHeightValues;
            Map3DStore.setResetStatus(false);
        }
    }

    componentDidMount() {
        Map3DStore.initialize(this.props.mapId, ReactDOM.findDOMNode(this));
        Map3DStore.addChangeListener(this._reset);
    }

    componentWillUnmount() {
        Map3DStore.destroy(ReactDOM.findDOMNode(this));
        Map3DStore.removeChangeListener(this._reset);
    }

    render() {
        const heightMarks = {
            0: '',
            300: ''
        };

    
        let onHeightChange = e => {
            this.heightValues = [e[0],e[1]]
            Map3DStore.filter(this.heightValues[0],this.heightValues[1]);
        }

        var slider = <div className='mapbox-slider-container'>
                        <div className='mapbox-slider'>
                            <div style={{margin:'12px 24px 0px 24px'}}>           
                                <p style={{paddingTop:'16px',marginBottom: '-8px'}}>Use right mouse button to navigate 3D space. Click on the base of a building for more info.</p>                    
                                <h2>Building height</h2>
                                <RangeSlider style={{margin:'24px 16px 8px 18px', width:'444px'}} reset={true} inverted={false} range={1} step={5} marks={heightMarks} defaultValue={this.heightValues} min={0} max={300} onChange={onHeightChange} suffix={'m'} />
                            </div>
                        </div>
                     </div>;
        return <div id={this.props.id}>{slider}</div>;     
                                }
                                }

export default MapBoxGL;