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

togglejrangeslider(queryData){

  //show bottom jrangeslider
  this.showjrangeslider = true;

console.log(queryData);
if(queryData){

if(queryData.type == "barchart")
  this.processBarchartData(queryData.data);
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
