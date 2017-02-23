/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : webapi.js
 * DESCRIPTION     : static data file for web APIs
 * AUTHOR          : louisz
 * DATE            : May 17, 2016
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

import Ajax from 'wrapper/ajax';
import Util from '\\util';
import Modal from 'components/modal';
import ConfigStore from 'stores/configstore';
import UrlConstants from 'constants/urlconstants';
import EplActionCreator from 'actions/eplactioncreator';
import {PlanningArea, Subzone} from 'constants/aggregationconstants';
import Esri from 'esri-leaflet';

export default class Search {
    constructor(searchText){
        this.searchText = searchText;
        this.deferred = Ajax.deferred(); 
        this.promise = this.searchPromise();
        
    }
    //return deferred promise, to implement
    searchPromise(){
        this.deferred.resolve([]);
        return this.deferred.promise();
    }

    isStreetBlkSearch(){
        //case 123 ang mo kio 
        let regBlk = new RegExp('^[0-9]+[a-z]{0,1} +[a-z]+', 'i');
        //case ang mo kio 123
        let regStreet = new RegExp(/(\w+) \w+ ([\d]{1})/);
        
        return regBlk.test(this.searchText) || regStreet.test(this.searchText);
    
    }

    isLayerSearch() {
        return this.searchText.length > 3 && /^\[(.)+\]?$/.test(this.searchText);
    }
}
