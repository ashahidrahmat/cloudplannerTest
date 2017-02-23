/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : Reactjs component for 1 layer on the LeftPanel
 * AUTHOR          : louisz
 * DATE            : Jan 6, 2016
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
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';

class LayerSummary extends React.Component {
    constructor(props) {
        super(props);
       
        this.States = {
            Infographics: 0,
            Summary: 1
        };

        this.state = {
            view: this.States.Infographics,
            infographics: LayerManagerStore.getInfographics(),
            summary: LayerManagerStore.getSummary()
        }

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        LayerManagerStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
    }
     
    closeLayerSummaryPanel() {
        EplActionCreator.closeLayerSummaryPanel();
    }

    changeView(state) {
        this.setState({
            view: state
        });
    }

    _onChange() {
        this.layerName = LayerManagerStore.detailedLayer.opts.name;
        this.setState({
            summary: LayerManagerStore.getSummary(),
            infographics: LayerManagerStore.getInfographics(),
        });
    }

    getBtnClass(state) {
        return (state === this.state.view) ? "selected-btn-color" : "pre-selected-btn-color";
    }

    render() {
        let infoClass = "layerinfo-inf " + this.getBtnClass(this.States.Infographics),
            summaryClass = "layerinfo-sum " + this.getBtnClass(this.States.Summary);

        return (
            <div id="layerinformation" className="layerinformation-color">
                <div className="si-title-wrapper si-title-color">
                    <span id="lmw-map-3-title" className="si-title">{this.layerName}</span>
                    
                    <span id="li-back" className="right-close-btn right-close-btn-color" onClick={this.closeLayerSummaryPanel.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div id="layerinfo-wrapper">    
                    {
                        this.state.infographics ? 
                            <div className="nav-wrapper nav-wrapper-color">
                                <button className={infoClass} onClick={this.changeView.bind(this, this.States.Infographics)}>Infographics</button>
                                <button className={summaryClass} onClick={this.changeView.bind(this, this.States.Summary)}>Summary</button>
                            </div> : 
                            <div className="nav-wrapper nav-wrapper-color">Summary</div>
                    }
                </div>
                <div className="layerinfo-content-wrapper layerinfo-content-color">
                    {
                        (this.state.view === this.States.Infographics && this.state.infographics) ?
                            <div className="layer-chart-wrapper">{this.state.infographics}</div>  :
                            <div className="layer-map-wrapper">
                                <div className="map-description">
                                    <h4>Description</h4>
                                    <p id="map-3-des" dangerouslySetInnerHTML={{__html: this.state.summary}}></p>
                                </div>
                            </div>
                    }
                     <div  id="layerinfo-loading">
                        <span className="cw-loading"><i className="icon-spin5 animate-spin"></i></span>
                    </div>
                </div>
               
            </div>
        );
    }
}

export default LayerSummary;