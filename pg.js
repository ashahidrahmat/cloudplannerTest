import * as postgresDBLib from './libs/postgresSQL-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {


  try {

    const result = await postgresDBLib.call(0);

    if (result) {
      // Return the retrieved item
      callback(null, success(result));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }
  }
  catch(e) {
    callback(null, failure({status: false}));
  }
};
