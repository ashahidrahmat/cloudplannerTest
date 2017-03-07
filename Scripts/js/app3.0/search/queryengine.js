/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : planningareasearch.js
 * DESCRIPTION     : Search planning area
 * AUTHOR          : jianmin
 * DATE            : Jul 29, 2016
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
import {ControllerUrl} from 'constants/urlconstants';
import SearchStore from 'stores/searchstore';
import Search from 'search/search';
import Util from '\\util';
import SpeechStore from 'stores/speechstore';
import BufferStore from 'stores/bufferstore';

export default class QueryEngine extends Search {
    constructor(searchText){
        super(searchText);
    }

    searchPromise(){
        Ajax.wait([
                this.querySearch()
        ], (data) => {
            if(typeof data === 'string'){
                data = JSON.parse(data);
            }
            let valid = data && data.description;
            if(!valid){
                this.deferred.resolve([]);
                return;
            }
            let results = this.formatResults(data);
            this.deferred.resolve(results);

        });

        return this.deferred.promise();

    }

    querySearch(){
        var query = {
            ask: this.searchText
        };

        let url = ControllerUrl.QuerySearch;
        return Ajax.call({
            url: url,
            dataType: 'json',
            data: query,
            type: 'POST'
        });

    }

    //TODO Refactor QE REST service
    formatResults(output) {
            
        var layermap = {0: "Planning Commitment", 1: "Parking Lot Map", 2: "Road Reserve Site Boundary",
                        3: "Existing Land Use", 4: "Land Ownership", 5: "Housing Units", 6: "Total Population",
                        7: "Land Title", 8: "Vehicle Ownership", 9: "National Cycling Plan", 10: "Planning Area DNA",
                        11: "Land Use 2030", 12: "Gazetted Approved Amendments to MP", 13: "Retail Density",
                        14: "Parking Offences", 15: "Childcare Services", 16: "Eldercare Services",
                        17: "Home/Work Flow by Ezlink Records", 18: "Urban Design Guidelines", 19: "Islandwide Job Distribution"};
        var results = {
            query: 'query',
            id: 0,
            layers: [],
            buffers: [],
            locations: [],
            locationNames: [],
            display: ''
        };

        results.buffers.push(output.buffers);

        for(var j=0; j<output.layers.length; j++) {
            results.layers.push(layermap[output.layers[j].index]);
        }

        for(var i=0; i<output.locations.length; i++){
            var text =  output.locations[i].autoCorrect ? output.locations[i].autoCorrect :
                                                          output.locations[i].textInput;
            if (!results.locationNames.includes(text)) {
                results.locationNames.push(text);
            }
            results.locations.push( L.latLng(output.locations[i].coords.wgs84.lat,output.locations[i].coords.wgs84.lon) );
        }

        results.latlngbounds = L.latLngBounds(results.locations);

        let display = 'Query ';
        
        if (results.layers.length && results.locationNames.length  && results.buffers[0].isBuffered) {
            display += 'Layers: ' + results.layers.join(', ') +
                       ' | Locations: ' + results.locationNames.join(', ') +
                       ' | Buffer: ' +  Util.niceNumberFormat(results.buffers[0].radius) + ' ' + results.buffers[0].unit + 's';
        } else if (results.layers.length && results.locationNames.length) {
            display += 'Layers: ' + results.layers.join(', ') +
                       ' | Locations: ' + results.locationNames.join(', ');
        } else if (results.layers.length) {
             display += 'Layers: ' + results.layers.join(', ');
        } else if (results.locationNames.length) {
             display += 'Locations: ' + results.locationNames.join(', ');
        } else {
            return [];
        }
       
        results.display = display;
        return [results];
    }

}
