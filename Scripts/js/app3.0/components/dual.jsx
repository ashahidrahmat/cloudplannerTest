/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : tourguide.js
 * DESCRIPTION     : Reactjs component for TourGuide
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2015
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
import EsriLeaflet from 'components/esrileaflet';
import MapConstants from 'constants/mapconstants';
import EplActionCreator from 'actions/eplactioncreator';

class Dual extends React.Component {

    constructor(opts) {
        super(opts);

        this.startX = 0;
        this.state = {
            dragging: false,
            width: 450
        }

        this.onBoxDrag = this.onBoxDrag.bind(this);
        this.onBoxDragEnd = this.onBoxDragEnd.bind(this)
        this.onBoxDragStart = this.onBoxDragStart.bind(this);
    }

    componentDidMount() {
        var width = this.refs.map.offsetWidth;
        this.setState({
            'width': width >= 450 ? width : 450
        });
        EplActionCreator.resetMapSize();
    }

    toggleDualBasemapMenu() {
        EplActionCreator.toggleDualBasemap();
    }

    onBoxDragStart(ev) {
        //handle compatible issues
        if (ev.touches) { //ipad
            var touch = ev.touches[0];
            this.startX = touch.pageX;
        } else {
            this.startX = ev.clientX;
        }
        
        this.startWidth = this.state.width;
        this.setState({
            dragging: true
        });
    }

    onBoxDrag(ev) {
        if (this.state.dragging) {
            this._draw(ev);
        }
    }

    onBoxDragEnd(ev) {
        //this._draw(ev);
        this.setState({
            dragging: false
        });
        EplActionCreator.resetMapSize();
    }

    _draw(ev) {
        //resize right map
        var diff = 0;
        if (ev.touches) {
            var touch = ev.touches[0];
            diff = touch.pageX;
        } else {
            diff = ev.clientX;
        }

        if (diff !== 0) {
            this.setState({
                'width': this.startWidth + (this.startX - diff)
            });
        }
    }

    render() {
        var styleMap = {
            width: this.state.width + "px"
        };

        return (
            <div id="right-map" style={styleMap}>
                <div id="resize-handler" ref="map" draggable="true" onDragStart={this.onBoxDragStart} onDrag={this.onBoxDrag} onDragEnd={this.onBoxDragEnd} onTouchStart={this.onBoxDragStart} onTouchMove={this.onBoxDrag} onTouchEnd={this.onBoxDragEnd}></div>
                <div id="right-basemap" onClick={this.toggleDualBasemapMenu.bind(this)}>
                    <div className="right-basemap-icon"><i className="iconfont icon-globe"></i><div className="iconfont-name">Basemap</div></div>
                </div>
                <EsriLeaflet id="right-map-canvas" mapId={MapConstants.Dual}/>
            </div>
        );
                }
}

export default Dual;
