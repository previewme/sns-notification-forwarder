# typescript-lambda

This is a template repository for creating typescript lambda projects.

After cloning this template, ensure that the appropriate sections of package.json are updated. We recommend modifying
the following fields as a minimum to suit your project.

* name
* version
* description
* license

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
