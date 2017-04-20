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


    let query = "select appl_type, count(distinct(decision_no)) from planning_decisions pd, s_cadastral_land_lot_1 cada where decision_date >= date'" + s + "' and decision_date < date'" + e+ "' and pd.mkts_lotno = cada.lot_key and ST_Within(cada.geom, " + bounds + ") group by appl_type order by count DESC";

    //pass in the data from frontend
    //query for result
    let queryResult = await postgresDBLib.getQuery(query);

    //let finalTransformResult = await postgresDBLib.postGISQueryToFeatureCollection(queryResult.rows);


    if (queryResult) {
      // Return the retrieved item
      callback(null, success(queryResult));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }
};
