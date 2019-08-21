import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_CLIENT_ID,
  },
  Storage: {
    bucket: process.env.UPLOAD_BUCKET,
    region: process.env.REGION,
  },
});

export default Amplify;
