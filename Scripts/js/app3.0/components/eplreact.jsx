/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : eplreact.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : yujianmin
 * DATE            : Dec 17, 2014
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

import Url from 'components/displays/url';
import React from 'react';
import UiStore from 'stores/uistore';
import MapStore from 'stores/mapstore';
import MapConstants from 'constants/mapconstants';
import {UrlConstants, ControllerUrl} from 'constants/urlconstants';
import MenuConstants, {FilterState} from 'constants/menuconstants';
import LeftPanel from 'components/leftpanel';
import RightPanel from 'components/rightpanel';
import UserProfile from 'components/userprofile';
import FilterBox from 'components/filterbox';
import Legend from 'components/legend';
import EsriLeaflet from 'components/esrileaflet';
import TourGuide from 'components/tourguide';
import SearchDisplay from 'components/searchdisplay';
import LayerSummary from 'components/layersummary';
import LayerInfo from 'components/layerinfo';
import Bookmark from 'components/bookmark';
import Buffer from 'components/buffer';
import Draw from 'components/draw';
import Dual from 'components/dual';
import Modal from 'components/modal';
import EplActionCreator from 'actions/eplactioncreator';
import LayerManagerStore from 'stores/layermanagerstore';
import SearchActionCreator from 'actions/searchactioncreator';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SpeechStore from 'stores/speechstore';
import MapBoxGL from 'components/mapboxgl';
import Map3DStore from 'stores/3dmapstore';
import ConfigStore from 'stores/configstore';
import Quicklink from 'components/quicklink/quicklink';
import GeoTagPhotoDetail from 'components/geophoto/geotagphotodetail';
import WebApi from 'webapi';

export default class EplReact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uiState: UiStore.getUiState(),
            searchText: UiStore.getSearchText(),
            speech: SpeechStore.getSpeechState(),
            buildings: false
        };

        this._onUiChange = this._onUiChange.bind(this);
        this._onSpeechChange = this._onSpeechChange.bind(this);

        WebApi.getOneMapToken();
    }

    componentDidMount() {
        UiStore.addChangeListener(this._onUiChange);
        SpeechStore.addChangeListener(this._onSpeechChange);
    }

    componentWillUnmount() {
        UiStore.removeChangeListener(this._onUiChange);
        SpeechStore.removeChangeListener(this._onSpeechChange);
    }

    _onUiChange() {
        this.setState({
            uiState: UiStore.getUiState(),
            searchText: UiStore.getSearchText()
        });
    }

    _onSpeechChange() {
        this.setState({
            speech: SpeechStore.getSpeechState()
        });
    }

    closeMenu() {
        EplActionCreator.closeMenu();
    }

    closeLeftMenu() {
        EplActionCreator.closeLeftPanel();
    }

    closeRightMenu() {
        EplActionCreator.closeRightPanel();
    }

    toggleLeftPanel() {
        EplActionCreator.toggleLeftPanel();
    }

    toggleUserProfile() {
        EplActionCreator.toggleUserProfile();
    }

    toggleDualScreen() {
        EplActionCreator.toggleDualScreen();
    }

    toggleBasemapMenu() {
        EplActionCreator.toggleBasemap();
    }

    toggleLegend() {
        EplActionCreator.toggleLegend();
    }

    toggleBookmark() {
        EplActionCreator.toggleBookmark();
    }

    toggleBuffer() {
        EplActionCreator.toggleBuffer();
    }

    toggleDraw() {
        EplActionCreator.toggleDraw();
    }

    showMetadata() {
        EplActionCreator.showModal(<Url url={ControllerUrl.Metadata} />);
    }

    setBasemap(name) {
        EplActionCreator.setBasemap(name);
    }

    showBasemapInfo(name) {
        var basemap = MapStore.getBasemap(name)
        EplActionCreator.showModal(basemap.getInfo());
    }

    reset() {
        EplActionCreator.reset();
    }

    locateUser() {
        EplActionCreator.locateUser();
    }

    onChange(event) {
        this.setSearchText(event.target.value);
    }

    setSearchText(text, search=true) {
        EplActionCreator.setSearchText(text);
        if(search){
            SearchActionCreator.search(text);
            this.refs.searchInput.focus();
        }
    }

    onSpeech() {
        if(typeof webkitSpeechRecognition !== 'undefined'){
            EplActionCreator.onSpeech();
        }
    }

    offSpeech() {
        EplActionCreator.offSpeech();
    }

    clearSearchResults() {
        EplActionCreator.setSearchText('');
        EplActionCreator.clearSearchResults();
        EplActionCreator.clearHighlights();
    }

    //TODO arrow keys for search suggest
    //http://simplyaccessible.com/article/arrow-key-navigation/
    onKeyUp(event){
        EplActionCreator.onKeyUp(event);
    }

    toggle3D(){
        this.closeRightMenu();
        if(this.state.buildings){
            this.toggleLeftPanel();
            this.setState({
                buildings: false
            })
        } else {
            this.state.uiState.dualScreen = false;
            this.setState({
                buildings: true
            })
        }      
    }

    render3DButton(){
        let button3D = <li id="3d" onClick={this.toggle3D.bind(this)}><i className="iconfont icon-3d-building"></i><div className="iconfont-name">3D</div></li> 
        let exit3D = <li id="m3d-exit" onClick={this.toggle3D.bind(this)}><i className="iconfont icon-cancel-circled"></i><div id="m3d-exit" className="iconfont-name">Exit 3D</div></li>

        //if(!ConfigStore.extranet){
            if(!this.state.buildings){
                return button3D;
            } else {
                return exit3D;
            }        
        //} else {
            //return null;
        //}

        return null;
    }

    render() {
        var basemaps = !this.state.buildings ? MapStore.getBasemaps() :  Map3DStore.getBasemaps(),
            uiState = this.state.uiState,
            showLeftPanel = (uiState.displayMenu === MenuConstants.LeftPanel || uiState.displayMenu === MenuConstants.LeftPanelWithSummary),
            layerFilterText = uiState.layerFilterText,
            speechClass = this.state.speech ? "icon-mike-on iconfont icon-mic" : "icon-mike-off iconfont icon-mic",
            speechAction = this.state.speech ? this.offSpeech.bind(this) : this.onSpeech.bind(this),
            searchPlaceholder = this.state.speech ? 'Speak into microphone now':'Search address e.g. 45 Maxwell Road',
            layerWithInfo = LayerManagerStore.getLatestLayer(),
            buildings = this.state.buildings;

        const logoSpacing = {
            marginLeft: '15px'
        };
        
        return (
            <div className="map-content">
                <div id="header-top" className="header-top header-color">
                    <div className="tools">
                            {
                                !buildings ? <div className="layer-list-div" onClick={this.toggleLeftPanel.bind(this)}><i className="iconfont icon-menu layer-list"></i></div> : null
                            }

                            {
                                !buildings? <div className="logo" onClick={this.reset.bind(this)}><img src="/Content/img/header/logo.png" className="logo-img" /></div> :  <div style={logoSpacing} className="logo" onClick={this.reset.bind(this)}><img src="/Content/img/header/logo.png" className="logo-img" /></div>
                            }
                        <ul className="tools-links">
                            {
                                !buildings ? <li id="bookmark" onClick={this.toggleBookmark.bind(this)}><i className="iconfont icon-star"></i><div className="iconfont-name">Bookmark</div></li> : null
                            }
                            {
                                !buildings ? <li id="buffer" onClick={this.toggleBuffer.bind(this)}><i className="iconfont icon-buffer"></i><div className="iconfont-name">Buffer</div></li> : null
                            }
                            {
                                !buildings ? <li id="draw" onClick={this.toggleDraw.bind(this)}><i className="iconfont icon-pencil"></i><div className="iconfont-name">Draw</div></li> : null
                            }                         
                            <li id="reset" onClick={this.reset.bind(this)}><i className="iconfont icon-cw-1"></i><div className="iconfont-name">Reset</div></li>
                        </ul>
                    </div>
      
                    <div className="searchbox">
                        <div className="search-wrapper">
                            <span className="search-icon"><i className="iconfont icon-search"></i></span>
                            <input ref='searchInput' id="query-search" className="search-input" placeholder={searchPlaceholder} value={this.state.searchText} onChange={this.onChange.bind(this)} />

                            <div id="locate-me" onClick={this.locateUser.bind(this)}><i className="iconfont icon-locate"></i><div className="iconfont-name">Locate</div></div>

                            <SearchDisplay ref="searchSuggest" setSearchText={this.setSearchText.bind(this)} />

                            <div className="search-icons-div">
                            {
                                this.state.searchText.length > 0 ?
                                        <span className="search-clear-icon" onClick={this.clearSearchResults.bind(this)}></span>
                                    : null
                            }
                            </div>    
                        </div>
                    </div>
                    <div className="right-tools">
                        <ul className="right-links">

                             
                            {
                                //!buildings ? <li id="legend" onClick={this.toggleLegend.bind(this)}><i className="iconfont icon-th-list"></i><div className="iconfont-name">Legend</div></li> : null
                            }   
                            {
                                !buildings ? <li id="dual-screen" onClick={this.toggleDualScreen.bind(this)}><i className="iconfont icon-columns"></i><div className="iconfont-name">Dual</div></li> : null
                            }                           
                            {
                                //<li id="info-list" onClick={this.showMetadata.bind(this)}><i className="iconfont icon-info"></i><div className="iconfont-name">Metadata</div></li>
                            }
                            {
                                //!buildings ? <li id="base-user" onClick={this.toggleUserProfile.bind(this)}><i className="iconfont icon-user"></i><div className="iconfont-name">Profile</div></li> : null
                            }
                            
                            <li id="base-map" onClick={this.toggleBasemapMenu.bind(this)}><i className="iconfont icon-globe"></i><div className="iconfont-name">Basemap</div></li>
                            {
                                this.render3DButton()
                            }             
                           
                        </ul>
                    </div>
                </div>

                <div id="loading-div" className="loading-bar"><i className="icon-spin5 animate-spin"></i></div>
                <div id="dacs-area"><span id="dacs-plotted-cases"></span><span> plotted</span></div>
                {
                    !buildings ? <EsriLeaflet id="map-canvas" mapId={MapConstants.Main} /> : <MapBoxGL id="map-canvas" mapId={MapConstants.Main} />
                } 

                {
                    uiState.dualScreen ? <Dual /> : null
                }

                {
                    uiState.layerInfo ? <LayerInfo info={layerWithInfo.getLayerInfo()} delay={layerWithInfo.getDelay() || 5000} /> : null
                }

                <ReactCSSTransitionGroup transitionName="slidedown" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {
                        (uiState.displayMenu === MenuConstants.Basemap) ?
                        <div className="basemap-gallery basemap-gallery-color">
                            <div className="si-title-wrapper si-title-color">
                                <span className="si-title">Basemap</span>
                                <span id="bm-back" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                            </div>
                                {
                                    !buildings ? 
                                <div className="basemap-gallery-wrapper">
                                    <ul className="gallery-table">
                                        {basemaps.map((basemap,i) => {
                                            return <li key={i}>
                                                <div id="mp14-color"></div>
                                                <div id="mp14-text basemap-text" onClick={this.setBasemap.bind(this, basemap.name)}>
                                                    <div className="mp14-text basemap-text">{basemap.name}</div>
                                                </div>
                                                <div id="mp14-info basemap-info" onClick={this.showBasemapInfo.bind(this, basemap.name)}>
                                                    <div className="mp14-info basemap-info"></div>
                                                </div>
                                            </li>;
                                        })}
                                    </ul>
                                </div> :
                                <div className="basemap-gallery-wrapper">
                                    <ul className="gallery-table">
                                        {basemaps.map((basemap,i) => {
                                            return <li key={i}>
                                                <div id="mp14-color"></div>
                                                <div id="mp14-text basemap-text" onClick={this.setBasemap.bind(this, basemap.name)}>
                                                    <div className="mp14-text basemap-text">{basemap.name}</div>
                                                </div>
                                            </li>;
                                        })}
                                    </ul>
                                </div>
                                }
 
                        </div>
                        : null
                    }
                </ReactCSSTransitionGroup>

                <ReactCSSTransitionGroup transitionName="leftpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(showLeftPanel) && !buildings ? <LeftPanel key="leftpanel" layerFilterText={layerFilterText} /> : null}
                </ReactCSSTransitionGroup>

                <div id='timestamp-holder'>
                    <div id="current-timestamp"></div> <img id='statistics-chart' className='btn' src='Scripts/js/app/exts/hccc/images/24x24/bar-graph1.png' />
                </div>

                {uiState.filter !== FilterState.Hidden ? <FilterBox state={uiState.filter} leftPanelState={showLeftPanel} /> : null}

                <div className="ura-logo"><img src="/Content/img/ura_logo_transparency.png" /></div>
                
                {
                    uiState.displayMenu === MenuConstants.LeftPanelWithSummary ? <LayerSummary /> : null
                }

                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.RightPanel) ? <RightPanel key="rightpanel" /> : null}
                </ReactCSSTransitionGroup>
                    
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Buffer) ? <Buffer key="buffer" /> : null}
                </ReactCSSTransitionGroup>

                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Draw) ? <Draw key="draw" /> : null}
                </ReactCSSTransitionGroup>

                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    { (uiState.displayMenu === MenuConstants.Legend) ? <Legend key="legend" /> : null }
                </ReactCSSTransitionGroup>

                { (uiState.displayMenu === MenuConstants.Modal) ? <Modal display={uiState.modalDisplay} /> : null }
                
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    { (uiState.displayMenu === MenuConstants.Bookmark) ? <Bookmark key="bookmark" /> : null }
                </ReactCSSTransitionGroup>

                <ReactCSSTransitionGroup transitionName="slidedown" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                {
                    (uiState.displayMenu === MenuConstants.UserProfile) ? <UserProfile key="userprofile" onClose={this.closeMenu.bind(this)} username={uiState.username} extranet={uiState.extranet} /> : null
                }
                </ReactCSSTransitionGroup>

                 <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    { (uiState.displayMenu === MenuConstants.GeoTagPhotoDetail) ? <GeoTagPhotoDetail key="geotagphotodetail" /> : null }
                </ReactCSSTransitionGroup>

                <TourGuide />
            </div>
        );
    }
}