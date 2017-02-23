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

import Highcharts from 'libs/highcharts/4.2.7/highcharts';
import HighchartsMore from 'libs/highcharts/4.2.7/highcharts-more';
HighchartsMore(Highcharts);
window.Highcharts = Highcharts;

class ColumnRangeChart extends Chart {
    static propTypes = {
        title: React.PropTypes.string,
        x: React.PropTypes.arrayOf(React.PropTypes.string),
        data: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    componentDidMount() {
        this.renderChart(this.props);
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.chart) {
            this.chart.xAxis[0].update({
                categories: nextProps.x
            })

            for(var i = this.chart.series.length - 1; i >= 0; i--) {
                this.chart.series[i].remove(false);
            };

            nextProps.data.forEach(row => {
                this.chart.addSeries(row, false);
            });

            this.chart.redraw();
        }
    }

    renderChart(props) {
        this.chart = new Highcharts["Chart"]({
            chart: {
                renderTo: this.refs.chart,
                type: 'columnrange',
                inverted: true
            },

            title: { text: null },

            yAxis: {
                title: { text: 'Timeline' }
            },

            xAxis: {
                categories: this.props.x
            },

            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            legend: {
                enabled: this.props.showLegend || false
            },

            series: this.props.data
        });
    }
}

export default ColumnRangeChart;