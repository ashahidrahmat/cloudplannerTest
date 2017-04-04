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
    }

dynamicQuery(map){
  console.log("querystore");


 //this._queryManager = MapStore.queryManager;
 //var queryManager = this._queryManager;

console.log(map)

 //queryManager.showLayer(map);

}




}

var instance = new QueryStore();

instance.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.actionType) {

        case EplConstants.DynamicQuery:
            instance.dynamicQuery(action.customData);
            instance.emitChanges();
            break;


        default:
    }
});

export default instance;
