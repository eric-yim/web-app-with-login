import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

interface FrontendStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneId: string;
  certificate: acm.ICertificate;
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, { ...props, crossRegionReferences: true });

    const { domain, hostedZoneId, certificate } = props;

    // Route53 hosted zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId,
      zoneName: domain,
    });

    // S3 bucket for frontend
    const bucket = new s3.Bucket(this, "FrontendBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      enforceSSL: true,
    });

    // CloudFront function: rewrite "/" to "/index.html"
    const rewriteFunction = new cloudfront.Function(this, "RewriteFunction", {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          if (request.uri === '/') {
            request.uri = '/index.html';
          }
          return request;
        }
      `),
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: rewriteFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      domainNames: [domain],
      certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/__spa-fallback.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/__spa-fallback.html",
        },
      ],
    });

    // Deploy frontend build to S3
    new s3deploy.BucketDeployment(this, "DeployFrontend", {
      sources: [s3deploy.Source.asset("../frontend/build/client")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // DNS record
    new route53.ARecord(this, "ARecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Outputs
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
    });
    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
  }
}
