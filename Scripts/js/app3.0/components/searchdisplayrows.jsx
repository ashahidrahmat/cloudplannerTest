/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : userprofile.js
 * DESCRIPTION     : Reactjs component for UserProfile
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
import SearchConstants from 'constants/searchconstants';
import EplActionCreator from 'actions/eplactioncreator';
import SearchActionCreator from 'actions/searchactioncreator';
import $ from 'jquery';
import BufferStore from 'stores/bufferstore';
import QueryEngine from 'search/queryengine';
import LayerManagerStore from 'stores/layermanagerstore';
import UiStore from 'stores/uistore';
import MenuConstants, {FilterState} from 'constants/menuconstants';
import SpeechStore from 'stores/speechstore';
import Util from 'utils';

class SearchDisplayRows extends React.Component {

    keyPress(data) {
        const UP_ARROW = 38, DOWN_ARROW = 40, ENTER = 13, ESCAPE = 27;
        var currentRow = -1;
        var tableRows = document.getElementsByClassName("resultsRow");

        //change table cells color and focusing
        function changeCurrentCell(tableRow) {
            tableRow.focus();
            tableRow.style.backgroundColor = "#cbcbcb";
            for (var i = 0 ; i < data.length; i++){
                if (currentRow != i){
                    var deselectedRow = tableRows[i];
                    if (deselectedRow != null) {
                        deselectedRow.blur();
                        deselectedRow.style.backgroundColor = "#ffffff";
                    }
                }
            }
        }

        $('#query-search').off().keydown(function(e){
            if(tableRows.length > 0){
                switch (e.keyCode) {
                    case UP_ARROW:
                        currentRow <= 0 ? currentRow = 0 : currentRow--;
                        changeCurrentCell(tableRows[currentRow]);
                        return false;
                        break;
                    case DOWN_ARROW:
                        currentRow >= data.length - 1 ? currentRow = data.length - 1 : currentRow++;
                        changeCurrentCell(tableRows[currentRow]); 
                        return false;
                        break;
                    case ENTER:
                        tableRows[currentRow] != null ? tableRows[currentRow].click() : null;
                        break;                  
                    case ESCAPE:
                        EplActionCreator.clearSearchResults();
                        break;
                    default:
                        currentRow=-1;
                }
            }
        });
    }

    dataToDisplay(data) {
        var keyword = document.getElementById("query-search").value.toUpperCase();
        
        var tr = data.map(row => {
            var layerName = { __html: row.display.replace(keyword,'<b>' +  keyword  + '</b>') };
            return (<tr key={row.id} className="resultsRow" onClick={this.onClickJitProcessing.bind(this, row)}><td> <span dangerouslySetInnerHTML={layerName} /> </td></tr>);
        });
        this.keyPress(data);
        return <table><tbody>{tr}</tbody></table>;
    }

    onClickJitProcessing(row) {
        Util.logSearch(document.getElementById("query-search").value.toUpperCase(),row.display);

        SpeechStore.clearResults();
        EplActionCreator.clearSearchResults();
        Object.keys(row).map(key => {
            switch (key) {
                case SearchConstants.Replace:
                    this.replace(row[key], row[SearchConstants.Search]); //replace and re-search
                    break;
                case SearchConstants.Identify:
                    EplActionCreator.identify(row[key]);
                    break;
                case SearchConstants.Overlay:
                    EplActionCreator.addLayer(row[key]);
                    break;
                case SearchConstants.Geometry:
                    this.replace(row.display, false);
                    this.highlightZoomCenterMap(row.geometry, row.zoom, row.center);
                    break;
                case SearchConstants.Query:
                    var isBuffered = row.buffers[0].isBuffered;
                    for (var i in row.layers) {
                        EplActionCreator.addLayer(row.layers[i]);                       
                    }
                    if (row.locations.length > 1) {
                        EplActionCreator.fitBounds(row.latlngbounds);
                        EplActionCreator.identify(row.locations[0]);       
                    } else if (row.locations.length == 1) {
                        EplActionCreator.setMapsView(row.latlngbounds.getCenter(),15);
                        isBuffered ? null : EplActionCreator.identify(row.locations[0]);
                    } else {
                        EplActionCreator.setMapsView([1.3607837274175492, 103.8059931081907],12);
                    }
                    if(isBuffered) {
                        BufferStore.setQueried(true);
                        for (var i in LayerManagerStore.getSelected()){
                            if (typeof LayerManagerStore.getSelected()[i].setPostalCodeLayer == 'function') {
                                LayerManagerStore.getSelected()[i].setPostalCodeLayer(); 
                            }
                        }   
                        for (var i = 0; i < row.locations.length; i++) {
                            BufferStore.setRadius(row.buffers[0].radius);
                            BufferStore.pointBufferByCoords(row.locations[i]);
                        }

                        UiStore.getUiState().displayMenu != MenuConstants.Buffer ? EplActionCreator.toggleBuffer() : null;
                    }
                    this.replace(row.display, false);
                    break;
            }
        });
    }

    replace(text, search=true) {
        this.props.setSearchText(text, search);
    }

    highlightZoomCenterMap(geometry, zoom, center) {
        EplActionCreator.highlightZoomCenterMap(geometry, zoom, center);
    }

    render() { 
        //fix duplicate id problem from different search results
        let id = 0, data = this.props.data;
        data.forEach((record) => {
            record.id = id;
            id++;
        });
        var display = this.dataToDisplay(data);
        return (
            <div>{display}</div>
        );
    }
}

export default SearchDisplayRows;
