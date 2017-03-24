
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
//import { Chat } from 'botframework-webchat';
//import uuid from 'uuid';

class ChatBot extends React.Component {

    constructor() {
        super();
        this.state = {
            showAll: false
        };
        //this.id = uuid.v4();
    }

    showMore(evt) {
        this.setState({
            showAll: true
        });
    }

    hideDivs(evt) {
        this.setState({
            showAll: false
        });
    }

    getState() {
        return this.state;
    }

    render() {
        let divs = null;

        let containerStyle = {
            width: '20%',
            height: '75%',
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
        
        if(this.state.showAll){
            divs = <iframe style={iframeStyle} src='https://webchat.botframework.com/embed/cookiespam?s=YTXPT_ESNFA.cwA.Wyk.ZHgNMzAl7U3CKgKlFqrnq8lAtKWcTM6acdQ1dBs8S2o'></iframe>
        } else {
            divs = <iframe style={iframeStyle} src='https://webchat.botframework.com/embed/cookiespam?s=YTXPT_ESNFA.cwA.Wyk.ZHgNMzAl7U3CKgKlFqrnq8lAtKWcTM6acdQ1dBs8S2o'></iframe>
        }
        
        return (<div>{divs}</div>);
    }
}

export default ChatBot;

//<iframe style={iframeStyle} src='https://webchat.botframework.com/embed/cookiespam?s=YTXPT_ESNFA.cwA.Wyk.ZHgNMzAl7U3CKgKlFqrnq8lAtKWcTM6acdQ1dBs8S2o'></iframe>
//<Chat directLine={{ secret: "MYTAsrJRpRY.cwA.Rtc.gjVLBuThZsa15y2ysd_LGRQL6u6d1KQEzQX4yT-dfvs" }} user={{ id: this.id, name: 'Me' }}/>
