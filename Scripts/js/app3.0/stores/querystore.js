/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : querystore.js
 * DESCRIPTION     : all for query rest api
 * AUTHOR          : xingyu
 * DATE            : April 4, 2017
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

import BaseStore from 'stores/basestore';
import EplConstants from 'constants/eplconstants';
import AppDispatcher from 'dispatcher/appdispatcher';
import MapStore from 'stores/mapstore';
import EplActionCreator from 'actions/eplactioncreator';
import L from 'leaflet';
import $ from 'jquery';
import Util from 'utils';

class QueryStore extends BaseStore {

    constructor() {
        super();
        this._queryManager = null;
        this._map = Util.getMap();
        this.showjrangeslider = false;
        this.barchartDataX=null;
        this.barchartDataY=null;
        this.piechartData=null;
        this.tablechartData = null;
        this.queryDate=null;
    }

    getJrangesliderStatus(){
      return this.showjrangeslider;
    }

    getBarchartDataX(){
      return this.barchartDataX;
    }

    getBarchartDataY(){
      return this.barchartDataY;
    }

    getPiechartData(){
      return this.piechartData;
    }

    getTablechartData(){
      return this.tablechartData;
    }

    getQueryDate(){
      return this.queryDate;
    }



togglejrangeslider(queryData){

  //show bottom jrangeslider
  this.showjrangeslider = true;

if(queryData){

if(queryData.type == "barchart"){
    this.processBarchartData(queryData.data);
}else if(queryData.type == "piechart"){
    this.processPiechartDate(queryData.data);
}else if(queryData.type == "tablechart"){
    //add date
    this.queryDate = queryData.date;

    this.processTablechartDate(queryData);
}

}
}

processBarchartData(timeChartResult){
  var tempX = [];
  var tempY = [];
  var i = 0;

  for(i=0;i<timeChartResult.rows.length;i++){
      tempX.push(timeChartResult.rows[i].decision_date.substring(0,10));
      tempY.push(timeChartResult.rows[i].count);
  }

  this.barchartDataX=tempX;
  this.barchartDataY=tempY;
}

processPiechartDate(pieChartResult){

var tempchartdata = [];

var i = 0;

for(i=0;i<pieChartResult.rows.length;i++){
 tempchartdata.push([pieChartResult.rows[i].appl_type,pieChartResult.rows[i].count])
}

this.piechartData = tempchartdata;

}

processTablechartDate(tableChartResult){
this.tablechartData = tableChartResult;
}

}

var instance = new QueryStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {

        case EplConstants.Togglejrangeslider:
            instance.togglejrangeslider(action.customData);
            instance.emitChanges();
            break;


        default:
    }
});

export default instance;
