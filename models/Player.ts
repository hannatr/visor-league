import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import type { Player } from "@/types/domain";

export type PlayerDoc = Omit<Player, "_id"> & { _id: ObjectId };

export async function players(): Promise<Collection<PlayerDoc>> {
  const db = await getDb();
  return db.collection<PlayerDoc>("players");
}
