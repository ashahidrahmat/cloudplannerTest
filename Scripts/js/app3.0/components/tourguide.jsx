/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : tourguide.js
 * DESCRIPTION     : Reactjs component for TourGuide
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
"use strict";

import React from 'react';

class TourGuide extends React.Component {
    render () {
        return (
            <div id="tourinfo" className="tourinfo-color">
                <div id="tourinfo-wrapper">
                    <div id="tourinfo-detail">
                        <div id="tourinfo-title">Welcome to ePlanner 2.0</div>
                        <div>This tour will guide you through some of the basic features of ePlanner</div>
                        <div>
                            <button id="start-tour">Start Tour</button>
                            <button id="skip-tour">Skip</button>
                        </div>
                        <input type="checkbox" name="tourinfo-cb" id="tourinfo-cb" value="skip" />
                        <label htmlFor="tourinfo-cb" id="tourinfo-cblabel">Don't show the tour the next time</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default TourGuide;