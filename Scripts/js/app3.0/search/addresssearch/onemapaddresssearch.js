/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : addresssearch.js
 * DESCRIPTION     : OneMap address search API
 * AUTHOR          : jianmin
 * DATE            : Jul 29, 2016
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
import UrlConstants from 'constants/urlconstants';
import SearchStore from 'stores/searchstore';
import AddressSearch from 'search/addresssearch';
import Util from 'util';

export default class OneMapAddressSearch extends AddressSearch {

    searchPromise(){
        this.url = UrlConstants.OneMapSearch;
        let ajaxUrl = Util.appendUrlWithParams(this.url, {
            searchVal: this.searchText,
            returnGeom: "Y",
            getAddrDetails: "Y"
        });
        let callback = data => {
            var results = data.results;
                results = results.map((row, i) => {
                    let coord = [parseFloat(row.LATITUDE), parseFloat(row.LONGITUDE)];
                    return {
                        id: i,
                        zoom: 17,
                        center: coord,
                        display: row.SEARCHVAL + ", " + row.ADDRESS,
                        geometry: Util.toPointObject(...coord)
                    };
                });

            this.deferred.resolve(results);
        };

        let ajaxOptions = {
                url: ajaxUrl,
                crossDomain: true,
                dataType: 'json',
                success: callback,
                error: (error) => {
                    this.deferred.resolve([]);
                }
            };

         Ajax.call(ajaxOptions);

        return this.deferred.promise();
    }

}