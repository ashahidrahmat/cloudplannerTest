/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : eplaction.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
 * DATE            : Feb 03, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG  	   :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import WebApi from 'webapi';
import MapStore from 'stores/mapstore';
import EplConstants from 'constants/eplconstants';
import MenuConstants from 'constants/menuconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import Util from 'utils';

class EplActionCreator {

    setBasemap(basemapName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SetBasemap,
            basemapName: basemapName
        });
    }

    showModal(modalDisplay) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ShowModal,
            modalDisplay: modalDisplay
        });
    }

    hideModal() {
        AppDispatcher.dispatch({
            actionType: EplConstants.HideModal
        });
    }

    reset() {
        AppDispatcher.dispatch({
            actionType: EplConstants.Reset
        });
    }

    resetMapSize() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ResetMapSize
        });
    }

    locateUser() {
        AppDispatcher.dispatch({
            actionType: EplConstants.LocateUser
        });
    }

    toggleLeftPanel() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleLeftMenu
        });
    }

    toggleDualScreen() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleDualScreen
        });
    }

    toggleUserProfile() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleUserProfile
        });
    }

    toggleBasemap() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleBasemap
        });
    }

    toggleDualBasemap() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleDualBasemap
        });
    }

    toggleLegend() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleLegend
        });
    }

    toggleBookmark() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleBookmark
        });
    }

    toggleBuffer() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleBuffer
        });
    }

    toggleDraw() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleDraw
        });
    }

    closeLeftPanel() {
        AppDispatcher.dispatch({
            actionType: EplConstants.CloseLeftMenu
        });
    }

    closeRightPanel() {
        AppDispatcher.dispatch({
            actionType: EplConstants.CloseRightMenu
        });
    }

    closeMenu() {
        AppDispatcher.dispatch({
            actionType: EplConstants.CloseMenu
        });
    }

    logout() {
        AppDispatcher.dispatch({
            actionType: EplConstants.Logout
        });
    }

    addLayer(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.AddLayer,
            layerName: layerName
        });
    }

    removeLayer(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.RemoveLayer,
            layerName: layerName
        });
    }

    removeAllLayers() {
        AppDispatcher.dispatch({
            actionType: EplConstants.RemoveAllLayers
        });
    }

    reorderLayer(order) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ReorderLayer,
            order: order
        });
    }

    toggleLayerSummary(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleLayerSummary,
            layerName: layerName
        });
    }

    retrieveSummaryComplete() {
        AppDispatcher.dispatch({
            actionType: EplConstants.RetrieveSummaryComplete
        });
    }

    closeLayerSummaryPanel() {
        AppDispatcher.dispatch({
            actionType: EplConstants.CloseLayerSummary
        });
    }

    showLayerStatistics(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ShowLayerStatistics,
            layerName: layerName
        });
    }

    hideInfoLayer() {
        AppDispatcher.dispatch({
            actionType: EplConstants.HideInfoLayer
        });
    }

    search(results) {
        AppDispatcher.dispatch({
            actionType: EplConstants.Search,
            results: results
        });
    }

    clearSearchResults() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ClearSearchResults
        });
    }

    identify(latLng) {
        WebApi.querySiteInfo(latLng);
        Util.setIdentifyPoint(latLng);

        AppDispatcher.dispatch({
            actionType: EplConstants.Identify,
            latLng: latLng
        });
    }

    identifyComplete() {
        AppDispatcher.dispatch({
            actionType: EplConstants.IdentifyComplete
        });
    }

    removeIdentifyMarker() {
        AppDispatcher.dispatch({
            actionType: EplConstants.RemoveIdentifyMarker
        });
    }

    loadModal(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.LoadModal,
            layerName: layerName
        });
    }

    loadModalComplete(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.LoadModalComplete,
            layerName: layerName
        });
    }

    displayMessage(message) {
        console.log(message);
        AppDispatcher.dispatch({
            actionType: EplConstants.DisplayMessage,
            message: message
        });
    }

    highlightZoomCenterMap(geometry, zoom, center) {
        AppDispatcher.dispatch({
            actionType: EplConstants.HighlightZoomCenterMap,
            geometry: geometry,
            zoom: zoom,
            center: center
        });
    }

    searchDataset(layerFilterText) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SearchDataset,
            layerFilterText: layerFilterText
        });
    }

    addBookmark(name) {
        var center = MapStore.getCenter(),
            zoom = MapStore.getZoom();

        AppDispatcher.dispatch({
            actionType: EplConstants.AddBookmark,
            name: name,
            center: center,
            zoom,
            zoom
        });
    }

    removeBookmark(key) {
        AppDispatcher.dispatch({
            actionType: EplConstants.RemoveBookmark,
            key: key
        });
    }

    searchBookmark(searchText) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SearchBookmark,
            searchText: searchText
        });
    }

    setLayerOpacity(layerName, value) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SetLayerOpacity,
            layerName: layerName,
            value: value
        });
    }

    minimizeFilter() {
        AppDispatcher.dispatch({
            actionType: EplConstants.MinimizeFilter
        });
    }

    maximizeFilter() {
        AppDispatcher.dispatch({
            actionType: EplConstants.MaximizeFilter
        });
    }

    refreshDisplay() {
        AppDispatcher.dispatch({
            actionType: EplConstants.RefreshDisplay
        });
    }

    queryLayerSummary(layerName) {
        AppDispatcher.dispatch({
            actionType: EplConstants.QueryLayerSummary,
            layerName: layerName
        });
    }

    querySiteInfoComplete(results) {
        AppDispatcher.dispatch({
            actionType: EplConstants.QuerySiteInfoComplete,
            results: results
        });
    }

    drawMarker() {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawMarker
        });
    }

    drawPolygon() {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawPolygon
        });
    }

    drawLine() {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawLine
        });
    }

    drawRectangle() {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawRectangle
        });
    }

    drawCircle() {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawCircle
        });
    }

    drawStreetViewMarker() {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawStreetViewMarker
        });
    }

    updateDrawnItemColor(colorId) {
        AppDispatcher.dispatch({
            actionType: EplConstants.UpdateDrawnItemColor,
            colorId: colorId

        });
    }

    clearDrawing() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ClearDrawing
        });
    }

    drawDone(result) {
        AppDispatcher.dispatch({
            actionType: EplConstants.DrawDone,
            result: result
        });
    }

    buffer() {
        AppDispatcher.dispatch({
            actionType: EplConstants.Buffer
        });
    }

    pointBuffer() {
        AppDispatcher.dispatch({
            actionType: EplConstants.PointBuffer
        });
    }

    polygonBuffer() {
        AppDispatcher.dispatch({
            actionType: EplConstants.PolygonBuffer
        });
    }

    exportCSV(layerName, data) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ExportCSV,
            layerName: layerName,
            data: data
        });
    }

    exportChart(layerName, data) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ExportChart,
            layerName: layerName,
            data: data
        });
    }

    addFeatureCollection(layerName, data) {
        AppDispatcher.dispatch({
            actionType: EplConstants.AddFeatureCollection,
            layerName: layerName,
            data: data
        });
    }

    bufferDone() {
        AppDispatcher.dispatch({
            actionType: EplConstants.BufferDone
        });
    }

    bufferSliderChange(value) {
        AppDispatcher.dispatch({
            actionType: EplConstants.BufferSliderChange,
            value: value
        });
    }

    clearBuffer() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ClearBuffer
        });
    }

    clearHighlights() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ClearHighlights
        });
    }

    changePassword(oldPassword, newPassword, confirmPassword) {
        WebApi.changePassword(oldPassword, newPassword, confirmPassword);

        AppDispatcher.dispatch({
            actionType: EplConstants.ChangePassword
        });
    }

    changePasswordComplete() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ChangePasswordComplete
        });
    }

    hideLayerInfo() {
        AppDispatcher.dispatch({
            actionType: EplConstants.HideLayerInfo
        });
    }

    onSpeech() {
        AppDispatcher.dispatch({
            actionType: EplConstants.OnSpeech
        });
    }

    offSpeech() {
        AppDispatcher.dispatch({
            actionType: EplConstants.OffSpeech
        });
    }

    setSearchText(text) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SetSearchText,
            text: text
        });
    }

    setMapsView(center, zoom) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SetMapsView,
            center: center,
            zoom: zoom
        });
    }

    fitBounds(bounds) {
        AppDispatcher.dispatch({
            actionType: EplConstants.FitBounds,
            bounds: bounds
        });
    }

    selectQuickLinkBtn(selectedBtn) {
        AppDispatcher.dispatch({
            actionType: EplConstants.SelectQuickLinkBtn,
            selectedBtn: selectedBtn
        });
    }

    toggleGeoPhotoQuicklink() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleGeoPhotoQuicklink
        });
    }

    toggleGeoTagPhotoDetail() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleGeoTagPhotoDetail
        });
    }

    closeGeoPhotoMenu() {
        AppDispatcher.dispatch({
            actionType: EplConstants.GeophotoMenu
        });
    }

    updateNearbyJsonData(data) {
        AppDispatcher.dispatch({
            actionType: EplConstants.UpdateNearbyJsonData,
            updateData: data
        });
    }


    customGeoPhotoData(customData) {
        AppDispatcher.dispatch({
            actionType: EplConstants.CustomGeoPhotoData,
            customData: customData
        });
    }

    clearPhotoTempMarker(customData) {
        AppDispatcher.dispatch({
            actionType: EplConstants.ClearPhotoTempMarker,
            customData: customData
        });
    }

    toggleMobileNavBtn() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleMobileNavBtn
        });
    }

    toggleChatBot() {
        AppDispatcher.dispatch({
            actionType: EplConstants.ToggleChatBot
        });
    }

    togglePostgresQuery(){
      AppDispatcher.dispatch({
          actionType: EplConstants.TogglePostgresQuery
      });
    }

    dynamicQuery(customData){
      AppDispatcher.dispatch({
          actionType: EplConstants.DynamicQuery,
          customData: customData
      });
    }
}

export default new EplActionCreator();
