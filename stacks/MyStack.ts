import {
  Api,
  RDS,
  ReactStaticSite,
  StackContext,
} from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const DATABASE = "TodoDB";

  // Create the Aurora DB cluster
  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql10.14",
    defaultDatabaseName: DATABASE,
    migrations: "services/migrations",
  });

  // Create a HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [cluster],
      },
    },
    routes: {
      "GET /trpc/{proxy+}": "functions/trpc.handler",
      "POST /trpc/{proxy+}": "functions/trpc.handler",
      "DELETE /trpc/{proxy+}": "functions/trpc.handler",

      // ****** OBSOLETE CODE ******
      // "POST /": "functions/lambda.handler",
      // "GET /tasks": "functions/lambda.getTasks",
      // "POST /tasks": "functions/lambda.addTask",
      // "PUT /tasks": "functions/lambda.updateTask",
      // "DELETE /tasks/{id}": "functions/lambda.removeTask",
    },
  });

  // Deploy our React app
  // TODO: ReactStaticSite is going to be deprecated in v2
  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.url,
    },
  });

  // Show the resource info in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });
}
