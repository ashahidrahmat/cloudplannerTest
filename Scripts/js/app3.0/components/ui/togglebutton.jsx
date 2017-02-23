/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : dropdownlist.js
 * DESCRIPTION     : DropDownList component
 * AUTHOR          : louisz
 * DATE            : Apr 11, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) title:String (Title of the component)
                        2) options:Array[OptionObject] (List of objects to be translated to the options)
                            + OptionObject:Object ()
                                - title: String (The title to be shown in the option)
                                - value: String/Integer (The value to be captured in the option)
                        3) onChange:Function(event) (the function to call when dropdownlist changes)
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

class ToggleButton extends Button {

    constructor (props) {
        super(props);

        this._selectedClass = props.selectedClass || "tab-btn tab-btn-sel";
        this._unselectedClass = props.unselectedClass || "tab-btn";
    }

    componentWillReceiveProps(nextProps) {
        this._selectedClass = nextProps.selectedClass || "tab-btn tab-btn-sel";
        this._unselectedClass = nextProps.unselectedClass || "tab-btn";
    }

    onClick(evt) {
        let selectedState = !this.props.selected;

        if (this.props.onClick) {   
            this.props.onClick(selectedState);
        }
    }

    getSelected() {
        return this.props.selected;
    }

    getDisabled() {
        return this.props.disabled;
    }

    getBtnClass() {
        return !this.getDisabled() && this.getSelected() ? this._selectedClass : this._unselectedClass;
    }
}

export default ToggleButton;