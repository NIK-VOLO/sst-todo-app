import { RDSDataService } from "aws-sdk";
import { Kysely, Generated, sql } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "@serverless-stack/node/rds";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/*****************************************
 *
 *          OBSOLETE CODE
 *
 *****************************************/

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

export async function getTasks(): Promise<APIGatewayProxyResult> {
  const data = await db.selectFrom("tbltasks").selectAll().execute();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

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

export async function updateTask(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (event.body == null || event.body == undefined) {
    return { statusCode: 500, body: "Bad Request" };
  }

  const data = JSON.parse(event.body);

  console.log(data);

  const id = await db
    .updateTable("tbltasks")
    .set({ task: "test12" })
    .where("id", "=", 1)
    .returning("id")
    .executeTakeFirst();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Task ${id?.id} updated.`,
      content: data.task,
    }),
  };
}

export async function removeTask(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const id =
    event.pathParameters && event.pathParameters.id
      ? parseInt(event.pathParameters.id)
      : 0;

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
