/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : util.js
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

import Ajax from 'wrapper/ajax';
import BaseStore from 'stores/basestore';
import UrlConstants from 'constants/urlconstants';

class ConfigStore extends BaseStore {
    constructor() {
        super();
        Ajax.call({
            url: '',
            dataType: 'json',
            async: false,
            success: results => {
                Object.keys(results).forEach(key => {
                    this[key] = results[key];
                });
            }
        });
    }
}

var instance = new ConfigStore();

export default instance;