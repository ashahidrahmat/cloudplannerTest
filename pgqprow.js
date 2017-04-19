import * as postgresDBLib from './libs/postgresSQL-lib';
import { success, failure } from './libs/response-lib';
import Pg from 'pg';
var Promise=require('bluebird');



//test function
//curl -X POST https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1/pgquery --data { "text": "Learn Serverless" }
//http://serverless-stack.com/chapters/add-a-create-note-api.html
export async function main(event, context, callback) {


    //const queryResult = await postgresDBLib.call();

    //const result = await postgresDBLib.postGISQueryToFeatureCollection(queryResult.rows);

    //callback(null, queryResult);

    let query1 = 'select gid, pln_area_n, ST_AsGeoJSON(geom) AS geometry from s_pln_area limit 10';
    let query2 = 'select gid, pln_area_n, ST_AsGeoJSON(geom) AS geometry from s_pln_area limit 1';


    //var finalQuery='';
    //must define datatype
    var finalQuery={};

    const data = JSON.parse(event.body);

    finalQuery = data;

/*
    if(data.myquery == "query1"){
      finalQuery = query1;
  }else if(data.myquery == "query2"){
      finalQuery = query2;
    }
*/

    //pass in the data from frontend
    //query for result
    let queryResult = await getQuery(finalQuery);

    let finalTransformResult = await postGISQueryToFeatureCollection(queryResult.rows);


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

        let s = dataQuery.startDate.substring(0,10);
      	let e = dataQuery.endDate.substring(0,10);
        let xmin = dataQuery.xmin;
     	let ymin = dataQuery.ymin;
     	let xmax = dataQuery.xmax;
     	let ymax = dataQuery.ymax;
      	let bounds = "ST_MakeEnvelope(" + xmin + ", " + ymin + ", " + xmax + ", " + ymax + ", 4326)";

        var data = knex.raw("select r.id, r.total, ST_AsGeoJSON(g.geom  AS geometry from (select mkts_lotno as id, count(distinct(decision_no)) as total from planning_decisions pd where decision_date >= date'" + s +"' and decision_date < date '" + e + "' group by mkts_lotno) as r, s_cadastral_land_lot_1 g where r.id = g.lot_key and ST_INTERSECTS(g.geom, " + bounds + ")");



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
