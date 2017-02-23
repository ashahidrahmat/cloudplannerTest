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

export default class EllipsisText extends React.Component {

    constructor() {
        super();
        this.state = {
            showAll: false
        };
    }

    showMore(evt) {
        this.setState({
            showAll: true
        });
    }

    hideText(evt) {
        this.setState({
            showAll: false
        });
    }

    render() {
        let tail = '...',
            more = <div className='ellipsis-text btn' onClick={this.showMore.bind(this)}>(more)</div>,
            less = <div className='ellipsis-text btn' onClick={this.hideText.bind(this)}>(hide)</div>,
            length = this.props.length || 50,
            text = this.props.text;

        if (typeof text === 'string' && text.length > length) {
            text = this.state.showAll ? <div>{text} {less}</div> : <div>{text.slice(0, length) + tail} {more}</div>;
        }

        return (<div>{text}</div>);
    }
}