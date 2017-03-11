/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : leftpanel.js
 * DESCRIPTION     : Reactjs component for LeftPanel
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
import Sortable from 'components/ui/sortable';
import SelectedRow from 'components/selectedrow';
import LayerComponent from 'components/layer';
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';
import Util from 'utils';
import Quicklink from 'components/quicklink/quicklink';

class LeftPanel extends React.Component {

    constructor(props) {
        super(props);
        this.States = {
            All: 0,
            Selected: 1
        };

        this.state = {
            display: this.States.All,
            selected: LayerManagerStore.getSelected(),
            totalCount: LayerManagerStore.getTotalLayerCount(),
            openedCategory: LayerManagerStore.getOpenedCategory(),
            layersByCategories: LayerManagerStore.getLayersByCategories()
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        LayerManagerStore.addChangeListener(this._onChange);
        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content);
    }

    componentWillUnmount() {
        LayerManagerStore.removeChangeListener(this._onChange);
    }

    getSelectedClass(state) {
        return (this.state.display === state ? "selected-btn-color" : "pre-selected-btn-color");
    }

    selectMenu(state) {
        this.setState({
            display: state
        });
    }

    showAllLayers() {
        this.selectMenu(this.States.All);
    }

    showSelectedLayers() {
        this.selectMenu(this.States.Selected);
    }

    removeAllLayers() {
        EplActionCreator.removeAllLayers();
    }

    isState(state) {
        return (this.state.display === state);
    }

    layersToComponent(layers, selected) {
        let components = [];
            layers.map((layer, j) => {
                let isSelected = selected.indexOf(layer) >= 0;
                components.push(
                    <LayerComponent key={j} layer={layer} selected={isSelected} />
                );
            });

        return components;
    }

    categoriesToComponent(layersByCategories, openedCategory, selected) {
        let components = [];
        layersByCategories.map((category, i) => {
            let categoryClassName = 'cate-title-wrapper cate-title-wrapper-color',
                layerUlClassName = 'al-table',
                layers = category.layers,
                layerComponents = this.layersToComponent(layers, selected),
                cateIcon = "arrow_down",
                cate_id = i;

            if (openedCategory == category) {
                categoryClassName = 'cate-title-wrapper cate-title-wrapper-color cate-title-wrapper-selected-color';
                layerUlClassName = 'al-table show';
                cateIcon = "arrow_up";
            }

            components.push(
                <div key={i}>
                    <div className={categoryClassName} onClick={this.toggleCategory.bind(this, category)}>
                        <div className="cate-title">
                            <table className="cate-title-table">
                                <tbody>
                                    <tr>
                                        <td className="cate-img-td"><i className={category.icon}></i></td>
                                        <td><span className="cate-title-layer">{category.name}</span><span className="cate-title-number"> ({layers.length})</span></td>
                                        <td><span className={cateIcon}><i className="icon-angle-down"></i></span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <ul className={layerUlClassName} data-show="Planning">{layerComponents}</ul>
                </div>
            );
                    });

        return components;
    }
    
 
    toggleCategory(category) { 
        category = (category === this.state.openedCategory) ? null : category;
        LayerManagerStore.setOpenedCategory(category);
        this.setState({
            openedCategory: category
        });
    }

    onChange(event) {
        EplActionCreator.searchDataset(event.target.value);
        Util.updatePerfectScroll(this.refs.cateContent,0);
    }

    clearSearchDataset() {
        EplActionCreator.searchDataset("");
    }

    _onChange() {
        this.setState({
            selected: LayerManagerStore.getSelected(),
            totalCount: LayerManagerStore.getTotalLayerCount(),
            layersByCategories: LayerManagerStore.getLayersByCategories(),
            openedCategory: LayerManagerStore.getOpenedCategory(),
        });
    }

    render() {
        let totalCount = this.state.totalCount,
            selected = this.state.selected,
            categoriesArr = this.categoriesToComponent(this.state.layersByCategories, this.state.openedCategory, selected),
            layersBtnClass = "al-btn " + this.getSelectedClass(this.States.All),
            selectedBtnClass = "sl-btn " + this.getSelectedClass(this.States.Selected);
        let showCss = 'show',
            hideCss = 'hide';

        let showQuicklinkIcon = this.state.display? false :true;

        return (
            <div className="maplayers maplayers-color disable-selection" id="leftpanel">
                <div className="maplayers-selection">
                    <div className="maplayers-selection-wrapper maplayers-selection-color">
                        <button className={layersBtnClass} onClick={this.showAllLayers.bind(this)}>All ({totalCount})</button>
                        <button className={selectedBtnClass} onClick={this.showSelectedLayers.bind(this)}>Selected ({selected.length})</button>
                    </div>
                </div>
                <div className="cate-search cate-search-color">
                    <span className="search-icon"><i className="iconfont icon-search"></i></span>
                    <input id="cate-search" className="cate-search-color" type="text" value={this.props.layerFilterText} placeholder="Search dataset..." onChange={this.onChange.bind(this)} />
                </div>

                {
                    this.props.layerFilterText.length > 0 ?
                        <span className="cate-search-clear" onClick={this.clearSearchDataset.bind(this)}></span>
                        : null
                }

                

                {
                    (<div id="available-layers" className={this.isState(this.States.All) ? showCss : hideCss}>
                          <div ref="cateContent" className="cate-content">{categoriesArr}</div>
                    </div>)
                }

                {
                    (<div id="selected-layers" className={this.isState(this.States.Selected) ? showCss : hideCss}>
                        <div id="sl-header" className="si-title-wrapper si-title-color">
                            <span className="si-title">Selected Layers <span className="cate-title-number">(<label id="sl-number">{selected.length}</label>)</span></span>
                            <span className="s-closeall" onClick={this.removeAllLayers.bind(this)}></span>
                        </div>
                        <div id="sl-wrapper">
                            <Sortable items={selected} component={SelectedRow} onUpdate={EplActionCreator.reorderLayer} />
                        </div>
                    </div>)
                }

            </div>
        );
    }
}

export default LeftPanel;
