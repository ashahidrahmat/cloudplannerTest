/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : stackedbarchart.jsx
 * DESCRIPTION     : Reactjs component for StackedBarChart of c3.js
 * AUTHOR          : louisz
 * DATE            : Apr 6, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      : The chart will mount only once in the same div,
                     if re-use the same chart by passing different props, it won't update the chartOptions.
                     And hence, there is a need to reset the chartOptions and re-render the chart.
 * CHANGED BY      : jianmin
 * DATE            : Jul 5, 2016
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import Chart from 'components/charts/chart';
import React from 'react';
import {ChartOrientation, ChartPropOptPairs} from 'constants/chartconstants';
import Util from 'utils';
import * as d3 from 'd3';
import c3 from 'c3';

class StackedBarChart extends Chart {

    constructor(props) {
        super(props);
        this.defaultProps = {
            onClickIndex: null
        };

        this.onClickIndexFunct = this.onClickIndexFunct.bind(this)
      
    }

    onClickIndexFunct(evt) {
        let index = this.props.data[0];
        this.props.onClickIndex(index[evt+1]);
    }
   

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

    renderChart(props){
        this.setChartOptions(props);
        this.chart = c3.generate(this.chartOptions);
        this.reloadChartData(props);
        if(props.onClickIndex){
        d3.selectAll('.tick')
            .on('mouseover',function(value,index){ d3.select(this).style("cursor","pointer");})
            .on('click', this.onClickIndexFunct.bind(this) );
        }
        if(props.xaxisColor){
            d3.select('.c3-axis.c3-axis-x').style("fill",props.xaxisColor).style("font-weight","bold");
        }
    }



    setChartOptions(props) {
        this.chartOptions = {
            bindto: this.refs.chart,
            data : {
                x: 'x',
                columns: props.data,
                groups: props.groups,
                type: 'bar',
                labels: props.labels,
                colors: props.chartColor,
                order: props.order,
            },
            size: props.size,
            tooltip: {
                position:props.tooltip_position,
                format: {
                    value: function (value, ratio, id) {
                        var format = id === 'data' ? d3.format(',') : d3.format(props.tooltipPrefix || ',');
                        var formattedValue = props.tooltipPostfix ? value + props.tooltipPostfix : format(value);
                        return formattedValue;
                    }
                }
            },
            transition: {
                duration: 800
            },
            axis: {
                rotated: !(props.orientation !== ChartOrientation.Horizontal),
                x: {
                    type: 'category',
                    label: props.chartAxisXLabel || {},
                },
                y: {
                    tick: {
                        format: (props.axis_y_tick?props.axis_y_tick:(
                            function (y) {
                                return Util.niceNumberFormat(y);
                        }))
                    },
                    min: props.min || null,
                    max: props.max - 2 || null

                       
                    

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
    }

    reloadChartData(props){
        //Ugly hack to fix missing axis for fancybox Modal display
        var t = setTimeout(() => {
            if(this.chart){
                this.chart.load({
                    columns: props.data,
                });
            }
            clearTimeout(t);
        }, 600);
    }

}

export default StackedBarChart;
