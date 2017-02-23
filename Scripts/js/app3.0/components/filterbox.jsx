/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : filterbox.js
 * DESCRIPTION     : Reactjs component for Filterbox
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

import Util from '\\util';
import React from 'react';
import Slider from 'components/ui/slider';
import DropDownList from 'components/ui/dropdownlist';
import {FilterState} from 'constants/menuconstants';
import EplActionCreator from 'actions/eplactioncreator';
import LayerManagerStore from 'stores/layermanagerstore';

class FilterBox extends React.Component {

    constructor(props) {
        super(props);

        var list = LayerManagerStore.getSelectedWithFilterbox();

        this.state = {
            selected: this.getFirstSelectedWithFilterbox(list),
            list: list
        };

        this._onChange = this._onChange.bind(this);
        this.preUpdateLayerList = list;
    }

    getFirstSelectedWithFilterbox(list) {
        return list.length > 0 ? list[0].getName() : '';
    }

    componentDidMount() {
        LayerManagerStore.addChangeListener(this._onChange);
    }
    
    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
    }

    onSelectedChange(event) {
        this.setState({
            selected: event.target.value
        });
    }

    minimizeFilter() {
        EplActionCreator.minimizeFilter();
        this.toggleFilterDetails('none', 'block');
    }

    maximizeFilter() {
        EplActionCreator.maximizeFilter();
        this.toggleFilterDetails('block', 'none');
    }

    toggleFilterDetails(filterShow, filterHide){
        let fd = this.refs.filterDetails,
            showFd = this.refs.showFilterDetails;
        if(showFd){
            showFd.style.display = filterHide;
        }
        if(fd){
            fd.style.display = filterShow;
        }
    }

    onSlide(value) {
        var selectedLayer = LayerManagerStore.getLayerByName(this.state.selected);
        EplActionCreator.setLayerOpacity(selectedLayer.getName(), value);
    }

    _onChange(event) {
        var list = LayerManagerStore.getSelectedWithFilterbox(),
            selected = this.state.selected,
            selectedLayers = LayerManagerStore.selected,
            selectedExist = false;
         //if added or removed new layer, display the latest layer
        if(this.preUpdateLayerList.length !== list.length){
            selected = this.getFirstSelectedWithFilterbox(list);
        }
        
        this.preUpdateLayerList = list;
 
        this.setState({
            selected: selected,
            list: list
        });
    }

    render () {
        var selected = this.state.selected;
        //no layer for filterbox
        if(selected.length < 1){
            return null;
        }
        var list = this.state.list.map(layer => {
            var name = layer.getName();
            return { title: name, value: name };
        }),
            opts = Util.listToOptions(list),
            selectedLayer = LayerManagerStore.getLayerByName(selected),
            filterbox = selectedLayer.getFilterbox(),
            filterboxClass = this.props.leftPanelState ? "filter-color filter-with-leftpanel" : "filter-color filter-only",
            showSlider = selectedLayer.getFilterBoxShowsOpacitySlider(),
            defaultSliderVal = selectedLayer.getOpacity() * 100;

        return (
            <div>
                <div ref= "filterDetails" id="filter-details" className={filterboxClass}>
                    <div className="si-title-wrapper si-title-color">
                        <table className="filter-layers-title">
                            <tbody>
                                <tr>
                                    <td>
                                        <span>Filter</span>
                                    </td>
                                    <td>
                                        <select id="filter-layers" value={selected} className="select" onChange={this.onSelectedChange.bind(this)}>{opts}</select>
                                        <span className="filter-drop"></span>
                                    </td>
                                    <td id="filter-hide" onClick={this.minimizeFilter.bind(this)}>
                                        <span className="filter-down-icon" ></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="fo-wrapper">
                        <div id="filter-slider">{ showSlider ? <Slider value={defaultSliderVal} onSlide={this.onSlide.bind(this)} /> : null }</div>
                        <div className="filter-options filter-options-color">{filterbox}</div>
                    </div>
                </div>
                    
                <div ref= "showFilterDetails" id="show-filter-details" className={filterboxClass} onClick={this.maximizeFilter.bind(this)}>
                    <div className="si-title-wrapper si-title-color">
                        <table className="filter-layers-title">
                            <tbody>
                                <tr>
                                    <td>
                                        <span>Filter</span>
                                    </td>
                                    <td id="filter-show">
                                        <span className="filter-up-icon" ></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterBox;