import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { RDSDataService } from "aws-sdk";
import { Kysely, Generated, sql } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "@serverless-stack/node/rds";

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

export const t = initTRPC.create();

const appRouter = t.router({
  getTasks: t.procedure.query(async (req) => {
    const data = await db.selectFrom("tbltasks").selectAll().execute();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  }),

  addTask: t.procedure
    .input(
      z.object({
        task: z.string(),
      })
    )
    .mutation(async (req) => {
      const id = await db
        .insertInto("tbltasks")
        .values({
          task: req.input.task,
        })
        .returning("id")
        .executeTakeFirst();

      return {
        statusCode: 200,
        body: {
          message: `Task ${id?.id} added.`,
          data: {
            id: id?.id,
            task: req.input.task,
          },
          //   content: req.input.task,
        },
      };
    }),

  getUser: t.procedure.input(z.string()).query((req) => {
    req.input; // string
    return { id: req.input, name: "Bilbo" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

export const handler = awsLambdaRequestHandler({
  router: appRouter,
});
