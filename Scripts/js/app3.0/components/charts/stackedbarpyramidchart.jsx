/**-------------------------------------------------------------------------------
 * PROGRAM ID      : stackedbarwithnegativechart.js
 * DESCRIPTION     : Reactjs component bar chart
 * AUTHOR          : jianmin
 * DATE            : Jun 16, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     : stackedbar chart with negative numbers, e.g population pyramid
 * COMMENTS        : 
----------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------*/

"use strict";

import Chart from 'components/charts/chart';
import React from 'react';
import {ChartOrientation, ChartPropOptPairs} from 'constants/chartconstants';

import * as d3 from 'd3';
import c3 from 'c3';

class StackedBarPyramidChart extends Chart {

    componentDidMount() {
        this.renderChart(this.props);
    }

    componentWillUnmount() {
        if(this.chart){
            this.chart.destroy();
        }
    }
    
    //reset chartOptions by nextProps, otherwise chartOptions won't change
    componentWillReceiveProps(nextProps) {
        this.renderChart(nextProps);
    }

    setChartOptions(props){
        this.chartOptions = {
            bindto: this.refs.chart,
            data : {
                columns: props.data,
                groups: props.groups,
                type: 'bar',
                order: 'null'
            },
            tooltip: {
                format: {
                    value:  function (value, ratio, id, index) { 
                        value = +value;
                        value = (value == -0) ? 0 : value;
                        value = value >= 0 ? value : -1 * value;
                        if(props.maskData && value < 10){
                            return '< 10';
                        }else{
                            return d3.format(',d')(value);
                        }
                    }
                }
            },
            grid: {
                y: {
                    lines: [{value:0}]
                }
            },
            transition: {
                duration: 800
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category',
                    categories: props.categories
                },
                y: {
                    tick: {
                        format: function(value){
                            value = value > 0 ? value : (-1 * value);
                            return d3.format(',')(value);
                        }
                    }
                }
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
        //hide y axis
        if(props.maskData){
            this.chartOptions.axis.y.show = false;
        }

    }

    renderChart(props){
        this.setChartOptions(props);
        this.chart = c3.generate(this.chartOptions);
        //if(props.modal){
            this.reloadChartData(props);
        //}
    }

    reloadChartData(props){
        //fix missing axis
        var t= setTimeout(() => { 
            if(this.chart && props.data){
                this.chart.load({
                    columns: props.data,
                });
            }
            clearTimeout(t);
        }, 900);
    }

}

export default StackedBarPyramidChart;
