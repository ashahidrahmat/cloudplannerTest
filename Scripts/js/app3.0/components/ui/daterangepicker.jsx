/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : input.js
 * DESCRIPTION     : DateRangePicker component
 * AUTHOR          : louisz
 * DATE            : Jan 20, 2017
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
import Input from 'components/ui/input';
import ReactDateRangePicker from 'react-bootstrap-daterangepicker';

import moment from 'moment';

export default class DateRangePicker extends React.Component {

    constructor(props) {
        super(props);
        let singleDatePicker = this.props.singleDatePicker || false;
        this.state = {
            singleDatePicker: singleDatePicker,
            startDate: moment(props.startDate),
            endDate: moment(props.endDate)
        }

        this.onApply = this.onApply.bind(this);
    }

    onApply(event, picker) {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate
        });

        if (this.props.onApply) {
            this.props.onApply(event, picker);
        }
    }

    getDateDisplay(start, end) {
        return this.state.singleDatePicker ? start : start + ' - ' + end;
    }

    render() {
        let style = { 
                padding: '6px 6px 6px 36px',
                width: '180px'
            },
            label = this.getDateDisplay(this.state.startDate.format('DD/MM/YYYY'), this.state.endDate.format('DD/MM/YYYY'));
        
        return <ReactDateRangePicker 
            startDate={moment(this.state.startDate)}
            endDate={moment(this.state.endDate)}
            minDate={moment(this.props.minDate)}
            maxDate={moment(this.props.maxDate)}
            drops={this.props.drops}
            singleDatePicker={this.state.singleDatePicker}
            onApply={this.onApply} 
        >
            <div className="date-range-div">
                <i className="date-range-icon icon-calendar" />
                <Input type={"Text"} value={label} style={style}/>
            </div>
		</ReactDateRangePicker>;
    }
}