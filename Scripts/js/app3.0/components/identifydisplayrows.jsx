/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : identifydisplayrow.js
 * DESCRIPTION     : Reactjs component for IdentifyDisplayRow
 * AUTHOR          : louisz
 * DATE            : Apr 26, 2016
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/
"use strict";

import React from 'react';

class IdentifyDisplayRows extends React.Component {

    exportCSVBtn() {
        let layer = this.props.layer;

        if(this.props.exportCSV && layer.displayCache){
            if(layer.displayCache.props.display && layer.displayCache.props.display.length > 0){
                return <span className="export-csv-btn" ><i title = "Download data" className="icon-download" onClick= {layer.exportCSV}></i></span>;
            }
            else if(layer.displayCache.props.children && layer.displayCache.props.children.length > 0 && layer.displayCache.props.children[0].props && layer.displayCache.props.children[0].props.display && layer.displayCache.props.children[0].props.display.length > 0){
                return <span className="export-csv-btn" ><i title = "Download data" className="icon-download" onClick= {layer.exportCSV}></i></span>;
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }; 

    render() {
        let layer = this.props.layer,
            layerName = layer.getName(),
            dataClass = this.props.showData ? "lr-table-wrapper" : "lr-table-wrapper lr-table",
            iconClass = this.props.showData ? "cate-up-icon" :  "cate-minus-icon",
            exportCSVClass = this.props.exportCSV && layer.displayCache ? "icon-download " : "";       

        return (
            <div key={layerName}>
                <div className="lr-title-wrapper selected-lr" >
                    <span className="lr-title" onClick={this.props.onRowClick}>{layerName}</span>
                    {this.exportCSVBtn()}
                    <span className={iconClass} onClick={this.props.onRowClick}></span>
                </div>
                <div className={dataClass}>{layer.getIdentifyDisplayCache(layerName)}</div>
                    </div>);
                };
}

export default IdentifyDisplayRows;