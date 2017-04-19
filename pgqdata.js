import * as postgresDBLib from './libs/postgresSQL-lib';
import { success, failure } from './libs/response-lib';




//test function
//curl -X POST https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1/pgquery --data { "text": "Learn Serverless" }
export async function main(event, context, callback) {


    const queryResult = await postgresDBLib.call('data');

    //const result = await postgresDBLib.postGISQueryToFeatureCollection(queryResult.rows);

    callback(null, queryResult);

};
