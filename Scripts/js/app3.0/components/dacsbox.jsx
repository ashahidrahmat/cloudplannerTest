/**-----------------------------------------------------------
 * PROGRAM ID      : dacsbox.jsx
 * DESCRIPTION     : Reactjs component for DACS box info
 * AUTHOR          : jianmin
 * DATE            : Jun 27, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
-----------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
-------------------------------------------------------------------*/
"use strict";

import React from 'react';

class DacsBox extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        };

    }

    render(){
        
        return (
                <div id="dacs-area">
                  <span id="dacs-plotted-cases"></span><span> plotted</span>
                </div>
            );
        
    }
}

export default DacsBox;
