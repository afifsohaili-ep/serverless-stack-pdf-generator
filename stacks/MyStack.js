import * as sst from "@serverless-stack/resources";
import { LayerVersion } from "@aws-cdk/aws-lambda";

const layerArn = "arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:25";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      routes: {
        "GET /downloads/receipt": {
          function: {
            handler: "src/lambda.handler",
            // Increase the timeout for generating screenshots
            timeout: 15,
            // Load Chrome in a Layer
            layers: [LayerVersion.fromLayerVersionArn(this, "Layer", layerArn)],
            // Exclude bundling it in the Lambda function
            bundle: { externalModules: ["chrome-aws-lambda"] },
          }
        },
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      "ApiEndpoint": api.url,
    });
  }
}
