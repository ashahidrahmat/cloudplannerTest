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

import d3 from 'libs/d3/3.4.13/d3';

export default class Color {

    range(colors) {
        return d3.scale.linear().range(colors);
    }
}

export default new Color();