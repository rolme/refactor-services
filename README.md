# Refactor Services

## About

This mono-repo contains all backend services.

## Getting Started

### Prerequisites

- [asdf](https://asdf-vm.com/#/core-manage-asdf-vm): single CLI to manage runtime environments like nodejs, python, etc.
- [node 12+](https://nodejs.org)
- [yarn](https://yarnpkg.com)
- [python 3.8](https://www.python.org/downloads/release/python-380/)
- [github ssh](https://help.github.com/en/enterprise/2.15/user/articles/adding-a-new-ssh-key-to-your-github-account)

### Installation

Clone the repository and enter the project directory:

```sh
git clone git@github.com:rolme/refactor-services.git
cd refactor-services
```

Install core dependencies and bootstrap the project:

```sh
yarn
```

Make sure `./node_modules/.bin` is in your path so that the scripts below can find `serverless`.

### Deployment Bucket

Serverless uses the deployment bucket `refactor-deployment`. If you need to change this, copy `confile.yml.example` to `config.yml` and edit the `deploymentBucket` key.

#### Install python packages

Setup your virtual environment within this project's root directory and install packages

```sh
python -m venv ./.venv-refactor
source .venv-refactor/bin/activate
pip install -r requirements.txt
```

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

### Creating test users

Use the [aws](https://aws.amazon.com/cli/) cli to create a test user as described [here](https://serverless-stack.com/chapters/create-a-cognito-test-user.html).

Emails with the format `qa-test+{foo}@refactordaily.com` are preferred.

The default region for the project is `us-west-2`.

The client-id is the iOS/Android/Web client-id from the user pool. There are a number of places to find these, including the Cognito User Pools web console.

Example:

```sh
email=Test+1@RefactorDaily.com && \
aws cognito-idp sign-up \
  --region us-west-2 \
  --client-id $(sed -n '/^playground:$/,$p' config.yml | grep "cognitoUserPoolClientId:" | head -1 | xargs | cut -d" " -f2) \
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

Run `yarn test` (or just `jest`) to run regression tests against a deployment. The file `config.yml` must exist, which is created at the end of the deploy script.

### DynamoDB Table Design

| model |         pk         |        gsi1        |             gsi2              |   id    | notes                       |
| :---- | :----------------: | :----------------: | :---------------------------: | :-----: | :-------------------------- |
|       |   _hash / range_   |   _range / hash_   |        _type / scope_         |  _id_   |                             |
| User  | USER-ID / USER-ID  |        n/a         | 'USER' / TRIAL\|GUEST\|TEAM\* | USER-ID |                             |
| Habit | USER-ID / HABIT-ID | HABIT-ID / USER-ID |      'HABIT' / HABIT-ID       | ORG-ID  | 1 to Many                   |
| Task  | TASK-ID / HABIT-ID |        n/a         |  'TASK' / 'HABIT\|\*'         | TASK-ID | Filter by USER\|HABIT\|DATE |
