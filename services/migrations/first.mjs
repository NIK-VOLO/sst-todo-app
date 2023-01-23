import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {

  // Template table schema
  await db.schema
    .createTable("tblcounter")
    .addColumn("counter", "text", (col) => col.primaryKey())
    .addColumn("tally", "integer")
    .execute();

  await db
    .insertInto("tblcounter")
    .values({
      counter: "hits",
      tally: 0,
    })
    .execute();

  
    // My table schema for storing Todo tasks
    await db.schema
    .createTable("tbltasks")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("task", "text")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("tblcounter").execute();
}