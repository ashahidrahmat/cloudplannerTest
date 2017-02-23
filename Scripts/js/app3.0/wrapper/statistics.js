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

import ss from 'simple-statistics';

export default class Statistics {

    ckmeans(data, numOfClasses) {
        return ss.ckmeans(data, numOfClasses);
    }
}

export default new Statistics();