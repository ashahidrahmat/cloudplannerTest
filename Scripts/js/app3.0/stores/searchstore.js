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


import Ajax from 'wrapper/ajax';
import BaseStore from 'stores/basestore';
import UrlConstants from 'constants/urlconstants';
import EplConstants from 'constants/eplconstants';
import AppDispatcher from 'dispatcher/appdispatcher';

class SearchStore extends BaseStore {

    constructor() {
        super();
        this.searchResults = [];
    }

    getSearchResults() {
        return this.searchResults;
    }

    setResults(searchResults) {
        this.searchResults = searchResults;
    }

}

var instance = new SearchStore();

instance.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case EplConstants.Search:
            instance.setResults(action.results);
            instance.emitChanges();
            break;
        case EplConstants.ClearSearchResults:
            instance.setResults([]);
            instance.emitChanges();
            break;
        default:
            //no op
    }
});

export default instance;
