
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
import {ChartOrientation, ChartPropOptPairs} from 'constants/chartconstants';
import * as d3 from 'd3';
import c3 from 'c3';

class LineChart extends Chart {

    componentDidMount() {
        this.renderChart(this.props);  
    }

    componentWillUnmount() {
        if(this.chart){
            this.chart.destroy();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.renderChart(nextProps);
    }

    setChartOptions(props){
        this.chartOptions = {
            bindto: this.refs.chart,
            data : {
                x: 'x',
                xFormat: props.xFormat,
                columns: props.data,
                type: 'line',
                labels: props.labels || false
            },
            color: {
                pattern: ['#ED2939', '#0000FF',"orange"]
            },
            axis: this.props.axis
        };

        //assign chart options if any
        for(var index in ChartPropOptPairs){
            var pair = ChartPropOptPairs[index];
            var prop = pair.prop;
            var opt = pair.opt;
            if(props[prop] && opt){
                this.chartOptions[opt] = props[prop];
            }
        }
    }

    renderChart(props){
        this.setChartOptions(props);
        this.chart = c3.generate(this.chartOptions);
        this.reloadChartData(props);
    }

    reloadChartData(props){
        //try to fix missing x, y Axis in fancybox
        let t = setTimeout(() => { 
            if(this.chart){
                this.chart.load({
                    columns: props.data
                });
            }
            clearTimeout(t);
        }, 900);
    }


}

export default LineChart;