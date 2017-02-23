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

import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import MenuConstants from 'constants/menuconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import BookmarkManager from 'bookmarkmanager';

class BookmarkStore extends BaseStore {

    constructor() {
        super();

        this.manager = new BookmarkManager();
    }

    getBookmarks() {
        return this.manager.getBookmarks();
    }

    getBookmark(key) {
        return this.manager.getBookmark(key);
    }

    addBookmark(name, center, zoom) {
        this.manager.add(name, center, zoom);
    }

    removeBookmark(key) {
        this.manager.remove(key);
    }

    search(searchText) {
        this.manager.search(searchText);
    }

    clearSearch() {
        this.manager.clearSearch();
    }
}

var instance = new BookmarkStore();

instance.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case EplConstants.AddBookmark:
            instance.addBookmark(action.name, action.center, action.zoom);
            instance.emitChanges();
            break;
        case EplConstants.RemoveBookmark:
            instance.removeBookmark(action.key);
            instance.emitChanges();
            break;
        case EplConstants.SearchBookmark:
            instance.search(action.searchText);
            instance.emitChanges();
            break;
        default:
            //no op
    }
});

export default instance;