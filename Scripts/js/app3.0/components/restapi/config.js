export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    BUCKET: 'notes-app-uploads'
  },
  apiGateway: {
    URL: 'https://47ocijtui8.execute-api.us-east-1.amazonaws.com/v1',
  },
  cognito: {
    USER_POOL_ID : 'us-east-1_YEhdMFvix',
    APP_CLIENT_ID : '29qpcqorti0ctjkur5h01dph5g',
    REGION: 'us-east-1',
    IDENTITY_POOL_ID: 'us-east-1:565cc505-5486-4278-bf0f-9736b9fdd8c5',
  }
};
