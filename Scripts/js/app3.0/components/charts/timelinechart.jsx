
/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : 
 * DESCRIPTION     : Reactjs component for Timeline chart
 * AUTHOR          : liangjs
 * DATE            : Dec 12, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     : props must minimumly have the following properties
                            {
                                start : date (string or Data obj)
                                end : date
                            }

 * COMMENTS        : 
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
import vis from 'vis';
import $ from 'jquery';
import EplActionCreator from 'actions/eplactioncreator';
import Util from 'util';

class TimelineChart extends Chart {
    static propTypes = {
        title: React.PropTypes.string,
        x: React.PropTypes.arrayOf(React.PropTypes.string),
        data: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            info : null,
            legend: null
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
        if (this.chart) {
            this.renderChart(nextProps);
        }
    }

    renderChart(props) {
        var items = [],
            groups = [],
            itemColors = [];

        //set groups
        if(props.group){
            for(var i = 0; i< props.group.length; i++){
                groups.push({ id: props.group[i], content: props.group[i] });
            }
        }

        //set items
        for (var i = 0; i < props.data.length; i++){
            var itemData = {id: i, start: props.data[i].start.toString(), end: props.data[i].end.toString()}

            if(props.group){
                itemData.group = props.data[i].category;
            } 

            if(props.data[i].typeOf){
                itemData.className = props.data[i].typeOf;
                if (itemColors.indexOf(props.data[i].typeOf) < 0) {
                    itemColors.push({className: props.data[i].typeOf, color: props.data[i].color});
                }
            }

            items.push(itemData);
        }

        this.itemColors = itemColors;
        items = new vis.DataSet(items);
       
        // Configuration for the Timeline
        var options = this.props.options || {        
            moveable: false,
            zoomable: false,
            showCurrentTime: false,
            clickToUse: true,
            timeAxis: {scale: 'year', step: 2}        
        };

        //create chart object else redraw it
        if(!this.chart){
            this.chart = new vis.Timeline(this.refs.chart,items,groups,options); 
            this.chart.fit();

            this.selectedID = null;
            this.chart.on('select', (properties) => {
                if (this.itemColors) {
                    this.setHighlight(this.itemColors);

                    //set selectedID to workaround event firing off multiple times
                    if (properties.items[0] != this.selectedID && this.state.data[properties.items[0]]) {
                        var data = this.state.data[properties.items[0]];

                        this.selectedID = properties.items[0];

                        if(data.info){                       
                            this.setState({
                                info: data.info
                            });
                        } else {
                            this.setState({
                                info: null
                            });
                        }

                        if(data.geometry){
                            this.highlightZoomCenterMap(data.geometry);
                        }
                    } 
                }
            });

        } else {
            this.chart.setData({
                groups: groups,
                items: items
            })
            this.chart.setOptions(options);  
            this.chart.redraw();
            this.chart.fit();
        }     

        //set item color
        for (var i = 0; i < itemColors.length; i++){
            this.setItemColors(itemColors[i].className, itemColors[i].color, itemColors[i].category); 
        }

        if(props.legend){
            this.setState({
                legend: this.renderLegend(itemColors)
            });
        }

        if(props.onSelect){
            //try to get first item on timeline   
            var first = this.chart.getVisibleItems()[0] || 0;
            
            this.chart.setSelection(first);
            this.setHighlight(itemColors);
            
            if(props.data.length > 0){
                this.setState({
                    data: props.data,
                    info: props.data[first].info
                });

            } else {
                this.setState({
                    data: null,
                    info: null
                });
            }
        }       
    }


    //incomplete
    renderLegend(itemColors){
        var legendItems = []

        //check for duplicates ,refactor this
        for(var i = 0; i < itemColors.length; i++){
            let itemName = itemColors[i].className.input || itemColors[i].className;                   
            for(var j = 0; j < legendItems.length; j++){
                if(legendItems[j].name === itemName){
                    legendItems.pop();
                }
            }
            legendItems.push({color: itemColors[i].color, name: itemName});
        }

        var divs = legendItems.map(item => {
            //var divStyle = {width:'50px',height:'12px'};
            var boxStyle = {width:'12px',height:'12px',backgroundColor: item.color};
            var textStyle = {fontSize: '12px'}
            return (<div><div style = {boxStyle}></div><span style={textStyle}>{item.name}</span></div>);   
        })
        var divStyle = {display:'flex'};
        return <div style={divStyle}>{divs}</div>
    }

    render() {
        return  <div>
            { this.state.info }
            { this.state.legend }
            { super.render() }
        </div>;
    }
   
    setItemColors(typeOf,color){
        if(typeOf && color) {
            $('.vis-item'+"."+typeOf).css('background-color', color); 
        }
    }

    setHighlight(itemColors){
        //reset stylings
        $('.vis-item').css('border-color', '');
        $('.vis-item').css('border-width', '0px');
        $('.vis-item').css('margin-top', '');

        //set outline on selected
        for (var i = 0; i < itemColors.length; i++){
            $('.vis-item.vis-selected'+'.'+itemColors[i].className).css('border-color',Util.colorLuminance(itemColors[i].color,-0.6));
            $('.vis-item.vis-selected').css('border-width', '3px');
            $('.vis-item.vis-selected').css('margin-top', '-3.5px');
        }
    }

    highlightZoomCenterMap(geometry){
        if(geometry){
            var geometry = Util.reversePolygonLatLng(geometry);
            var center = Util.getFeatureCenter(geometry);
            geometry.type == "Point" ? EplActionCreator.highlightZoomCenterMap(geometry,14,center) : EplActionCreator.highlightZoomCenterMap(geometry,13,center);    
            EplActionCreator.removeIdentifyMarker();
        } else {
            EplActionCreator.clearHighlights();
        }       
    }
}

export default TimelineChart;