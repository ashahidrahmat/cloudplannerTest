/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : chart.js
 * DESCRIPTION     : Base Reactjs component for Charts
 * AUTHOR          : louisz
 * DATE            : Apr 28, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        : 
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      : add chart remarks div, pass [remarks1, remarks2] will display the remarks under chart
 * CHANGED BY      : jianmin
 * DATE            : Jul 7, 2016
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/

"use strict";

import React from 'react';
import EplActionCreator from 'actions/eplactioncreator';
import Button from '../ui/button';
import Util from 'utils';


class Chart extends React.Component { 
    constructor(props) {
        super(props);
        this.exportCSV = this.exportCSV.bind(this);
    }
    
    exportCSV(){
        let scope = this,
            headerArr, 
            chartTitle = this.props.title ? this.props.title.replace(" ","_") : "ChartData",
            link = document.createElement("a");
            
        if(this.props.header){
            headerArr = this.props.header;
        }
        else if(this.props.categories){
            headerArr = this.props.categories;
        }
        else{
            headerArr = null;
        }

        var blob = new Blob([Util.generateChartCSVString(headerArr, this.props.data)],{type: "text/csv;charset=utf-8;"});

        if (navigator.msSaveBlob) {              

            navigator.msSaveBlob(blob, chartTitle + ".csv")

        }
        else{      

            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", chartTitle + ".csv");
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
       
    }
   
    render() {
        let center = {
            textAlign:'center',
            fontWeight:700
        },
        chartCss = {
            textAlign:'center',
            fontWeight:400,
            marginBottom: 10
        },
        remarks = this.props.remarks,
        chartTip = this.props.chartTip;

        //chart remarks
        let remarkDiv = () => {
            if (!remarks){
                return null;
            }
            let remarkDiv = [];
            remarks.forEach((remark, index) => {
                remarkDiv.push(<i key={"remark-"+ index}>{'*' + remark}</i>);
            remarkDiv.push(<br/>);
        });

        return (<div style={chartCss}>{remarkDiv}</div>);
    };

    //chart tip
    let chartTipDiv = () => {
        if (!chartTip) {
            return null;
        }
        let chartTips = [];
        chartTips.push(<b key={"tip-title"}>{chartTip.title}</b>);
        chartTips.push(<br/>);
        chartTip.content.forEach((tip, index) => {
            chartTips.push(<span key={"tip-"+ index}>{(index+1) + '.' + tip}</span>);
                chartTips.push(<br/>);
            });        

            return (<div className="chart-alert">{chartTips}</div>);
        };
        
        let exportCSVBtn = () => {
            if (this.props.exportCSV) {
                return (<Button title= "Download data" class="chart-export-csv-btn icon-download" text="" onClick={this.exportCSV}></Button>);
            } else {
                return null;
            }
        }; 
            
        return (
            <div>
                {chartTipDiv()}
                <div style={center} ref='title' className='fancybox-chart-title'>{this.props.title}&nbsp;
                {exportCSVBtn()}
                </div>
                <div style={chartCss}  ref='chart'></div>
                {remarkDiv()}
            </div>
        );
    }
}

export default Chart;
