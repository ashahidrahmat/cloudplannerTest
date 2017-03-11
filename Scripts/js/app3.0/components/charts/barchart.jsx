/**-------------------------------------------------------------------------------
 * PROGRAM ID      : barchart.js
 * DESCRIPTION     : Reactjs component bar chart
 * AUTHOR          : louisz
 * DATE            : Apr 6, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : 
----------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------*/

"use strict";

import Util from 'utils';
import Chart from 'components/charts/chart';
import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';
import {ChartOrientation, ChartPropOptPairs} from 'constants/chartconstants';

//import d3js from 'd3';
import c3 from 'c3';

class BarChart extends Chart {

    constructor(props) {
        super(props);

        this.defaultProps = {
            header: [],
            labels: true
        };
    }

    componentDidMount() {
        this.renderChart(this.props);
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.renderChart(nextProps);
    }

    renderChart(props){
        this.setChartOptions(props);
        this.chart = c3.generate(this.chartOptions);
        //fix bug in axis of fancybox modal display for c3 charts
        //if(props.modal){
            this.reloadChartData(props);
        //}
        if(props.subchart){
            this.chart.zoom([0, 12]);
        }
    }

    setChartOptions(props){
        
        var barColor = props.color ? props.color.color : {};

        var xAxisLabel = props.chartAxisXLabel ?
                         props.chartAxisXLabel : {};

        var yAxis = props.chartAxisY ? 
                    props.chartAxisY : {};

        this.chartOptions = {
            bindto: this.refs.chart,
            data : {
                x: props.x,
                columns: props.data,
                type: 'bar',
                labels: props.labels || {
                    format: function (v, id, i, j) { 
                        return Util.isInt(v) ? Util.formatChartLabelNumber(v) : v;
                    }
                },
                color : barColor,
            },
            transition: {
                duration: 800
            },
            axis: {
                rotated: !(props.orientation !== ChartOrientation.Horizontal),
                x: {
                    type: 'category',
                    categories: props.header,
                    label: xAxisLabel,
                    tick: {
                        multiline: props.multiline
                    }
                },
                y: yAxis
            },
            bar: {
                width: {
                    ratio: 0.7
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

        if(props.colorFunction){
            this.chartOptions.data.color = function (color, d) {
                return props.chartColor[d.index];
            }
        }

        if(props.subchart){
            this.chartOptions.subchart = props.subchart;
        }
        
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

export default BarChart;
