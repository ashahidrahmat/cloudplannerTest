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
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';
import Util from 'utils';

class Legend extends React.Component {
    constructor(props) {
        super(props);

        var list = LayerManagerStore.getSelectedNames(),
            [selected, legend] = this.initLegend(list);

        this.state = {
            legendList: LayerManagerStore.getSelectedNames(),
            selected: selected,
            legend: legend
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        LayerManagerStore.addChangeListener(this._onChange);
        Util.logPanelView("legend");
    }

    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
    }

    initLegend(list, selected=null) {
        var legend;

        //pre-assign to first item if it is not selected
        if (!selected && list.length > 0) {
            selected = list[0];
        }

        //get the legend
        if (selected) {
            legend = LayerManagerStore.getLegend(selected);
        }

        return [selected, legend];
    }

    _onChange() {
        var list = LayerManagerStore.getSelectedNames(),
            [selected, legend] = this.initLegend(list, this.state.selected);

        this.setState({
            legendList: list,
            selected: selected,
            legend: legend
        });
    }

    closeMenu() {
        EplActionCreator.closeMenu();
    }

    translateToDiv(nameList) {
        var divs = [];

        nameList.map((layerName, i) => {
            divs.push(<option key={i} value={layerName}>{layerName}</option>);
        });

        return divs;
    }

    selectionChange(evt) {
        var layerName = evt.target.value;
        this.setState({
            selected: layerName,
            legend: LayerManagerStore.getLegend(layerName)
        });
    }

    render() {
        let legendListDiv = this.translateToDiv(this.state.legendList);

        return (
            <div id="legend-div" className="legend-color">
                <div className="si-title-wrapper si-title-color">
                    <span className="si-title">Legend</span>
                    <span id="legend-close-btn" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                </div>
                <div className="legend-wrapper">
                    <div id="mapLegend-content" title="Map Legend">
                        <div id="ll-content">
                            <div id="ll-content-select">
                                <label>Select layer: </label>
                                <select id="layer-select" className="layer-select-color" onChange={this.selectionChange.bind(this)}>{legendListDiv}</select>
                                <span className="filter-drop"></span>
                            </div>
                            <div id="legend-details">{this.state.legend}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
    
export default Legend;