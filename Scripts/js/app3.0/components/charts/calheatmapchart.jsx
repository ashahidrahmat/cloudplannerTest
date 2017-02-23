/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : selected.js
 * DESCRIPTION     : Reactjs component for LeftPanel
 * AUTHOR          : louisz
 * DATE            : Apr 6, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) Layer name:String - Name of the layer that control will affect
                        2) onSlide:Function(value) - Function to trigger on slide
                        3) Attributes
                            min: The min value of the slider (default - 0)
                            max: The max value of the slider (default - 100)
                            value: The initial value of the slider (default - 80)
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import Chart from 'components/charts/chart';
import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';
import {ChartOrientation} from 'constants/chartconstants';

//import d3js from 'd3';
import CalHeatMap from 'libs/cal-heatmap/v3.5.4/cal-heatmap';

class CalHeatMapChart extends Chart {

    componentDidMount() {
        this.chart = new CalHeatMap();
        this.chart.init({
            itemSelector: this.refs.chart,
            data: this.props.data,
            start: this.props.startDate,
            range: this.props.range,
            verticalOrientation: (this.props.orientation !== ChartOrientation.Horizontal),  //default vertical
            afterLoadData: (data) => {
                var stats = {};
                for (var d in data) {
                    stats[data[d].date] = data[d].value;
                }
                return stats;
            },
            domain: "day",
            subDomain: "hour",
            rowLimit: 1,
            cellSize: 25,
            domainGutter: 2,
            label: {
                position: "left",
                offset: {
                    x: 10,
                    y: 10
                },
                width: 50
            },
            legend: [1, 2, 3, 5],
            legendHorizontalPosition: "right",
            legendVerticalPosition: "top",
        });
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart = this.chart.destroy();
        }
    }
}

export default CalHeatMapChart;