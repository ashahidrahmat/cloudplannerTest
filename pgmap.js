import * as postgresDBLib from './libs/postgresSQL-lib';
import { success, failure } from './libs/response-lib';
import Pg from 'pg';
var Promise=require('bluebird');

/*
API Gateway will throw errror Endpoint response body before transformations: { "errorMessage" : "body size is too long"}
means the response body is more than 6mb (default not more than that), however, this shows the method is working.
*/

//test function
//curl -X POST https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1/pgquery --data { "text": "Learn Serverless" }
//http://serverless-stack.com/chapters/add-a-create-note-api.html
export async function main(event, context, callback) {

    //var finalQuery='';
    //must define datatype
    var finalQuery={};

    const data = JSON.parse(event.body);

    finalQuery = data;

    let s = finalQuery.startDate.substring(0,10);
    let e = finalQuery.endDate.substring(0,10);
    let xmin = finalQuery.xmin;
    let ymin = finalQuery.ymin;
    let xmax = finalQuery.xmax;
    let ymax = finalQuery.ymax;
    let bounds = "ST_MakeEnvelope(" + xmin + ", " + ymin + ", " + xmax + ", " + ymax + ", 4326)";

    let query = "select r.id, r.total, ST_AsGeoJSON(g.geom) AS geometry from (select mkts_lotno as id, count(distinct(decision_no)) as total from planning_decisions pd where decision_date >= date'" + s +"' and decision_date < date '" + e + "' group by mkts_lotno) as r, s_cadastral_land_lot_1 g where r.id = g.lot_key and ST_INTERSECTS(g.geom, " + bounds + ")";

    //pass in the data from frontend
    //query for result
    let queryResult = await postgresDBLib.getQuery(query);

    let finalTransformResult = await postgresDBLib.postGISQueryToFeatureCollection(queryResult.rows);


    if (finalTransformResult) {
      // Return the retrieved item
      callback(null, success(finalTransformResult));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }
};
