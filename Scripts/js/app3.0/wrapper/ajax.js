/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : ajax.js
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

import jquery from 'jquery';

 class Ajax {

    wait(xhrArr, success, fail) {
        return jquery.when.apply(jquery, xhrArr).then(success, fail);
    }

    call(opts) {
        return jquery.ajax(opts);
    }

    deferred() {
        return jquery.Deferred();
    }

}

export default new Ajax();
