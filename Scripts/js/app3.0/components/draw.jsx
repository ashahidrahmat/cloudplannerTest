/**-----------------------------------------------------------
 * PROGRAM ID      : draw.jsx
 * DESCRIPTION     : Reactjs component for drawing tool
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
-----------------------------------------------------------------
 * CHANGE LOG      : implement draw functions
 * CHANGED BY      : jianmin
 * DATE            : Jun 06, 2016
 * VERSION NO      :
 * CHANGES         :
-------------------------------------------------------------------*/
"use strict";

import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';
import DrawStore from 'stores/drawstore';
import DrawConstants, {DrawColors} from 'constants/drawconstants';
import BufferStore from 'stores/bufferstore';

class Draw extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            button: DrawStore.getButtonStatus(),
            result: DrawStore.getDrawResult(),
            colorId: DrawStore.getColorId()
        };

        this.onDrawDone = this.onDrawDone.bind(this);
    }

    onDrawDone(){
        this.setState({
            button:DrawStore.getButtonStatus(),
            result:DrawStore.getDrawResult()
        });
    }

    componentDidMount() {
        DrawStore.addChangeListener(this.onDrawDone);
        //DrawStore.disableMapOnClickIdentifyHandler();
        BufferStore.disableBufferDrawHandler();
        DrawStore._registeredDrawEventHandler = false;
    }

    componentWillUnmount() {
        DrawStore.removeChangeListener(this.onDrawDone);
        DrawStore.disableDrawHandler();
        //enable 
        //DrawStore.enableMapOnClickIdentifyHandler();
    }
    
    closeMenu() {
        EplActionCreator.closeMenu();
    }
    
    drawMarker(){
        //prevent multiple clicks to dispatch
        if(!this.state.button[DrawConstants.Marker]){
            EplActionCreator.drawMarker();
        }
    }

    drawPolygon(){
        if(!this.state.button[DrawConstants.Polygon]){
            EplActionCreator.drawPolygon();
        }
    }

    drawLine(){
        if(!this.state.button[DrawConstants.Line]){
            EplActionCreator.drawLine();
        }
    }

    drawRectangle(){
        if(!this.state.button[DrawConstants.Rectangle]){
            EplActionCreator.drawRectangle();
        }
    }

    drawCircle(){
        if(!this.state.button[DrawConstants.Circle]){
            EplActionCreator.drawCircle();
        }
    }

    updateDrawnItemColor(e){
        this.state.colorId = e.target.id;
        EplActionCreator.updateDrawnItemColor(e.target.id);
    }

    clearDrawing(){
        EplActionCreator.clearDrawing();
    }

    generateSpans(spanIds){
        var selectedClass = " draw-selected-color";
        return spanIds.map(spanId => {
            return (
                <span key={spanId} 
                      id={spanId} 
                      className={"color-button " + spanId + (this.state.colorId === spanId ? selectedClass : "")}>
                </span>);
        });
    
    }

    render () {
        var selectedClass = " draw-tool-selected";
        var spanIds = [];
        for(var id in DrawColors){
            spanIds.push(id);
        }
        var displaySpans = this.generateSpans(spanIds);

        return (
            <div id="draw-tool" className="draw-color">
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Draw Tool</span>
                    <span id="draw-close-btn" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div className="draw-wrapper">
                    <div>
                        <div><span>Select Color</span></div>
                        <div id="color-palette" onClick={this.updateDrawnItemColor.bind(this)}>
                            {displaySpans}
                        </div>
                    </div>
                    <div>
                        <table className="draw-table">
                            <tbody>
                            <tr id="pin-location" className={"pin-location-tr" + (this.state.button[DrawConstants.Marker] ? selectedClass : "")} onClick={this.drawMarker.bind(this)}>
                                <td width="60px">
                                    <i className="iconfont icon-location"></i>
                                </td>
                                <td>
                                    <span>Pin a location</span>
                                </td>
                            </tr>
                            <tr id="draw-line" className={"draw-line-tr" + (this.state.button[DrawConstants.Line] ? selectedClass : "")} onClick={this.drawLine.bind(this)}>
                                <td width="60px">
                                    <span className="draw-line"></span>
                                </td>
                                <td>
                                    <span>Draw a line</span>
                                </td>
                            </tr>
                            <tr id="draw-rectangle" className={"draw-rectangle-tr" + (this.state.button[DrawConstants.Rectangle] ? selectedClass : "")} onClick={this.drawRectangle.bind(this)}>
                                <td width="60px">
                                    <span className="draw-rectangle"></span>
                                </td>
                                <td>
                                    <span>Draw a rectangle</span>
                                </td>
                            </tr>
                            <tr id="draw-circle" className={"draw-circle-tr" + (this.state.button[DrawConstants.Circle] ? selectedClass : "")} onClick={this.drawCircle.bind(this)}> 
                                <td width="60px">
                                    <span className="draw-circle"></span>
                                </td>
                                <td>
                                    <span>Draw a circle</span>
                                </td>
                            </tr>
                            <tr id="draw-polygon" className={"draw-polygon-tr" + (this.state.button[DrawConstants.Polygon] ? selectedClass : "")} onClick={this.drawPolygon.bind(this)}>
                                <td width="60px">
                                    <span className="draw-polygon"></span>
                                </td>
                                <td>
                                    <span>Draw a polygon</span>
                                </td>
                            </tr>
                            <tr id="clear-draw" className="clear-draw-tr" onClick={this.clearDrawing.bind(this)}>
                                <td width="60px">
                                    <i className="iconfont icon-trash-empty"></i>
                                </td>
                                <td>
                                    <span>Clear Drawings</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="draw-result">
                        {this.state.result}
                    </div>
                </div>
            </div>
    );
    }
}

export default Draw;
