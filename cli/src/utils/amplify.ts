import Amplify from 'aws-amplify';
import { Config } from '../../toolbelt.config';

Amplify.configure({
  Auth: {
    identityPoolId: Config.toolbelt.cognitoIdentityPool,
    region: Config.toolbelt.awsRegion,
    userPoolId: Config.toolbelt.cognitoUserPoolId,
    userPoolWebClientId: Config.toolbelt.cognitoUserPoolClientId,
  },
  Storage: {
    bucket: Config.toolbelt.s3UploadBucket,
    region: Config.toolbelt.awsRegion,
  },
});

export default Amplify;
