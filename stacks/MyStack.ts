import { Api, RDS, StackContext } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const DATABASE = "CounterDB";

  // Create the Aurora DB cluster
  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql10.14",
    defaultDatabaseName: DATABASE,
    migrations: "services/migrations",
  });
}
