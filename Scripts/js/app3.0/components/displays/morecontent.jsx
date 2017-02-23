/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : morecontent.jsx
 * DESCRIPTION     : Reactjs component to show/hide divs
 * AUTHOR          : liangjs
 * DATE            : Dec 8, 2016
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
import Button from 'components/ui/button';

export default class MoreContent extends React.Component {

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

    hideDivs(evt) {
        this.setState({
            showAll: false
        });
    }

    getState() {
        return this.state;
    }

    render() {
        let before = <div className="oneline">{this.props.before}</div>;
        let after = <div>{this.props.after}</div>;

        let divs = null;
        
        if(this.state.showAll){
            before = <div>{this.props.before}</div>;
            divs = <div>{before}{after}<Button text={"less..."} onClick={this.hideDivs.bind(this)}/></div>;
        } else {
            divs = <div>{before}<Button text={"more..."} onClick={this.showMore.bind(this)} /></div>;
        }
        
        return (<div>{divs}</div>);
    }
}