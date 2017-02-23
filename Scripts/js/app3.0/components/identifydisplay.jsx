/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : searchdisplay.js
 * DESCRIPTION     : Reactjs component for UserProfile
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
import IdentifyDisplayRows from 'components/identifydisplayrows';

class IdentifyDisplay extends React.Component {

    selectedToDisplay(selected) {
        return selected.map((layer,i) => {
            let showData = (i === this.props.showId);
            return <IdentifyDisplayRows key={i} layer={layer} showData={showData} onRowClick={this.props.onRowClick(i)} exportCSV={layer.defaultSettings.exportCSV} />
        });
    }

    render() {
        var identifyDisplay = this.selectedToDisplay(this.props.selected);

        return (<div>{identifyDisplay}</div>);
    }
}

export default IdentifyDisplay;