import AWS from 'aws-sdk';
import config from 'components/restapi/config.js';

export async function invokeApig(
  { path,
    method = 'GET',
    body }) {

  const url = `${config.apiGateway.URL}${path}`;


  //body = (body) ? JSON.stringify(body) : body;

  const results = await fetch(url, {
    method,
    body
  });

  return results.json();
}

export function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

  AWS.config.update({ region: config.cognito.REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  });

  return new Promise((resolve, reject) => (
    AWS.config.credentials.get((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    })
  ));
}

export async function s3Upload(file, userToken) {
  await getAwsCredentials(userToken);

  const s3 = new AWS.S3({
    params: {
      Bucket: config.s3.BUCKET,
    }
  });
  const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${file.name}`;

  return new Promise((resolve, reject) => (
    s3.upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result.Location);
    })
  ));
}
