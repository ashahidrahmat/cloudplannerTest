/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : BookmarkManager.js
 * DESCRIPTION     : static data file for eplanner basemap
 * AUTHOR          : louisz
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

import * as D from 'datejs';

export default class BookmarkManager {
    constructor() { 
        this.regex = new RegExp('', 'i');
    }

    add(name, center, zoom) {
        //current time
        let today = Date.today().setTimeToNow(),
            lat = center.lat,
            lng = center.lng,
            date = today.toString('dd/MM/yyyy'),
            time = today.toString('HH:mm:ss'),
            key = name.replace(/'|"/g, "") + today.toString('HHmmssddMMyyyy'),
            details = [lat, lng, zoom, name, time, date];

        //TODO: add basemap + current layers

        //save data
        localStorage.setItem(key, details.join(";"));
    }

    remove(key) {
        window.localStorage.removeItem(key);
    }

    getBookmarks() {

        let i, key, item,
            bookmarks = [],
            storage = window.localStorage,
            length = storage.length;

        if (storage !== undefined && storage !== null) {
            //loop thru storage and return it in array
            for (i = 0; i < length; i++) {
                key = storage.key(i);
                item = storage.getItem(key).split(";");

                var name = item[3];

                if (this.regex.test(name)) {
                    bookmarks.push({
                        key: key,
                        lat: item[0],
                        lng: item[1],
                        zoom: item[2],
                        name: name,
                        time: item[4],
                        date: item[5]
                    });
                }
            }
        }

        return bookmarks;
    }

    getBookmark(key) {
        let bookmark = window.localStorage.getItem(key),
            item;

        if (bookmark) {
            item = bookmark.split(";");
            item = {
                key: key,
                lat: item[0],
                lng: item[1],
                zoom: item[2],
                name: item[3],
                time: item[4],
                date: item[5]
            }
        }

        return item;
    }

    search(searchText) {
        this.regex = new RegExp(searchText, 'i');
    }

    clearSearch() {
        this.regex = new RegExp('', 'i');
    }
}