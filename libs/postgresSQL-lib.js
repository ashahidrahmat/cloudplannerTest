
import AWS from 'aws-sdk';
AWS.config.update({region:'us-east-1'});
import Pg from 'pg';
var Promise=require('bluebird');



  export async function getQuery(dataQuery) {
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
         var data = knex.raw(dataQuery);
         knex.destroy(resolve(data));
         }
     );
 };

 export async function postGISQueryToFeatureCollection(queryResult) {
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
