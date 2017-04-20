/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : postgresquery.jsx
 * DESCRIPTION     : dynamic postgresquery right panel
 * AUTHOR          : xingyu
 * DATE            : April 3, 2017
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
import LayerManagerStore from 'stores/layermanagerstore';
import EplActionCreator from 'actions/eplactioncreator';
import ClusterStore from 'stores/clusterstore';
import UiStore from 'stores/uistore';
import Util from 'utils';
import Layer from 'layers/layer';
import Masonry from 'react-masonry-component';
import Lphoto from 'libs/leafletphoto/Leaflet.Photo.js';
import L from 'leaflet';
import $ from 'jquery';
import Ajax from 'wrapper/ajax';
import fancybox from 'fancybox';
import QueryStore from 'stores/querystore'
import {invokeApig} from 'components/restapi/awsLib';
import config from 'components/restapi/config';
import BarChart from 'components/charts/barchart';
import {ChartColors, ChartOrientation} from 'constants/chartconstants';
import PieChart from 'components/charts/piechart';
import MapStore from 'stores/mapstore';
import ReactBootstrapModal from 'components/reactbootstrapmodal'




class PostgresQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showId: 0,
            expanded: false,
            geojson: null,
            unmountSlider:false,
            barchartX:QueryStore.getBarchartDataX(),
            barchartY:QueryStore.getBarchartDataY(),
            piechartData:QueryStore.getPiechartData(),
            tablechartData:QueryStore.getTablechartData(),
            showtabledetails:{},
            queryDate:QueryStore.getQueryDate()
        };

        this._onUiChange = this._onUiChange.bind(this);

        this._onQueryChange = this._onQueryChange.bind(this);


    }

    componentDidMount() {

        //disable map click
        MapStore.disableMapOnClickIdentifyHandler();

        UiStore.addChangeListener(this._onUiChange);
        QueryStore.addChangeListener(this._onQueryChange);

        let content = this.refs.cateContent;
        Util.setPerfectScrollbar(content);
        fancybox($);

        //toggle jrangeslider
        //shoe slider at the same time
        EplActionCreator.togglejrangeslider("jrangeslider");

    }

    componentWillUnmount() {

        //enable map click
        MapStore.enableMapOnClickIdentifyHandler();

        UiStore.removeChangeListener(this._onUiChange);
        QueryStore.removeChangeListener(this._onQueryChange);
    }


    _onUiChange() {

    }

    _onQueryChange(){

      this.setState({
          barchartX:QueryStore.getBarchartDataX(),
          barchartY:QueryStore.getBarchartDataY(),
          piechartData:QueryStore.getPiechartData(),
          tablechartData:QueryStore.getTablechartData(),
          queryDate:QueryStore.getQueryDate()
      });
    }


    closeRightMenu() {
        EplActionCreator.clearHighlights();
        EplActionCreator.closeRightPanel();
    }


  _toggleRightPanelExpansion(evt) {
      this.setState({
          expanded: !this.state.expanded
      });

  }

  showChart(chartData){

      //show barchart
      var showchart = false;

      if(chartData == null){
          showchart = false
      }else if(chartData != null && chartData.length == 0){
          showchart = false
      }else{
          showchart = true;
      }

      return showchart;

  }

  getDataQuery(evt){

    //EplActionCreator.showModal("hi")
    this.setState({
      showtabledetails:{"show":true,"lotNo":evt,"date":this.state.queryDate}
    })
  }

    render() {

     
        var expanded = this.state.expanded,
            resizeClass = expanded ? "reduce-icon expand-icon-color" : "expand-icon expand-icon-color",
            resizeInfoClass = expanded ? "icon-resize-small" : "icon-resize-full",
            resizeStyleMap = expanded ? { width: '66%' } : { width: '33%' },
            siteClass = "show";

            let time =['x'],chartVolume = ['Decision Date'];
            var i = 0;
            let barData = [];
            var showTimeChartStatus = false;

            if(this.state.barchartX != null){

              showTimeChartStatus = true
              for(i = 0;i < this.state.barchartX.length;i++){
                  time.push(this.state.barchartX[i]);
                  chartVolume.push(this.state.barchartY[i])
              }

              barData = [
                  time,
                  chartVolume
              ]
            }



        //show piechart
        var showPieChartStatus = this.showChart(this.state.piechartData);

        var tableData = [];
        //populate table
        if(this.state.tablechartData != null){
          //console.log(this.state.tablechartData)
            var scope = this;
            this.state.tablechartData.data.map((item, j) => {
                tableData.push(<tr onClick={scope.getDataQuery.bind(scope,item.id)}><td><a href="#">{item.id}</a></td><td>{item.total}</td></tr>)
        });
        }


                    return (
                        <div id="legend-div" className="legend-color"  style={resizeStyleMap}>
                            <div className="si-title-wrapper si-title-color">
                                <span className="si-title">Postgres Query</span>
                                <span id="siteinfo-close" className="right-close-btn right-close-btn-color" onClick={this.closeRightMenu.bind(this)}><i className="icon-cancel-circled"></i></span>
                                <span id="siteinfo-resize" className={resizeClass} onClick={this._toggleRightPanelExpansion.bind(this)}><i className={resizeInfoClass}></i></span>
                            </div>

                            <div className="legend-wrapper" ref="cateContent">


                                {showTimeChartStatus? <BarChart title={"Planning Decisions"} x='x' data = {barData} orientation={ChartOrientation.Vertical} /> : "no data available"}

                                {showPieChartStatus? <PieChart title={"Application Type"}
                                  data={this.state.piechartData} /> : ""}

                                  <div className={siteClass + " site-fixed-info"}>
                                      <table className="site-fixed-info-table" border="1">
                                          <tbody>
                                              <tr><td width="116px;">Lot_No</td><td>Count</td></tr>
                                              {tableData}
                                          </tbody>
                                      </table>
                                  </div>

                                  <ReactBootstrapModal data={this.state.showtabledetails} />


                    </div>
                    </div>
                   );
            }
      }
export default PostgresQuery;
