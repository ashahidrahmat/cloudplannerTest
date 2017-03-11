/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : appdispatcher.js
 * DESCRIPTION     : 
 * AUTHOR          : louisz
 * DATE            : Dec 17, 2014
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      : Remove native Promise object, not working in IE 11-, use Ajax.deferred.promise instead. 
                     Refactor search functions.
 * CHANGED BY      : jianmin
 * DATE            : Aug 1, 2016
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import L from 'leaflet';
import Esri from 'esri-leaflet';
import Util from 'utils';
import Ajax from 'wrapper/ajax';
import UrlConstants from 'constants/urlconstants';
import FeatureConstants from 'constants/featureconstants';
import EplActionCreator from 'actions/eplactioncreator';
import LayerManagerStore from 'stores/layermanagerstore';
import SearchStore from 'stores/searchstore';
import OneMapAddressSearch from 'search/addresssearch/onemapaddresssearch';
import QueryEngine from 'search/queryengine';
import SpeechStore from 'stores/speechstore';
import LayerSearch from 'search/layersearch';

class SearchActionCreator {

    constructor() {
        // Extend L.esri.Tasks.query

        this.previousSearchText = "";
    }

    search(searchText="") {
        //return empty results []
        if (searchText.length < 3){
            EplActionCreator.search([]);
            return;
        }

        searchText = searchText.trim();
        //prevent empty back space input to trigger search
        if (searchText === this.previousSearchText){
            return;
        }
        this.previousSearchText = searchText;

        //reset
        EplActionCreator.clearSearchResults();

        let AddressSearch = OneMapAddressSearch, //ConfigStore.extranet ? OneMapAddressSearch : iPlanAddressSearch,
            addressSearch = new AddressSearch(searchText),
            layerSearch = new LayerSearch(searchText);

        Ajax.wait([addressSearch.promise, 
                    layerSearch.promise
        ], (address,
            layers) => {
                SearchStore.searchResults = [];
                SearchStore.searchResults = SearchStore.searchResults.concat(address, layers);
                //show no result
                if(!SearchStore.searchResults.length){
                    let noResult = {
                        id: 0,
                        display: 'No results found'
                    };
                    SearchStore.searchResults.push(noResult);
                    SpeechStore.getSpeechState() ? responsiveVoice.speak("This question is beyound the capacity of my brain.") : null;
                    EplActionCreator.offSpeech();
                }
                EplActionCreator.search(SearchStore.searchResults);
            });            
    }
     
}

export default new SearchActionCreator();
