# sns-notification-forwarder

Forwards events received from a SNS topic to another SNS topic

## Build

To build the lambda function run the following.

```
npm install
npm build
```

## Test

To run the tests.

```
npm test
```

## Package

The following will package the lambda function into a zip bundle to allow manual deployment.

```
zip -q -r dist/lambda.zip node_modules dist
```

## Deployment
The Lambda function requires publish permissions to the SNS topic. 

The environment variables below must be set:
* SNS_ARN

AWS_REGION is a reserved environment variable and will be set automatically by AWS.
