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

import * as d3 from 'd3';
import c3 from 'c3';
import {ChartPropOptPairs} from 'constants/chartconstants';

class DonutChart extends Chart {

    componentDidMount() {
        
        if(this.props.data) {
            var chartOptions = {
                bindto: this.refs.chart,
                data : {
                    columns: this.props.data,
                    type: 'donut',
                    colors: this.props.chartColor
                },
                tooltip: {
                    format: {
                        value: d3.format(',')
                    }
                },
                transition: {
                    duration: 800
                },
                donut: {
                    title: this.props.donutTitle
                }
            };

            //assign chart options if any
            for(var index in ChartPropOptPairs){
                var pair = ChartPropOptPairs[index];
                var prop = pair.prop;
                var opt = pair.opt;
                if(this.props[prop] && opt){
                    chartOptions[opt] = this.props[prop];
                    
                }
            }

            this.chart = c3.generate(chartOptions);
        }
    }

    componentWillUnmount() {
        if (this.chart){
            this.chart.destroy();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            let opts = {
                unload: true,
                type: 'donut',
                columns: nextProps.data
            };

            if (nextProps.chartColor) {
                opts.colors = nextProps.chartColor;
            }

            this.chart.load(opts);

            d3.select(this.refs.chart).select(".c3-chart-arcs-title").node().innerHTML = nextProps.donutTitle;
        }
    }
}

export default DonutChart;