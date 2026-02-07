import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface CertificateStackProps extends cdk.StackProps {
  domain: string;
  hostedZoneId: string;
}

export class CertificateStack extends cdk.Stack {
  public readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, { ...props, crossRegionReferences: true });

    const { domain, hostedZoneId } = props;

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId,
      zoneName: domain,
    });

    this.certificate = new acm.Certificate(this, "Certificate", {
      domainName: domain,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
  }
}
