# Environment
You will need the following installed:
```
$ npm install -g yo generator-serverless-policy serverless
```
You will need aws-cli
# Deployment
## Packaging
```
aws cloudformation package \
  --template-file template.yaml \
  --output-template-file serverless-output.yaml \
  --s3-bucket refactor-serverless \
  --profile refactor # optional
```

## Deploying
```
aws cloudformation deploy \
    --template-file ./serverless-output.yaml \
    --stack-name staging \
    --capabilities CAPABILITY_IAM \
    --profile refactor # optional
```
