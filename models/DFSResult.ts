import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import type { DFSLeague } from "@/types/domain";

export type DFSResultDoc = Omit<DFSLeague, "_id"> & { _id: ObjectId };

export async function dfsResults(): Promise<Collection<DFSResultDoc>> {
  const db = await getDb();
  return db.collection<DFSResultDoc>("dfs-results");
}
