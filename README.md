# Refactor Services

## About

This monorepo contains all backend services.

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

```
-s, --stage       Stage of the services. Defaults to `dev` [REQUIRED].
-r, --region      Region of the services. Defaults to `us-west-2`.
-v, --verbose     Shows all stack events during deployment, and display any Stack Output.
```

Prepend `SLS_DEBUG=*` for stack trace debugging.

### Deploying the Services

```
yarn run deploy -s [STAGE]
```

### Removing the Services

```
yarn run remove -s [STAGE]
```

### GraphQL Playground

```
(cd services/graph; serverless graphql-playground -s [STAGE] --username YOUR_USERNAME --password YOUR_PASSWORD)
```

## Debug

### Install python/pip to use the tools below. On a Mac:

1. Install [Homebrew](https://brew.sh/)
2. brew install python

Homebrew will install python3 and pip3, which you should use instead of system python/pip (ie. pip3 install awscli awslogs).

```
➜  ~ python3 --version
Python 3.7.2
```

### Creating test users

Use the [aws](https://aws.amazon.com/cli/) cli to create a test user as described [here](https://serverless-stack.com/chapters/create-a-cognito-test-user.html).

Emails with the format `qa_test+{foo}@refactordaily.com` are preferred.

The default region for the project is `us-west-2`.

The client-id is the iOS/Android/Web client-id from the user pool. There are a number of places to find these, including the Cognito User Pools web console.

Example:

```
$ aws cognito-idp sign-up \
  --region us-west-2 \
  --client-id YOUR_COGNITO_APP_CLIENT_ID \
  --username qa_test+1@refactordaily.com \
  --password 121212
```

### Logs

Use the [awslogs](https://github.com/jorgebastida/awslogs) cli to tail CloudWatch logs groups.

Examples:

```
awslogs groups
awslogs get /aws/lambda/refactor-auth-STAGE-preSignUp ALL -w
```

### Tests

Run `yarn test` (or just `jest`) to run regression tests against a deployment. The file `exports.yml` must exist, which is created at the end of the deploy script.

## Stripe

Follow these steps to set up Stripe integration.

1. Get the Stripe POST endpoint in the serverless api service and add it to the [webhooks](https://dashboard.stripe.com/account/webhooks) list on the Stripe dashboard.

2. Get the signing secret for the webhook from the Stripe dashboard and add it to AWS Parameter Store with the following command. Replace STAGE and SIGNING_SECRET.

```
aws ssm put-parameter --name refactor-STAGE-stripeSigningSecret --type String --value SIGNING_SECRET
```

3. Get the Stripe secret key from the Stripe dashboard and add it to SSM.

```
aws ssm put-parameter --name refactor-STAGE-stripeSecretKey --type String --value SECRET_KEY
```

## Sendgrid

To set up Sendgrid, add the Sendgrid environment variables in services/auth/serverless.yml to AWS Parameter Store, similar to Stripe above.

## Published tours

Published tours viewers need to use API key auth instead of Cognito User Pools. In order to set up API key as an additional authorization provider on AppSync, navigate to AppSync -> APIs -> (your API) -> Settings -> Additional authorization providers -> New -> Choose API key -> Submit. Then create a new API key under API keys -> New. By default API keys expire in a week. This can be extended for up to a year by selecting the API key -> Edit -> Expires -> Save.
