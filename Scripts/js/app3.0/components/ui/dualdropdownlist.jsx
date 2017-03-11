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

import Util from 'utils';
import React from 'react';

class DualDropDownList extends React.Component {
 
    render() {
        var title1 = this.props.title1,
            title2 = this.props.title2,
            options1 = Util.listToOptions(this.props.options1, this.props.options1Selected),
            options2 = Util.listToOptions(this.props.options2, this.props.options2Selected),
            onChange1 = this.props.onChange1,
            onChange2 = this.props.onChange2;
        
        if(this.state) {
            if(this.state.options1){
                options1 = Util.listToOptions(this.state.options1, this.props.options1Selected);
            }

            if(this.state.options2){
                options2 = Util.listToOptions(this.state.options2, this.props.options2Selected);
            }
        }

        return (<div>
                <div className="ui_component">
                    <div className="ui_component_label">{title1}</div>
                    <div className="ui-component-select">
                        <select  className="select" key={this.props.key} onChange={onChange1.bind(this)}>{options1}</select>
                    </div>
                </div>
                <div className="ui_component">
                    <div className="ui_component_label">{title2}</div>
                    <div className="ui-component-select">
                        <select  className="select" key={this.props.key}  onChange={onChange2.bind(this)}>{options2}</select>
                    </div>
                </div>
            </div>
        );
    }
}

export default DualDropDownList;