/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : layer.js
 * DESCRIPTION     : Reactjs component for 1 layer on the LeftPanel
 * AUTHOR          : louisz
 * DATE            : Jan 6, 2016
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

import Util from '\\util';
import React from 'react';
import EllipsisText from 'components/displays/ellipsistext';
import {ChartOrientation} from 'constants/chartconstants';
import TableFilter from  'tablefilter';

class TableDisplay extends React.Component {
   

        
    constructor(props) {
        super(props);


        this.state = {value:''};
        this.defaultFilterConfig = this.defaultFilterConfig.bind(this);

        this.defaultProps={
            topTitle:"",
            filter:false,
            filterconfig:this.defaultFilterConfig()
        };
    }
    

    defaultFilterConfig(){
        let filtersConfig={
            auto_filter:true,
            filters_row_index:1,
            auto_filter_delay:1000,
            state:true,
            rows_counter:true,
            rows_counter_text:"Results: ",
            btn_reset:true,
            status_bar:true,
            msg_filtering:"Filtering...",
            base_path:'/Scripts/node_modules/tablefilter/dist/tablefilter/',
            stylesheet:'/Content/css/lib/tablefilter/style/tablefilter.css'
        };

        return filtersConfig;
    }

    toTable(displays) {
        var th = [<th key="rowNo"></th>],
        tr = [], 
        td = [];

        displays.map((row, i) => {

            if (this.props.orientation !== ChartOrientation.Vertical) {
                this.tableRowsCount = i;
                if (i === 0) {
                    //header
                    row.map((col, j) => {
                        th.push(
                            <th key={"headerCol-"+j}><EllipsisText text={col} /></th>
                        );
                    });
                    tr.push(<tr key="headerRow">{th}</tr>);
                } else {
                    td = [];
                    td.push(<td key={"rowNo-"+i}>{i}</td>);
                    row.map((col, j) => {
                        td.push(<td key={"rowValue-"+i+"-"+j}><EllipsisText text={col} /></td>);
                    });

                    tr.push(<tr key={"rowValues-"+i}>{td}</tr>);
                }
            } else {
                if (i > 0) {
                    row.map((col, j) => {
                        tr.push(<tr>
                            <td>{displays[0][j]}</td>
                            <td><EllipsisText text={col} /></td>
                        </tr>);
                    });
                }
            }
});
                    var table =(<table id={this.props.id}  ref='tableDisplay' ><tbody>{tr}</tbody></table>);
                  
      
                    return table;
}




   componentDidMount() {

       if(this.props.filter && this.tableRowsCount>1){
           var filter = (this.props.filterconfig?this.props.filterconfig:this.defaultFilterConfig());
           var tablefilter = new TableFilter(this.props.id,filter);
           tablefilter.clearFilters();
           tablefilter.init();
           try{
               tablefilter.clearFilters();}
           catch(err){
               console.log(err);
           }

       }
   }

   componentWillUnmount() {
      
   }


render() {
    var tabledisplay = null;
    
    if(this.props.topTitle != ""){
        tabledisplay = (<div className="lr-ul-table-wrapper" ><h3>{this.props.topTitle}</h3>{this.toTable(this.props.display)}</div>);
    }else{
        tabledisplay = (<div className="lr-ul-table-wrapper" >{this.toTable(this.props.display)}</div>);
    }
    return (tabledisplay);
    }
}


   

export default TableDisplay;
