import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface BackendStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneId: string;
  jwtSecret: string;
  googleClientId: string;
  googleClientSecret: string;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { domain, jwtSecret, googleClientId, googleClientSecret } = props;

    // DynamoDB Tables
    const usersTable = new dynamodb.Table(this, "UsersTable", {
      partitionKey: { name: "userEmail", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    usersTable.addGlobalSecondaryIndex({
      indexName: "username-index",
      partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
    });

    // Lambda function
    const fn = new lambda.Function(this, "BackendFunction", {
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: "python_backend.handler.lambda_handler",
      code: lambda.Code.fromAsset("../python_backend/deployment.zip"),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        USERS_TABLE: usersTable.tableName,
        JWT_SECRET: jwtSecret,
        GOOGLE_CLIENT_ID: googleClientId,
        GOOGLE_CLIENT_SECRET: googleClientSecret,
        FRONTEND_URL: `https://${domain}`,
        GOOGLE_REDIRECT_URI: `https://${domain}/oauth/callback`,
      },
    });

    // Grant permissions
    usersTable.grantReadWriteData(fn);

    // API Gateway
    const api = new apigateway.RestApi(this, "Api", {
      restApiName: "FILLIN_PROJECT_NAME API",
      defaultCorsPreflightOptions: {
        allowOrigins: [`https://${domain}`, "http://localhost:5173"],
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowCredentials: true,
      },
    });

    const apiResource = api.root.addResource("api");
    apiResource.addMethod("POST", new apigateway.LambdaIntegration(fn));

  }
}
