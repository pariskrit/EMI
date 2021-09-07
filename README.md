# EMI 3.0 Front-End

## Deploying a live test to S3

You can use the `npm run s3deploy` command to deploy a test version to an s3 bucket. To do this:

1. Make sure you have access to the s3 bucket in AWS. You can find the bucket name in the package.json file under scripts > s3deploy.
2. Run `npm run build` to create a deployable bundle.
3. Run `npm run s3deploy` to push your build folder to the s3 bucket.

4. You can find the static route in your AWS Consule (under s3 > select the bucket > properties > static web hosting > Endpoint).

<br/>

#### Module Paths

<br/>

| S.N | Module               | Path                                   | Document Path                                   |
| --- | -------------------- | -------------------------------------- | ----------------------------------------------- |
| 1   | Client Detail Screen | src/routes/Clients/ClientDetailScreen/ | src/routes/Clients/ClientDetailScreen/README.md |
| 1   | Sites Screen         | src/routes/Clients/Sites/              | src/routes/Clients/Sites/README.md              |
