/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : profile.js
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

import UrlConstants from 'constants/urlconstants';

export default class Profile {

    constructor(name) {
        this.name = name;
    }

    logout() {
        window.location.href = UrlConstants.Logout;
    }

    getUsername() {
        return this.name;
    }
}