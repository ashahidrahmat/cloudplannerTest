/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : buttongroup.js
 * DESCRIPTION     : ButtonGroup component
 * AUTHOR          : louisz
 * DATE            : Sep 30, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) title:Array[String] (Title of the buttons)
                        2) onChange:Function(event) (the function to call when dropdownlist changes)
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import React from 'react';

import Button from 'components/ui/button'

export default class ButtonGroup extends React.Component {

    static propTypes = {
        titles: React.PropTypes.arrayOf(React.PropTypes.string),
        onChange: React.PropTypes.func
    }

    constructor (props) {
        super(props);

        this.state = {
            selected: 0
        };
    }

    _onChange(i, evt) {
        this.setState({
            selected: i
        });

        if (this.props.onChange) {
            this.props.onChange(i);
        }
    }

    render() {
        let btnGroup = this.props.titles.map((title, i) => {
            let className = (i === this.state.selected) ? "selected-btn-grp btn-grp btn" : "btn-grp btn";
            return <Button key={i} text={title} onClick={this._onChange.bind(this, i)} class={className} />;
        });

        return (
            <div>{ btnGroup }</div>    
        );
    }
}