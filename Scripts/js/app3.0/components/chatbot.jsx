
/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : filterbox.js
 * DESCRIPTION     : Reactjs component for Filterbox
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
import EplActionCreator from 'actions/eplactioncreator';
import UiStore from 'stores/uistore';

class ChatBot extends React.Component {


    constructor(opts) {
        super(opts);
    }

    render() {
        let containerStyle = {
            width: '20%',
            height: '70%',
            zIndex: '99',
            right:'0px',
            position: 'absolute',
            top: '55px',
            background: 'white',
            minWidth: '300px'
        };

        let iframeStyle = {
            width: '100%',
            height: '100%',
            borderWidth:'0px'
        }

        return <div style={containerStyle}><iframe style={iframeStyle} src='https://webchat.botframework.com/embed/cookiespam?s=YTXPT_ESNFA.cwA.Wyk.ZHgNMzAl7U3CKgKlFqrnq8lAtKWcTM6acdQ1dBs8S2o'></iframe></div>
    }
}

export default ChatBot;