/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : buffer.jsx
 * DESCRIPTION     : Reactjs component for Buffer Tool
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      : Implement details
 * CHANGED BY      : jianmin
 * DATE            : Jun 08, 2016
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/
"use strict";

import React                from 'react';
import Slider               from 'components/ui/slider';
import IdentifyDisplay      from 'components/identifydisplay';
import EplActionCreator     from 'actions/eplactioncreator';
import BufferStore          from 'stores/bufferstore';
import MapStore          from 'stores/mapstore';
import UiStore              from 'stores/uistore';
import LayerManagerStore    from 'stores/layermanagerstore';
import jQuery               from 'jquery';
import DrawStore from 'stores/drawstore';
import Util                 from 'util';

class Buffer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            bufferLoading: UiStore.getBufferLoadingState(),
            showId: 0,
            point:BufferStore.getPointBufferStatus(),
            polygon: BufferStore.getPolygonBufferStatus(),
            radius: BufferStore.getRadius(),
            selected: LayerManagerStore.getSelected(),
            isBuffer: true,
            expanded: false,
            bufferOptionExpanded:true
        };
        this._defaultVal = BufferStore.getRadius();
        this._maxVal = 10000;
        this.onBufferDone = this.onBufferDone.bind(this);

        this._onUiChange = this._onUiChange.bind(this);


        this.initialize();
    }

    _onRowClick(newId) {
        return (e) => {
            if (this.state.showId === newId) {
                newId = -1;
            }

            this.setState({
                showId: newId
            });
        }
    }

    //set point buffer
    initialize(){
        this.state.point = true;
        this.state.polygon = false;
        this.state.radius = this._defaultVal;
        BufferStore.setPointBufferStatus(true);
        BufferStore.setPolygonBufferStatus(false);
        BufferStore.setRadius(this._defaultVal);

        //do not show pointer when coming from a query, else set setQueried to false anyway
        BufferStore.getQueried() ? BufferStore.setQueried(false) : BufferStore.pointBuffer();
    }

    onBufferDone(){
        this.setState({
            point:BufferStore.getPointBufferStatus(),
            polygon: BufferStore.getPolygonBufferStatus(),
            radius: BufferStore.getRadius()
        });

    }

    componentWillMount(){
        //reset previous identify results
        this.clearBufferResults();
    }

    componentDidMount() {
        BufferStore.addChangeListener(this.onBufferDone);
        DrawStore.disableDrawHandler();
        MapStore.disableMapOnClickIdentifyHandler();
        UiStore.addChangeListener(this._onUiChange);
        BufferStore._isBufferOn = true;

        let content = this.refs.bufferResults;
        Util.setPerfectScrollbar(content);
    }


    componentWillUnmount() {
        BufferStore.removeChangeListener(this.onBufferDone);
        MapStore.enableMapOnClickIdentifyHandler();
        BufferStore.disableBufferDrawnItem();
        UiStore.removeChangeListener(this._onUiChange);
        BufferStore._isBufferOn = false;
    }

    _onUiChange(){
        this.setState({
            bufferLoading: UiStore.getBufferLoadingState()
        });
    }

    clearBufferResults(){
        let selected = this.state.selected;
        selected.forEach((layer) => {
            layer.results = [];
            layer.resultsChanged = true;
        });
    }

    closeMenu() {
        EplActionCreator.closeMenu();
        EplActionCreator.clearBuffer();
    }

    pointBuffer(){
        //set to default 400 if 0
        if (BufferStore.getRadius() < 1){
            BufferStore.setRadius(this._defaultVal);
            this.changeSliderPosition(this._defaultVal);
        }
        if(!this.state.point){
            EplActionCreator.pointBuffer();
        }
    }

    polygonBuffer(){
        //set to default 0 if not
        if (BufferStore.getRadius() > 1){
            BufferStore.setRadius(0);
            this.changeSliderPosition(0);
        }
        if(!this.state.polygon){
            EplActionCreator.polygonBuffer();
        }
    }

    bufferDone(){
        EplActionCreator.bufferDone();
    }

    clearBuffer(){
        this.clearBufferResults();
        EplActionCreator.clearBuffer();
    }

    bufferSliderChange(value){
        EplActionCreator.bufferSliderChange(value);
    }

    handleChange(event){
        var value = +event.target.value;
        if(this.validateInput(value)){
            this.setState({
                radius: value
            });
            this.changeSliderPosition(value);
        }
    }

    changeSliderPosition(value){
        jQuery(this.refs.bufferslider.refs.slider).val(value).change();
    }

    validateInput(value){
        var valid = (value >= 0);
        if (!valid){
            EplActionCreator.displayMessage('Circle radius must be within ' + this._maxVal + ' meters.');
        }

        return valid;
    }

    toggleBufferPanel(){
        this.setState({
            expanded: !this.state.expanded
        });
    }

    toggleBufferOption(){
        this.setState({
            bufferOptionExpanded: !this.state.bufferOptionExpanded
        });
    }

    render () {
        //inline css
        var divStyle = {
            marginBottom: '20px',
            textAlign:'center'
        };
        var lableStyle = {
            marginTop: '20px'
        };
        let bufferOptionClass = this.state.bufferOptionExpanded ? 'cate-up-icon' : 'cate-minus-icon',
            bufferOptionStyle = this.state.bufferOptionExpanded ? {display: 'block'} : {display: 'none'};
        let expanded = this.state.expanded,
            resizeClass = expanded ? "reduce-icon expand-icon-color" : "expand-icon expand-icon-color",
            resizeInfoClass = expanded ? "icon-resize-small" : "icon-resize-full",
            resizeStyleMap = expanded ? { width: '66%' } : { width: '33%' };

            var scrollMobile = {height:'90%',overflow:'auto'}

        //display buffer result in two alternative ways:
        //1. normal table format
        //2. charts or any other customized format
        return (
            <div id="bufferinfo" className="bufferinfo-color" style={resizeStyleMap}>
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Buffer Tool {this.state.bufferLoading ? <i id="buffer-loading" className="icon-spin5 animate-spin"></i> : null} </span>

                    <span id="bufferinfo-resize" className={resizeClass} onClick={this.toggleBufferPanel.bind(this)}>
                        <i className={resizeInfoClass}></i>
                    </span>

                    <span id="bufferinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div id="bt-content">
                    <div className="buffer-wrapper" style={scrollMobile}>
                        <div id="buffer-options" onClick={this.toggleBufferOption.bind(this)}>
                            <div className="lr-title-wrapper">
                                <span className="lr-title">Buffer Option</span>
                                <span className={bufferOptionClass} ></span>
                            </div>
                        </div>
                        <div className="bufferbtn-wrapper" style={bufferOptionStyle}>
                            <div className="bt-title-wrapper bt-title-color">
                                <span className="bt-title">Click on map to perform query</span>
                            </div>
                            <div style={divStyle}>
                                <button className={"pointbuffer " + (this.state.point ? "buffer-btn-selected" : "") } onClick={this.pointBuffer.bind(this)} >Point</button>
                                <button className={"polygonbuffer " + (this.state.polygon ? "buffer-btn-selected" : "")} onClick={this.polygonBuffer.bind(this)} >Polygon</button>
                            </div>
                            <div className="bt-slider">
                                <Slider ref="bufferslider" onSlide={this.bufferSliderChange.bind(this)} min={0} max={this._maxVal} value={this._defaultVal} />
                                <div style={lableStyle}>
                                    <label htmlFor="buffer-distance">Radius in meters (max 10KM): </label>
                                    <input id="buffer-distance" type="number" min={0} className="buffer-distance-input" defaultValue={this._defaultVal} value={this.state.radius} onChange={this.handleChange.bind(this)} />
                                </div>
                            </div>
                            <div>
                                <button id="clearbuffer" onClick={this.clearBuffer.bind(this)} className="clearbuffer">Clear</button>
                            </div>
                     </div>

                    <div className="si-title-wrapper si-title-color">
                        <span className="si-title">Buffer Results</span>
                        <span className="bf-loading"><i className="icon-spin1 animate-spin"></i></span>
                    </div>
                    <div ref="bufferResults" className="buffer-results">
                         <div id="br-ul">
                            <IdentifyDisplay selected={this.state.selected} showId={this.state.showId} onRowClick={this._onRowClick.bind(this)} />
                         </div>
                    </div>
                 </div>
              </div>
        </div>);
      }
}

export default Buffer;
