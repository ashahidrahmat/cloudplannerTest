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

//Warning: Only this version is supported for current BubbleChart
import d3 from 'libs/d3/3.4.13/d3';

class BubbleChart extends Chart {

    componentDidMount() {
        var data = this.props.data,
            diameter = 700,
            format = d3.format(",d"),
            color = d3.scale.category20c();

        var bubble = d3.layout.pack()
            .sort(function (a, b) {
                return -(a.value - b.value);
            })
            .size([diameter, diameter])
            .padding(3);

        var svg = d3.select(this.refs.chart).append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        var node = svg.selectAll(".node")
              .data(bubble.nodes(this.processData(data))
              .filter(function (d) { return !d.children; }))
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function (d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) { return color(d.packageName); });

        node.append("text")
            .attr("dy", "-0.5em")
            .style("text-anchor", "middle")
            .style("font", "10px sans-serif")
            .text(function (d) {

                return d.className.substring(0, d.r / 3);
            });

        node.append("text")
           .attr("dy", "1em")
           .style("text-anchor", "middle")
           .style("font", "12px sans-serif")
           .text(function (d) {
               return d.value;
           });
    }

    processData(data) {
        var r = [];
        var d = data;

        d.forEach(function (row) {
            r.push({ packageName: row.name, className: row.name, value: row.size });
        });

        return { children: r };
    }

    componentWillUnmount() {
        d3.select(this.refs.chart).remove();
    }
}

export default BubbleChart;