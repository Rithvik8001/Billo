import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/models/schema";

const connectionString = process.env.DATABASE_URL as string;

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

export default db;
