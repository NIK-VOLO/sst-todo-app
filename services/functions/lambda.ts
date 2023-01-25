import { RDSDataService } from "aws-sdk";
import { Kysely, Generated, sql } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "@serverless-stack/node/rds";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

interface Database {
  tblcounter: {
    counter: string;
    tally: number;
  };
  tbltasks: {
    id: Generated<number>;
    task: string;
  };
}

const db = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: RDS.Cluster.defaultDatabaseName,
      secretArn: RDS.Cluster.secretArn,
      resourceArn: RDS.Cluster.clusterArn,
      client: new RDSDataService(),
    },
  }),
});

export async function addTask(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (event.body == null || event.body == undefined) {
    return { statusCode: 500, body: "Bad Request" };
  }

  const data = JSON.parse(event.body);

  const id = await db
    .insertInto("tbltasks")
    .values({
      task: data.task,
    })
    .returning("id")
    .executeTakeFirst();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Task ${id?.id} added.`,
      content: data.task,
    }),
  };
}

export async function removeTask(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const id =
    event.pathParameters && event.pathParameters.id
      ? event.pathParameters.id
      : null;

  if (!id) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: true }),
    };
  }

  await db
    .deleteFrom("tbltasks")
    .where(sql`id = ${id}`)
    .executeTakeFirst();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Task ${id} deleted.`,
    }),
  };
}

export async function handler() {
  const record = await db
    .selectFrom("tblcounter")
    .select("tally")
    .where("counter", "=", "hits")
    .executeTakeFirstOrThrow();

  let count = record.tally;

  await db
    .updateTable("tblcounter")
    .set({
      tally: ++count,
    })
    .execute();

  return {
    statusCode: 200,
    body: count,
  };
}
