#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CertificateStack } from "../lib/certificate";
import { FrontendStack } from "../lib/frontend";
import { BackendStack } from "../lib/backend";

const app = new cdk.App();

const prefix = "FILLIN_PROJECT_PREFIX";
const domain = "FILLIN_DOMAIN";
const env = {
  account: "FILLIN_AWS_ACCOUNT_ID",
  region: "FILLIN_AWS_REGION",
};

const hostedZoneId = "FILLIN_HOSTED_ZONE_ID";

// Certificate must be in us-east-1 for CloudFront
const certStack = new CertificateStack(app, `${prefix}CertificateStack`, {
  env: { account: env.account, region: "us-east-1" },
  domain,
  hostedZoneId,
});

new FrontendStack(app, `${prefix}FrontendStack`, {
  env,
  domain,
  hostedZoneId,
  certificate: certStack.certificate,
});

new BackendStack(app, `${prefix}BackendStack`, {
  env,
  domain,
  hostedZoneId,
  jwtSecret: "FILLIN_JWT_SECRET",
  googleClientId: "FILLIN_GOOGLE_CLIENT_ID",
  googleClientSecret: "FILLIN_GOOGLE_CLIENT_SECRET",
});
