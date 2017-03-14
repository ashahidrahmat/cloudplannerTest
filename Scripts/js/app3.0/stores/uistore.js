/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layermanager.js
 * DESCRIPTION     : static data file for eplanner basemap
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

import Modal from 'components/modal';
import MapStore from 'stores/mapstore';
import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import MenuConstants, {FilterState} from 'constants/menuconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import EplActionCreator from 'actions/eplactioncreator';
import LayerManagerStore from "stores/layermanagerstore";

class UiStore extends BaseStore {

    constructor(opts) {
        super();

        this.uiState = {
            dualScreen: false,
            displayMenu: MenuConstants.LeftPanel,
            filter: FilterState.Hidden,
            identifyLoading: false,
            modalDisplay: null,
            layerFilterText: '',
            layerInfo: false,
            bufferLoading: false,
            searchtext: ''
        };
    }

    getUiState() {
        return this.uiState;
    }

    getSearchText() {
        return this.uiState.searchtext;
    }

    setSearchText(text){
        this.uiState.searchtext = text;
    }

    getIdentifyLoadingState() {
        return this.uiState.identifyLoading;
    }

    getBufferLoadingState(){
        return this.uiState.bufferLoading;
    }

    toggleGroupMenu(type) {
        let uiState = this.uiState;
        uiState.displayMenu = (uiState.displayMenu === type ? null : type);
    }

    toggleDualScreen() {
        this.uiState.dualScreen = !this.uiState.dualScreen;
    }

    toggleLayerSummaryByLayer(layerName) {
        
        switch (this.uiState.displayMenu) {
            case MenuConstants.LeftPanel:
                this._summaryLayer = layerName;
                this.uiState.displayMenu = MenuConstants.LeftPanelWithSummary;

                setTimeout(function() {
                    EplActionCreator.queryLayerSummary(layerName);
                }, 10);
                
                break;
            case MenuConstants.LeftPanelWithSummary:
                if (this._summaryLayer !== layerName) {
                    this._summaryLayer = layerName;
                    
                    setTimeout(function() {
                        EplActionCreator.queryLayerSummary(layerName);
                    }, 10);

                } else {
                    this.closeLayerSummary();
                }
                break;
        }

    }

    closeLayerSummary() {
        this._summaryLayer = null;
        this.uiState.displayMenu = MenuConstants.LeftPanel;
    }

    openMenu() {
        this.uiState.displayMenu = MenuConstants.LeftPanel;
    }

    closeMenu() {
        this.uiState.displayMenu = null;
    }

    identify() {
        let uiState = this.uiState;
        this.closeMenu();
        uiState.displayMenu = MenuConstants.RightPanel;
        uiState.identifyLoading = true;
        uiState.filter = FilterState.Minimize;
    }

    identifyComplete() {
        this.uiState.identifyLoading = false;
    }

    buffer(){
        this.uiState.bufferLoading = true;
    }

    bufferComplete(){
        this.uiState.bufferLoading = false;
    }

    showModal(modalDisplay) {
        this.uiState.modalDisplay = modalDisplay;
        this.uiState.displayMenu = MenuConstants.Modal;
    }

    hideModal() {
        this.closeMenu();
        //this.identify();
    }

    setShowFilter(bool) {
        var same = (this.uiState.filter !== FilterState.Hidden) !== bool;
        this.uiState.filter = bool ? FilterState.Maximize : FilterState.Hidden;
        return same;
    }

    setFilter(state) {
        this.uiState.filter = state;
    }

    setSearchDataset(layerFilterText) {
        this.uiState.layerFilterText = layerFilterText;
    }

    toggleLayerInfo(bool) {
        let bef = this.uiState.layerInfo;
        this.uiState.layerInfo = bool;
        return bef === bool;
    }

    closeGeoPhotoMenu(){
        this.uiState.displayMenu = MenuConstants.RightPanel;
    }

}

var instance = new UiStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case EplConstants.ToggleDualScreen:
            instance.toggleDualScreen();
            instance.emitChanges();
            break;
        case EplConstants.ToggleBasemap:
            instance.toggleGroupMenu(MenuConstants.Basemap);
            instance.emitChanges();
            break;
        case EplConstants.ToggleDualBasemap:
            AppDispatcher.waitFor([MapStore.dispatchToken]);
            instance.toggleGroupMenu(MenuConstants.Basemap);
            instance.emitChanges();
            break;
        case EplConstants.ToggleUserProfile:
            instance.toggleGroupMenu(MenuConstants.UserProfile);
            instance.emitChanges();
            break;
        case EplConstants.ToggleLeftMenu:
            instance.toggleGroupMenu(MenuConstants.LeftPanel);
            instance.emitChanges();
            break;
        case EplConstants.ToggleLegend:
            instance.toggleGroupMenu(MenuConstants.Legend);
            instance.emitChanges();
            break;
        case EplConstants.ToggleLayerSummary:
            instance.toggleLayerSummaryByLayer(action.layerName);
            instance.emitChanges();
            break;
        case EplConstants.ToggleBookmark:
            instance.toggleGroupMenu(MenuConstants.Bookmark);
            instance.emitChanges();
            break;
        case EplConstants.ToggleBuffer:
            instance.toggleGroupMenu(MenuConstants.Buffer);
            instance.emitChanges();
            break;
        case EplConstants.ToggleDraw:
            instance.toggleGroupMenu(MenuConstants.Draw);
            instance.emitChanges();
            break;
        case EplConstants.CloseMenu:
            instance.closeMenu();
            instance.emitChanges();
            break;
        case EplConstants.CloseLeftMenu:
            instance.closeMenu();
            instance.emitChanges();
            break;
        case EplConstants.CloseRightMenu:
            instance.closeMenu();
            instance.emitChanges();
            break;
        case EplConstants.CloseLayerSummary:
            instance.closeLayerSummary();
            instance.emitChanges();
            break;
        case EplConstants.Identify:
            AppDispatcher.waitFor([MapStore.dispatchToken]);
            instance.identify();
            instance.emitChanges();
            break;
        case EplConstants.IdentifyComplete:
            instance.identifyComplete();
            instance.emitChanges();
            break;
        case EplConstants.SetBasemap:
            instance.closeMenu();
            instance.emitChanges();
            break;
        case EplConstants.ShowModal:
            instance.showModal(action.modalDisplay);
            instance.emitChanges();
            break;
        case EplConstants.HideModal:
            instance.hideModal();
            instance.emitChanges();
            break;
        case EplConstants.ChangePasswordComplete:
            instance.hideModal();
            instance.emitChanges();
            break;
        case EplConstants.Reset:
            AppDispatcher.waitFor([LayerManagerStore.dispatchToken]);
            instance.openMenu();
            instance.setShowFilter(false);
            instance.emitChanges();
            break;
        case EplConstants.AddLayer:
            AppDispatcher.waitFor([LayerManagerStore.dispatchToken]);
            let emitChanges = instance.setShowFilter(LayerManagerStore.hasLayerWithFilter());
            
            if (!instance.toggleLayerInfo(LayerManagerStore.latestLayerHasInfo())) {
                emitChanges = true;
            }

            if (emitChanges) {
                instance.emitChanges();
            }
            break;
        case EplConstants.RemoveLayer:
            AppDispatcher.waitFor([LayerManagerStore.dispatchToken]);
            emitChanges = instance.setShowFilter(LayerManagerStore.hasLayerWithFilter());
            instance.toggleLayerInfo(LayerManagerStore.latestLayerHasInfo());
            instance.emitChanges();
            break;

        case EplConstants.RemoveAllLayers:
            AppDispatcher.waitFor([LayerManagerStore.dispatchToken]);
            if (instance.setShowFilter(false)) {
                instance.emitChanges();
            }
            break;
        case EplConstants.MinimizeFilter:
            instance.setFilter(FilterState.Minimize);
            //instance.emitChanges();
            break;
        case EplConstants.MaximizeFilter:
            instance.setFilter(FilterState.Maximize);
            //instance.emitChanges();
            break;
        case EplConstants.SearchDataset:
            instance.setSearchDataset(action.layerFilterText);
            instance.emitChanges();
            break;
        case EplConstants.HideLayerInfo:
            instance.toggleLayerInfo(false);
            instance.emitChanges();
            break;

        case EplConstants.Buffer:
            instance.buffer();
            instance.emitChanges();
            break;
        case EplConstants.BufferDone:
            instance.bufferComplete();
            instance.emitChanges();
            break;
        case EplConstants.SetSearchText:
            instance.setSearchText(action.text);
            instance.emitChanges();
            break;
        case EplConstants.ToggleGeoTagPhotoDetail:
            instance.toggleGroupMenu(MenuConstants.GeoTagPhotoDetail);
            instance.emitChanges();
            break;
        case EplConstants.GeophotoMenu:
            instance.closeGeoPhotoMenu();
            instance.emitChanges();
            break;
        case EplConstants.ToggleMobileNavBtn:
            instance.toggleGroupMenu(MenuConstants.ToggleMobileNavBtn);
            instance.emitChanges();
            break;
        default:
            //no op
    }
});

export default instance;