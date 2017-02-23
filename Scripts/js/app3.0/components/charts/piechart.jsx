/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : piechart.jsx
 * DESCRIPTION     : Reactjs component for PieChart of c3.js
 * AUTHOR          : louisz
 * DATE            : Apr 6, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      : Refactor to cater to more chartOptions
 * CHANGED BY      : jianmin
 * DATE            : Jul 5, 2016
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import Chart from 'components/charts/chart';
import React from 'react';

import * as d3 from 'd3';
import c3 from 'c3';
import {ChartPropOptPairs} from 'constants/chartconstants';

class PieChart extends Chart {   

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

    renderChart(props){
        this.setChartOptions(props);
        this.chart = c3.generate(this.chartOptions);
    }

    setChartOptions(props){
        this.chartOptions = {
            bindto: this.refs.chart,
            data : {
                columns: props.data,
                type: 'pie',
                empty: props.empty
            },
            tooltip: props.format || {
                format: {
                    value: d3.format(',')
                }
            },
            pie: {
                label: {
                    threshold: 0.04
                }
            },
            transition: {
                duration: 800
            }
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

        if(props.dataColors){
            this.chartOptions.data.colors = props.dataColors;
        }
    
    }
   
}

export default PieChart;
