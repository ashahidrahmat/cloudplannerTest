/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : Reactjs component for 1 layer on the LeftPanel
 * AUTHOR          : louisz
 * DATE            : Jan 6, 2016
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

class Img extends React.Component {
    render() {
        var url = this.props.src,
            width = this.props.width || '100%',
            height = this.props.height || '100%';
        var imageCss = {
            textAlign:'center'
        };
        
        return (<div style={imageCss}>
                    <img src={url} width={width} height={height} />
                </div>);
        
    }
}

export default Img;