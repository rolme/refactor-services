# Refactor Services

## About

This mono-repo contains all backend services.

## Getting Started

### Prerequisites

- [node 10+](https://nodejs.org)
- [yarn](https://yarnpkg.com)

### Installation

Clone the repository and enter the project directory:

```
git clone git@github.com:rolme/refactor-services.git
cd refactor-services
```

Install core dependencies and bootstrap the project:

```
yarn
```

Make sure `./node_modules/.bin` is in your path so that the scripts below can find `serverless`.

### Deployment Bucket

Serverless uses the deployment bucket `refactor-deployment`. If you need to change this, copy `confile.yml.example` to `config.yml` and edit the `deploymentBucket` key.

## Usage

All scripts are configured in the root package file and can be executed via `yarn run`.

They accept any of the following arguments:

```sh
-s, --stage       Stage of the services. Defaults to `dev` [REQUIRED].
-r, --region      Region of the services. Defaults to `us-west-2`.
-v, --verbose     Shows all stack events during deployment, and display any Stack Output.
```

Prepend `SLS_DEBUG=*` for stack trace debugging.

### Deploying the Services

```sh
yarn run deploy -s STAGE
```

### Removing the Services

```sh
yarn run remove -s STAGE
```

### GraphQL Playground

```sh
(cd services/graph; serverless graphql-playground -s STAGE --username YOUR_USERNAME --password YOUR_PASSWORD)
```

## Debug

### Install python/pip to use the tools below. On a Mac

1. Install [Homebrew](https://brew.sh/)
2. brew install python

Homebrew will install python3 and pip3, which you should use instead of system python/pip (ie. pip3 install awscli awslogs).

```sh
➜  ~ python3 --version
Python 3.7.2
```

### Creating test users

Use the [aws](https://aws.amazon.com/cli/) cli to create a test user as described [here](https://serverless-stack.com/chapters/create-a-cognito-test-user.html).

Emails with the format `qa-test+{foo}@refactordaily.com` are preferred.

The default region for the project is `us-west-2`.

The client-id is the iOS/Android/Web client-id from the user pool. There are a number of places to find these, including the Cognito User Pools web console.

Example:

````sh
email=Test+1@RefactorDaily.com && \
aws cognito-idp sign-up \
  --region us-west-2 \
  --client-id $(sed -n '/^playground:$/,$p' exports.yml | grep "cognitoUserPoolClientId:" | head -1 | xargs | cut -d" " -f2) \
  --username $(echo $email | tr '[:upper:]' '[:lower:]') \
  --password refactor123 \
  --user-attributes \
    Name="custom:rawEmail",Value="$email" \
    Name="custom:role",Value="admin"
```

### Logs

Use the [awslogs](https://github.com/jorgebastida/awslogs) cli to tail CloudWatch logs groups.

Examples:

```sh
awslogs groups
awslogs get /aws/lambda/refactor-auth-STAGE-preSignUp ALL -w
````

Another example:

```sh
cd services/graph && sls logs -t -v -f graphql -s STAGE
```

### Tests

Run `yarn test` (or just `jest`) to run regression tests against a deployment. The file `exports.yml` must exist, which is created at the end of the deploy script.

### DynamoDB Table Design

| model |         pk         |        gsi1        |             gsi2              |   id    | notes                       |
| :---- | :----------------: | :----------------: | :---------------------------: | :-----: | :-------------------------- |
|       |   _hash / range_   |   _range / hash_   |        _type / scope_         |  _id_   |                             |
| User  | USER-ID / USER-ID  |        n/a         | 'USER' / TRIAL\|GUEST\|TEAM\* | USER-ID |                             |
| Habit | USER-ID / HABIT-ID | HABIT-ID / USER-ID |      'HABIT' / HABIT-ID       | ORG-ID  | 1 to Many                   |
| Task  |   TASK-ID / DATE   |        n/a         |  'TASK' / 'USER\|HABIT\|\*'   | TASK-ID | Filter by USER\|HABIT\|DATE |
