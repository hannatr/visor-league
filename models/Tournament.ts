import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import type { Tournament } from "@/types/domain";

export type TournamentDoc = Omit<Tournament, "_id"> & { _id: ObjectId };

export async function tournaments(): Promise<Collection<TournamentDoc>> {
  const db = await getDb();
  return db.collection<TournamentDoc>("tournaments");
}
