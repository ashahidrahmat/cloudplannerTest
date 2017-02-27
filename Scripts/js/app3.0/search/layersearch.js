/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : subzonesearch.js
 * DESCRIPTION     : Search subzone
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
import Util from '\\util';
import Search from 'search/search';
import SearchStore from 'stores/searchstore';
import SearchConstants from 'constants/searchconstants';
import LayerManagerStore from 'stores/layermanagerstore';

export default class LayerSearch extends Search {

    searchPromise(){
        let validSearch = this.isLayerSearch();

        if (!validSearch){
            this.deferred.resolve([]);
            return this.deferred.promise();
        }

        // Attempt to search by layer name and return response base on layers
        // Matches [Total 
        // Does not match 
        //      - [Total Population]
        //      - [
        let matches, layers,
            regex = /^\[((?!.*\]$)[/\w\.-]+)$/i;
            
        if (matches = regex.exec(this.searchText)) {
            layers = LayerManagerStore.searchLayer(matches[1]);

            let results = layers.map((layer, i) => {
                let name = "[" + layer.getName() + "] ";
                return {
                    replace: name,
                    display: name
                };
            });

            this.deferred.resolve(results);
            return this.deferred.promise();
        }

        // For the found layer, attempt to find data within the layer
        let retZeroResults = true;
        regex = /^\[(.+)\](.+)$/i;
        matches = regex.exec(this.searchText);
        if (matches && matches[2].trim().length > 2) {
            let layer = LayerManagerStore.getLayerByName(matches[1]),
                layerName = "[" + layer.getName() + "] ",
                searchText = matches[2];

            if (layer) {
                let finder = layer.map.find(),
                    search = layer.getSearchObj(),
                    zoom = 14,
                    fields = "OBJECTID";
                
                // Check if search parameters are set
                if (search) {
                    zoom = search.zoom || zoom;

                    if (search.fields) {
                        fields = search.fields || fields
                        finder.fields(fields);
                    }
                }

                finder
                .layers(layer.getLayers())
                .text(searchText.trim().toUpperCase())
                .run((error, featureCollection, response) => {
                    if (error) {
                        this.deferred.resolve([]);
                        return;
                    } 

                    let results = featureCollection.features.map((row, i) => {

                        let geometry = Util.reversePolygonLatLng(row.geometry),
                            center = Util.getFeatureCenter(geometry);

                        return {
                            id: i,
                            zoom: zoom,
                            center: [center.lat, center.lng],
                            display: layerName + row.properties[fields],
                            geometry: geometry
                        };

                    }).slice(0, 10);

                    this.deferred.resolve(results);
                });

                retZeroResults = false;
            }
        }
        
        if (retZeroResults) {
            this.deferred.resolve([]);
        }

        return this.deferred.promise();
    }
}
