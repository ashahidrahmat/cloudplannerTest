/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : sankeychart.js
 * DESCRIPTION     : Reactjs component for SankeyChart
 * AUTHOR          : cbenjamin  
 * DATE            : Dec 2, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : Pass in the following attributes:
                        1) Title:String - Title for chart
                        2) ChartSize:Struct - {Width: , Height :}
                        3) Data: 
                    Keyvalue Object {
                            "nodes": [{ "node": 0,
                                        "name": "SAMPLE_node0"
                                        }],
                            "links": { "source": 1,
                                       "target": 3,
                                        "value": 20
                                     }]
                                     };
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

import * as d3 from 'd3';
import d3lib from 'libs/d3/3.4.13/d3';
import * as d3Sankey from 'd3-sankey';
import Chart from 'components/charts/chart';
import React from 'react';

class SankeyChart extends Chart {

    constructor(props) {
        super(props);


        this.defaultProps={
            units:"items"
        };
    }

    componentDidMount(){

        var units = this.props.units;

        var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
               width = 360 - margin.left - margin.right,
               height = 300 - margin.top - margin.bottom,
               dataSAM={};
	   
        if(this.props.data)
        {
            dataSAM = this.props.data;
        }else
        {
            dataSAM = getSampleData();
        }
       
        if(this.props.chartSize)
        {
            if(this.props.chartSize.width)
            {
                width = this.props.chartSize.width - margin.left - margin.right;
            }

            if(this.props.chartSize.height)
            {
                height = this.props.chartSize.height - margin.top - margin.bottom;
            }
        }

        var formatNumber = d3lib.format(",.0f"), // zero decimal places
            format = function (d) {
                return formatNumber(d) + " " + units;
            },
            color = d3lib.scale.category20();

        // append the svg canvas to the page
        var svg = d3lib.select(this.refs.chart).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        var defs = svg.append("defs");

        // Set the sankey diagram properties
        var sankey = d3Sankey.sankey()
            .nodeWidth(17)
            .nodePadding(27)
            .size([width, height]);

   

        var path = sankey.link();

        sankey.nodes(dataSAM.nodes).links(dataSAM.links).layout(32);

        // define utility functions
        function getGradID(d){
            return "linkGrad-" + d.source.name + "-" + d.target.name;
        }
        function nodeColor(d) { 
            return d.color = color(d.name.replace(/ .*/, ""));
        }

        // create gradients for the links
        var grads = defs.selectAll("linearGradient")
                .data(dataSAM.links, getGradID);

        grads.enter().append("linearGradient")
                .attr("id", getGradID)
                .attr("gradientUnits", "userSpaceOnUse");

        function positionGrads() {
            grads.attr("x1", function(d){return d.source.x;})
                .attr("y1", function(d){return d.source.y;})
                .attr("x2", function(d){return d.target.x;})
                .attr("y2", function(d){return d.target.y;});
        }
        positionGrads();

        grads.html("") //erase any existing <stop> elements on update
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", function(d){
                return nodeColor( (+d.source.x <= +d.target.x)? 
                                 d.source: d.target) ;
            });

        grads.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", function(d){
                return nodeColor( (+d.source.x > +d.target.x)? 
                                 d.source: d.target) 
            });

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(dataSAM.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function(d){
                return "url(#" + getGradID(d) + ")";
            })
            .style("stroke-opacity", "0.4")
            .on("mouseover", function() { d3lib.select(this).style("stroke-opacity", "0.7") } )
            .on("mouseout", function() { d3lib.select(this).style("stroke-opacity", "0.4") } )
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            });

        // add the link titles
        link.append("title")
            .text(function (d) {
                return "From " + d.source.name + " to " + d.target.name + "\n" + format(d.value);
            });

            /*

        var linktext = svg.append("g").selectAll(".link")
     .data(dataSAM.links)
   .enter().append("path")
   .append("text").attr('class','linkText')
            .attr("d", path)
     // .attr("x", function(d) { return d.source.x + (d.target.x - d.source.x) / 2; })
    // .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y) / 2; })
    // .attr("dy", ".35em")
     .attr("text-anchor", "end")
     //.attr("transform", null)
     .text(function(d) { return format(d.value); })
     .attr("text-anchor", "start")
     .style('fill','black');
     */

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(dataSAM.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
         
     
                 
             

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("fill-opacity", ".9")
            .style("shape-rendering", "crispEdges")
            .style("stroke", function (d) {
                return d3lib.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("text-shadow", "0 1px 0 #fff")
            .attr("transform", null)
            .text(function (d) {
                return d.name;
            })
            .filter(function (d) {
                return d.x < width / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

       


        function getSampleData() {
            return {
                "nodes": [{
                    "node": 0,
                    "name": "SAMPLE_node0"
                }, {
                    "node": 1,
                    "name": "SAMPLE_node1"
                }, {
                    "node": 2,
                    "name": "SAMPLE_node2"
                }, {
                    "node": 3,
                    "name": "SAMPLE_node3"
                }],
                "links": [{
                    "source": 0,
                    "target": 2,
                    "value": 22
                }, {
                    "source": 1,
                    "target": 2,
                    "value": 5
                }, {
                    "source": 1,
                    "target": 3,
                    "value": 20
                }]};
        }


    }

    componentWillUnmount() {
        d3lib.select(this.refs.chart).remove();
    }

}
export default SankeyChart;