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
import Util from 'utils';

class ClickableTableCol extends React.Component {
    render() {
        let text = this.props.text,
            onClick = this.props.onClick,
            highlightCol = this.props.highlightCol;
        
        let className = text === '0' ? '' : 'underline';
        onClick = text === '0' ? null : onClick.bind(this);

        text = highlightCol ? text : Util.niceNumberFormat(text);

        return (
             <span className={className} onClick={onClick}>{text}</span>
        );
    }
}

export default ClickableTableCol;
