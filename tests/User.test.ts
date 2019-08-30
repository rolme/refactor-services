// tslint:disable-next-line: file-name-casing
import * as helpers from './helpers';

// tslint:disable-next-line: file-name-casing
import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';

test('Returns user', async () => {
  const result = await helpers.graphQuery(
    '{ getUser { id email updatedAt createdAt } }',
  );

  expect(result.data).toHaveProperty('getUser');

  expect(result.data.getUser).toHaveProperty('id');
  expect(result.data.getUser.id).toEqual(`USER-${helpers.user.id}`);

  expect(result.data.getUser).toHaveProperty('email');
  expect(result.data.getUser.email).toEqual(helpers.user.email);
});

const name = v4();
test('Updates name', async () => {
  const result = await helpers.graphQuery(
    'mutation UpdateUser($name:String){ updateUser(name:$name) { name } }',
    { name },
  );
  expect(result.data).toHaveProperty('updateUser');
  expect(result.data.updateUser).toHaveProperty('name');
  expect(result.data.updateUser.name).toEqual(name);
});

test('Returns new name', async () => {
  const result = await helpers.graphQuery('{ getUser { name } }');
  expect(result.data).toHaveProperty('getUser');
  expect(result.data.getUser).toHaveProperty('name');
  expect(result.data.getUser.name).toEqual(name);
});

const profile = {
  address: {
    street: [...Array(10)].map((e) => v4()),
  },
  title: v4(),
};

test('Updates profile', async () => {
  const result = await helpers.graphQuery(
    'mutation UpdateUser($profile:ProfileInput){ updateUser(profile:$profile) { profile { address { street } title } } }',
    { profile },
  );
  expect(result.data).toHaveProperty('updateUser');
  expect(result.data.updateUser).toHaveProperty('profile');
  expect(result.data.updateUser.profile).toHaveProperty('address');
  expect(result.data.updateUser.profile.address).toHaveProperty('street');
  expect(result.data.updateUser.profile.address.street).toEqual(
    profile.address.street,
  );
  expect(result.data.updateUser.profile).toHaveProperty('title');
  expect(result.data.updateUser.profile.title).toEqual(profile.title);
});

test('Returns new profile', async () => {
  const result = await helpers.graphQuery(
    '{ getUser { profile { address { street } title } } }',
  );
  expect(result.data).toHaveProperty('getUser');
  expect(result.data.getUser).toHaveProperty('profile');
  expect(result.data.getUser.profile).toHaveProperty('address');
  expect(result.data.getUser.profile.address).toHaveProperty('street');
  expect(result.data.getUser.profile.address.street).toEqual(
    profile.address.street,
  );
  expect(result.data.getUser.profile).toHaveProperty('title');
  expect(result.data.getUser.profile.title).toEqual(profile.title);
});

const s3 = new S3();

let sourceHeadResult: any;

test('Updates user avatar', async () => {
  const source = {
    Bucket: helpers.cfg.jest.s3DeploymentBucket,
    Key: 'testdata/user_picture.jpg',
  };

  sourceHeadResult = await s3.headObject(source).promise();

  const key = v4();

  await s3
    .copyObject({
      Bucket: helpers.cfg.jest.s3UploadBucket,
      CopySource: source.Bucket + '/' + source.Key,
      Key: key,
    })
    .promise();

  const result = await helpers.graphQuery(
    'mutation UpdateUser($avatar:S3ObjectInput){ updateUser(avatar:$avatar) { avatar { bucket key region } } }',
    {
      avatar: {
        bucket: helpers.cfg.jest.s3UploadBucket,
        key,
        mimeType: 'image/jpeg',
        region: helpers.cfg.jest.awsRegion,
      },
    },
  );

  expect(result.data).toHaveProperty('updateUser');
  expect(result.data.updateUser).toHaveProperty('avatar');
  expect(result.data.updateUser.avatar).toHaveProperty('bucket');
  expect(result.data.updateUser.avatar).toHaveProperty('key');
  expect(result.data.updateUser.avatar).toHaveProperty('region');
  expect(result.data.updateUser.avatar.bucket).toEqual(
    helpers.cfg.jest.s3UploadBucket,
  );
  expect(result.data.updateUser.avatar.key).toEqual(key);
  expect(result.data.updateUser.avatar.region).toEqual(
    helpers.cfg.jest.awsRegion,
  );
});

// Send a bad avatar location and expect failure
test('Failed avatar update', async () => {
  const key = v4();

  const result = await helpers.graphQueryNoCheck(
    'mutation UpdateUser($avatar:S3ObjectInput){ updateUser(avatar:$avatar) { avatar { bucket key region } } }',
    {
      avatar: {
        bucket: helpers.cfg.jest.s3UploadBucket,
        key,
        mimeType: 'image/jpeg',
        region: helpers.cfg.jest.awsRegion,
      },
    },
  );

  expect(result.errors).not.toBeNull();
  expect(result.data).toBeNull();
  expect(result.errors[0].message).toEqual('File not found');
});

test('Polls for user avatar in media bucket', (done) => {
  (async function poll() {
    const result = await helpers.graphQuery(
      '{ getUser { avatar { bucket key region } } }',
    );
    expect(result.data).toHaveProperty('getUser');
    expect(result.data.getUser).toHaveProperty('avatar');
    expect(result.data.getUser.avatar).toHaveProperty('bucket');
    expect(result.data.getUser.avatar).toHaveProperty('key');
    expect(result.data.getUser.avatar).toHaveProperty('region');
    if (result.data.getUser.avatar.bucket !== helpers.cfg.jest.s3MediaBucket) {
      setTimeout(poll, 2000);
    } else {
      expect(result.data.getUser.avatar.bucket).toEqual(
        helpers.cfg.jest.s3MediaBucket,
      );
      expect(result.data.getUser.avatar.region).toEqual(
        helpers.cfg.jest.awsRegion,
      );
      const headResult = await s3
        .headObject({
          Bucket: result.data.getUser.avatar.bucket,
          Key: result.data.getUser.avatar.key,
        })
        .promise();
      expect(headResult.ContentLength).toEqual(sourceHeadResult.ContentLength);
      expect(headResult.ETag).toEqual(sourceHeadResult.ETag);
      expect(headResult.ContentType).toEqual(sourceHeadResult.ContentType);
      done();
    }
  })();
});

const newEmail = helpers.getTestEmail();

test('Updates email', async () => {
  const result = await helpers.graphQuery(
    'mutation UpdateUser($email:String){ updateUser(email:$email) { email } }',
    { email: newEmail },
  );
  expect(result.data).toHaveProperty('updateUser');
  expect(result.data.updateUser).toHaveProperty('email');
  expect(result.data.updateUser.email).toEqual(newEmail);
  helpers.user.email = newEmail;
});

test('Returns new email', async () => {
  const result = await helpers.graphQuery('{ getUser { email } }');
  expect(result.data).toHaveProperty('getUser');
  expect(result.data.getUser).toHaveProperty('email');
  expect(result.data.getUser.email).toEqual(newEmail);
});
