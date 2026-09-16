import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import type { SeasonResult } from "@/types/domain";

export type ResultDoc = Omit<SeasonResult, "_id"> & { _id: ObjectId };

export async function results(): Promise<Collection<ResultDoc>> {
  const db = await getDb();
  return db.collection<ResultDoc>("results");
}
