import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/postgres";

const client = postgres(connectionString, {
  max: 100,
  idle_timeout: 10_000,
  connect_timeout: 30_000,
});

export const db = drizzle(client, { schema });
