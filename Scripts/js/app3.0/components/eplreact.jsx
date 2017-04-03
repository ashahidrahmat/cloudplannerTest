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
import ReactDOM from 'react-dom';
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
import Quicklink from 'components/quicklink/quicklink';
import GeoTagPhotoDetail from 'components/geophoto/geotagphotodetail';
import WebApi from 'webapi';
import PostgresQuery from 'components/postgresquery'
import DesktopBreakpoint from 'components/breakpoints/desktop_breakpoint';
import TabletBreakpoint from 'components/breakpoints/tablet_breakpoint';
import PhoneBreakpoint from 'components/breakpoints/phone_breakpoint';
import {
    Navbar,
    FormGroup,
    FormControl,
    Button,
    ButtonGroup,
    Nav,
    NavItem
} from 'react-bootstrap';
import {Grid, Image} from 'semantic-ui-react';
import $ from 'jquery';
import {Menu,MainButton,ChildButton} from 'react-mfb-custom';
// import ChatBot from 'components/chatbot';
import Util from 'utils';

export default class EplReact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uiState: UiStore.getUiState(),
            searchText: UiStore.getSearchText(),
            speech: SpeechStore.getSpeechState(),
            buildings: false,
            toggleNavButton: false,
            siteInfo: MapStore.getSiteInfo() || Map3DStore.getSiteInfo()
        };

        //don't show default left panel on mobile
        if(Util.isMobile()) {
            this.state.uiState.displayMenu = null;
        }

        this._onUiChange = this._onUiChange.bind(this);
        this._onSpeechChange = this._onSpeechChange.bind(this);
        this._onSiteInfoChange = this._onSiteInfoChange.bind(this);

        WebApi.getOneMapToken();
    }

    componentDidMount() {
        UiStore.addChangeListener(this._onUiChange);
        SpeechStore.addChangeListener(this._onSpeechChange);
        MapStore.addChangeListener(this._onSiteInfoChange);
        Util.logPanelView("Successful Login");
    }

    componentWillUnmount() {
        UiStore.removeChangeListener(this._onUiChange);
        SpeechStore.removeChangeListener(this._onSpeechChange);
        MapStore.removeChangeListener(this._onSiteInfoChange);
    }

    _onSiteInfoChange() {
        var siteInfo = {};

        Map3DStore.isInitialized()
            ? siteInfo = Map3DStore.getSiteInfo()
            : siteInfo = MapStore.getSiteInfo();

        this.setState({siteInfo: siteInfo});
    }

    _onUiChange() {
        this.setState({uiState: UiStore.getUiState(), searchText: UiStore.getSearchText()});
    }

    _onSpeechChange() {
        this.setState({speech: SpeechStore.getSpeechState()});
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
        //hide location
        this.setState({siteInfo: ''});

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
        EplActionCreator.showModal(<Url url={ControllerUrl.Metadata}/>);
    }

    setBasemap(name) {
        EplActionCreator.setBasemap(name);
        Util.logBasemap(name);
    }

    showBasemapInfo(name) {
        var basemap = MapStore.getBasemap(name)
        EplActionCreator.showModal(basemap.getInfo());
    }

    reset() {
        EplActionCreator.reset();
        Util.logPanelView("Reset")
    }

    locateUser() {
        EplActionCreator.locateUser();
        Util.logPanelView("Locate User")
    }

    onChange(event) {
        this.setSearchText(event.target.value);
    }

    setSearchText(text, search = true) {
        EplActionCreator.setSearchText(text);
        if (search) {
            SearchActionCreator.search(text);
            this.refs.searchInput.focus();
        }
    }

    onSpeech() {
        if (typeof webkitSpeechRecognition !== 'undefined') {
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
    onKeyUp(event) {
        EplActionCreator.onKeyUp(event);
    }

    toggle3D(status) {
        this.closeRightMenu();
        if (!status) {
            if(!Util.isMobile()){
                this.toggleLeftPanel();
            }
            this.setState({buildings: false})
            Util.logPanelView("2D");
        } else {
            this.state.uiState.dualScreen = false;
            this.setState({buildings: true})
            Util.logPanelView("3D");
        }
    }

    render3DButton() {
        let button3D = <li id="3d" onClick={this.toggle3D.bind(this)}>
            <i className="iconfont icon-3d-building" style={{
                color: '#4787ed'
            }}></i>
            <div className="iconfont-name">3D</div>

        </li>
        let exit3D = <li id="m3d-exit" onClick={this.toggle3D.bind(this)}>
            <i className="iconfont icon-cancel-circled"></i>
            <div id="m3d-exit" className="iconfont-name">Exit 3D</div>
        </li>

        if (!this.state.buildings) {
            return button3D;
        } else {
            return exit3D;
        }
    }

    toggleChatBot(){
        $(this.refs.chatbot).toggle();
        Util.logPanelView("Chat Bot")
        //EplActionCreator.toggleChatBot();
    }

    togglePostgresQuery(){
        EplActionCreator.togglePostgresQuery();
    }

    render() {
        var basemaps = !this.state.buildings
                ? MapStore.getBasemaps()
                : Map3DStore.getBasemaps(),
            uiState = this.state.uiState,
            showLeftPanel = (uiState.displayMenu === MenuConstants.LeftPanel || uiState.displayMenu === MenuConstants.LeftPanelWithSummary),
            layerFilterText = uiState.layerFilterText,
            speechClass = this.state.speech
                ? "icon-mike-on iconfont icon-mic"
                : "icon-mike-off iconfont icon-mic",
            speechAction = this.state.speech
                ? this.offSpeech.bind(this)
                : this.onSpeech.bind(this),
            searchPlaceholder = this.state.speech
                ? 'Speak into microphone now'
                : 'Search...',
            layerWithInfo = LayerManagerStore.getLatestLayer(),
            buildings = this.state.buildings,
            chatBot = this.state.chatBot,
            mapSwitchBtnText = buildings ? '3D' : '2D';

        const logoSpacing = {
            marginLeft: '15px'
        };

        const containerStyle = {
            width: '20%',
            height: '75%',
            zIndex: '99',
            right:'0px',
            position: 'absolute',
            top: '54px',
            background: 'white',
            minWidth: '300px'
        };

        const iframeStyle = {
            width: '100%',
            height: '100%',
            borderWidth:'0px'
        }

        //hide chatbot at the next tick
        setTimeout(()=>{
            $(this.refs.chatbot).hide();
        },0);

        let addressBarBottom;
        if (this.state.siteInfo.address != null) {
            addressBarBottom = <PhoneBreakpoint>
                <Navbar fixedBottom>
                    <Navbar.Header>
                        <Navbar.Brand style={{
                            height: 'inherit'
                        }}>
                            {this.state.siteInfo.address}
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>
            </PhoneBreakpoint>
        }

        return (
            <div className="map-content">
                {this.state.siteInfo.address != null && <div>{addressBarBottom}</div>}

                <Navbar fluid fixedTop style={{
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid #ddd',
                    }}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#" onClick={this.toggleLeftPanel.bind(this)}>
                                <i className="iconfont icon-menu layer-list"></i>
                            </a>

                            <PhoneBreakpoint>
                                 <div className="searchbox" style = {{position: 'absolute',left: '50px', width:'100%'}}>
                                    <div className="search-wrapper" style={{width:'100%'}}>
                                        <span className="search-icon">
                                            <i className="iconfont icon-search"></i>
                                        </span>
                                        <input style={{height:'50px',width:'80%',maxWidth: 'none', borderWidth: '0px 0px 0px 2px'}} ref='searchInput' id="query-search" className="search-input" placeholder={searchPlaceholder} value={this.state.searchText} onChange={this.onChange.bind(this)}/>

                                        <SearchDisplay style={{top:'51px',width:'84vw'}} ref="searchSuggest" setSearchText={this.setSearchText.bind(this)}/>

                                        <div className="search-icons-div" style={{ right: '8px'}}>
                                            <span className="search-clear-icon" style={{marginRight:'50px', float:'none'}} onClick={this.clearSearchResults.bind(this)}></span>
                                            <div className = "search-speech" onClick = {speechAction}> <i className={speechClass}></i> </div>
                                        </div>
                                    </div>
                                </div>
                            </PhoneBreakpoint>

                            <DesktopBreakpoint>
                            <div className="logo" onClick={this.reset.bind(this)}><img src="/Content/img/devices-icon.png" className="logo-img"/></div>
                                <div className="tools" style={{marginTop: '-14px'}}>
                                    <ul className="tools-links">
                                        {!buildings
                                            && <li id="bookmark" onClick={this.toggleBookmark.bind(this)}>
                                                    <i className="iconfont icon-star"></i>
                                                    <div className="iconfont-name">Bookmark</div>
                                                </li>}
                                        {!buildings
                                            && <li id="buffer" onClick={this.toggleBuffer.bind(this)}>
                                                    <i className="iconfont icon-buffer"></i>
                                                    <div className="iconfont-name">Buffer</div>
                                                </li>
                                        }
                                        {!buildings
                                            && <li id="draw" onClick={this.toggleDraw.bind(this)}>
                                                    <i className="iconfont icon-pencil"></i>
                                                    <div className="iconfont-name">Draw</div>
                                                </li>}
                                        <li id="reset" onClick={this.reset.bind(this)}>
                                            <i className="iconfont icon-cw-1"></i>
                                            <div className="iconfont-name">Reset</div>
                                        </li>
                                    </ul>
                                </div>
                            </DesktopBreakpoint>

                            <DesktopBreakpoint>
                                <div className="searchbox">
                                    <div className="search-wrapper">
                                        <span className="search-icon">
                                            <i className="iconfont icon-search"></i>
                                        </span>
                                        <input ref='searchInput' id="query-search" className="search-input" placeholder={searchPlaceholder} value={this.state.searchText} onChange={this.onChange.bind(this)}/>

                                        <div id="locate-me" onClick={this.locateUser.bind(this)}>
                                            <i className="iconfont icon-locate"></i>
                                            <div className="iconfont-name">Locate</div>
                                        </div>

                                        <SearchDisplay ref="searchSuggest" setSearchText={this.setSearchText.bind(this)}/>

                                        <div className="search-icons-div">
                                            {this.state.searchText.length > 0
                                                && <span className="search-clear-icon" onClick={this.clearSearchResults.bind(this)}></span>}
                                            {<div className = "search-speech" onClick = {
                                                speechAction
                                            }> <i className={speechClass}></i> </div>}
                                        </div>
                                    </div>
                                </div>
                            </DesktopBreakpoint>

                            <DesktopBreakpoint>
                                <div className="right-tools" style={{float:"right"}}>
                                        <ul className="right-links">
                                          <li id="dual-screen" onClick={this.togglePostgresQuery.bind(this)}>
                                                 <i className="iconfont icon-columns"></i>
                                                 <div className="iconfont-name">Postgres</div>
                                             </li>
                                            {!buildings
                                                && <li id="dual-screen" onClick={this.toggleDualScreen.bind(this)}>
                                                        <i className="iconfont icon-columns"></i>
                                                        <div className="iconfont-name">Dual</div>
                                                    </li>
                                            }

                                            {!buildings && <li id="base-map" onClick={this.toggleBasemapMenu.bind(this)}>
                                                <i className="iconfont icon-globe"></i>
                                                <div className="iconfont-name">Basemap</div>
                                            </li>
                                            }
                                            {
                                                !buildings && <li id="base-user" onClick={this.toggleUserProfile.bind(this)}>
                                                    <i className="iconfont icon-user"></i>
                                                    <div className="iconfont-name">Profile</div>
                                                </li>
                                             }
                                        </ul>
                                    </div>
                            </DesktopBreakpoint>
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>

                <div id="loading-div" className="loading-bar">
                    <i className="icon-spin5 animate-spin"></i>
                </div>

                {
                    !buildings ? <EsriLeaflet id="map-canvas" mapId={MapConstants.Main}/> : <MapBoxGL id="map-canvas" mapId={MapConstants.Main}/>
                }

                {
                    uiState.layerInfo &&<LayerInfo info={layerWithInfo.getLayerInfo()} delay={layerWithInfo.getDelay() || 5000}/>
                }

                <ReactCSSTransitionGroup transitionName="slidedown" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Basemap) && !buildings
                        && <div className="basemap-gallery basemap-gallery-color">
                                <div className="si-title-wrapper si-title-color">
                                    <span className="si-title">Basemap</span>
                                    <span id="bm-back" className="right-close-btn right-close-btn-color" onClick={this.closeMenu.bind(this)}>
                                        <i className="icon-cancel-circled"></i>
                                    </span>
                                </div>
                                {!buildings
                                    ? <div className="basemap-gallery-wrapper">
                                            <ul className="gallery-table">
                                                {basemaps.map((basemap, i) => {
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
                                        </div>
                                    : <div className="basemap-gallery-wrapper">
                                        <ul className="gallery-table">
                                            {basemaps.map((basemap, i) => {
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
                 }
                </ReactCSSTransitionGroup>
                {
                    uiState.displayMenu === MenuConstants.Basemap && Util.logPanelView("Basemap")
                }
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {uiState.dualScreen && <Dual/>}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="leftpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {((showLeftPanel) && !buildings)
                        && <LeftPanel key="leftpanel" layerFilterText={layerFilterText}/>}
                </ReactCSSTransitionGroup>
                {uiState.filter !== FilterState.Hidden
                    && <FilterBox state={uiState.filter} leftPanelState={showLeftPanel}/>}
                {uiState.displayMenu === MenuConstants.LeftPanelWithSummary
                    && <LayerSummary/>}
                <DesktopBreakpoint>
                    <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                        {(uiState.displayMenu === MenuConstants.RightPanel)
                            && <RightPanel key="rightpanel"/>}
                    </ReactCSSTransitionGroup>
                </DesktopBreakpoint>
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Buffer)
                        && <Buffer key="buffer"/>
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Draw)
                        && <Draw key="draw"/>}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Legend)
                        && <Legend key="legend"/>}
                </ReactCSSTransitionGroup>
                {(uiState.displayMenu === MenuConstants.Modal)
                    && <Modal display={uiState.modalDisplay}/>}
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Bookmark)
                        &&<Bookmark key="bookmark"/>}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="slidedown" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.UserProfile)
                        && <UserProfile key="userprofile" onClose={this.closeMenu.bind(this)} username={uiState.username} extranet={uiState.extranet}/>
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="slideup" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.ChatBot)
                        && <div style={containerStyle}><iframe style={iframeStyle} src='https://webchat.botframework.com/embed/cookiespam?s=YTXPT_ESNFA.cwA.Wyk.ZHgNMzAl7U3CKgKlFqrnq8lAtKWcTM6acdQ1dBs8S2o'></iframe></div>
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.GeoTagPhotoDetail)
                        && <GeoTagPhotoDetail key="geotagphotodetail"/>
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup transitionName="rightpanel" transitionAppear={true} transitionAppearTimeout={800} transitionEnterTimeout={800} transitionLeaveTimeout={800}>
                    {(uiState.displayMenu === MenuConstants.Postgres)
                        && <PostgresQuery key="postgresquery"/>
                    }
                </ReactCSSTransitionGroup>
                <PhoneBreakpoint>
                    <Menu effect={'zoomin'} method={'click'} position={'br'} style={{position:'absolute'}}>
                        <MainButton ref="fab" iconResting="iconfont icon-cog" iconActive="iconfont icon-cog"/>
                        <ChildButton
                            onClick={this.toggleBuffer.bind(this)}
                            icon="iconfont icon-buffer"
                            label="Buffer"
                        />
                        <ChildButton
                            onClick={this.toggleDraw.bind(this)}
                            icon="iconfont icon-pencil"
                            label="Draw"
                        />
                        <ChildButton
                            onClick={this.toggleBookmark.bind(this)}
                            icon="iconfont icon-star"
                            label="Bookmark"
                        />
                        <ChildButton
                            onClick={this.reset.bind(this)}
                            icon="iconfont icon-cw-1"
                            label="Reset"
                        />
                        <ChildButton
                            onClick={this.toggleUserProfile.bind(this)}
                            icon="iconfont icon-user"
                        />
                        <ChildButton
                            onClick={this.toggleBasemapMenu.bind(this)}
                            icon="iconfont icon-globe"
                        />
                        <ChildButton
                            onClick={this.toggleChatBot.bind(this)}
                            icon="iconfont icon-chat-1"
                        />
                    </Menu>
                </PhoneBreakpoint>
                <div ref="chatbot" className="chatbot" style={containerStyle}><iframe style={iframeStyle} src='https://webchat.botframework.com/embed/cookiespam?s=YTXPT_ESNFA.cwA.Wyk.ZHgNMzAl7U3CKgKlFqrnq8lAtKWcTM6acdQ1dBs8S2o'></iframe></div>
                <div className="chatbot-btn" onClick={this.toggleChatBot.bind(this)}>
                    <i style={{margin:'13px',lineHeight: '4.2'}} className="iconfont icon-chat-1"></i>
                </div>
                <ButtonGroup className="map-switch-btn">
                    <Button onClick={this.toggle3D.bind(this,false)} active={!buildings} style={{outlineStyle: 'none'}}>2D</Button>
                    <Button onClick={this.toggle3D.bind(this,true)} active={buildings} style={{outlineStyle: 'none'}}>3D</Button>
                </ButtonGroup>
            </div>
        );
    }
}
