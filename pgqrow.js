import * as postgresDBLib from './libs/postgresSQL-lib';
import { success, failure } from './libs/response-lib';
import Pg from 'pg';
var Promise=require('bluebird');

export async function main(event, context, callback) {




    //query number of rows from pg db
    //const row = event.query.row

    const result = await getQuery();

    let finalTransformResult = await postGISQueryToFeatureCollection(result.rows);


    if (finalTransformResult) {
      // Return the retrieved item
      callback(null, success(finalTransformResult));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }

};

async function getQuery(dataQuery) {
   return new Promise(
       (resolve, reject) => {

         //connect to db first
         var knex = require('knex')({
           dialect: 'postgres',
           client: 'pg',
           connection: {
               user: 'pgAdmin',
               database: 'cloudplannerDB',
               port: 5432,
               host: 'cloudplannerpg.cfkxlwwy0esv.us-east-1.rds.amazonaws.com',
               password: 'cloudplannerPG8'
           },
           debug: false,
           pool: {
               min: 0,
               max: 2
           }
         });

       var data = knex.raw("select gid, pln_area_n, ST_AsGeoJSON(geom) AS geometry from s_pln_area");

         knex.destroy(resolve(data));
       }
   );
};


async function postGISQueryToFeatureCollection(queryResult) {
    return new Promise((resolve, reject) => {
  // Initalise variables.
  var i = 0,
      length = queryResult.length,
      prop = null,
      geojson = {
        "type": "FeatureCollection",
        "features": []
      };    // Set up the initial GeoJSON object.

  for(i = 0; i < length; i++) {  // For each result create a feature

	// console.log(queryResult[i]);
	var geom = JSON.parse(queryResult[i].geometry);

	var properties = {}
    // finally for each property/extra field, add it to the feature as properties as defined in the GeoJSON spec.
    for(prop in queryResult[i]) {
      if (prop !== "geometry" && queryResult[i].hasOwnProperty(prop)) {
        properties[prop] = queryResult[i][prop];
      }
    }
	 //console.log(properties);

	var feature = {
      "type": "Feature",
      "geometry": geom,
	  "properties": properties
    };

    // Push the feature into the features array in the geojson object.
    geojson.features.push(feature);
  }
  // return the FeatureCollection geojson object.
  resolve(geojson);

  });
}
