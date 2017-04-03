import * as postgresDBLib from './libs/postgresSQL-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {




    //query number of rows from pg db
    const row = event.query.row

    const result = await postgresDBLib.call(row);

    callback(null, result);
};
