import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/config/database";

export type AdminDoc = {
  _id: ObjectId;
  username: string;
  password: string;
};

export async function admins(): Promise<Collection<AdminDoc>> {
  const db = await getDb();
  return db.collection<AdminDoc>("admin");
}
