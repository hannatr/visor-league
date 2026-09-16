"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { ObjectId, type Filter } from "mongodb";
import { isAdminAuthenticated } from "@/utils/auth";
import { admins } from "@/models/Admin";
import { dfsResults } from "@/models/DFSResult";
import { players } from "@/models/Player";
import { results } from "@/models/Result";
import { tournaments } from "@/models/Tournament";
import type { DFSResultDoc } from "@/models/DFSResult";
import type { ResultDoc } from "@/models/Result";
import type { TournamentDoc } from "@/models/Tournament";
import type {
  ActionStatusResponse,
  AdminLoginResult,
  DFSLeague,
  Player as PlayerDTO,
  SeasonResult,
  Tournament as TournamentDTO,
} from "@/types/domain";

function toPlain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function fetchResults({
  current = false,
  season = "",
}: {
  current?: boolean;
  season?: string;
} = {}): Promise<SeasonResult[]> {
  try {
    const query: Filter<ResultDoc> = {};
    if (current) query.current = true;
    if (season) query.season = Number(season);

    const docs = await (await results()).find(query).toArray();
    return docs.map((doc) => toPlain<SeasonResult>(doc));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchPlayers(leagueOnly = false): Promise<PlayerDTO[]> {
  try {
    const query = leagueOnly ? { in_league: true } : {};
    const docs = await (await players()).find(query).toArray();
    return docs.map((doc) => toPlain<PlayerDTO>(doc));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchTournaments({
  current = false,
  season = "",
}: {
  current?: boolean;
  season?: string;
} = {}): Promise<TournamentDTO[]> {
  try {
    const query: Filter<TournamentDoc> = {};
    if (current) {
      query.current = true;
    }
    if (season) {
      query.year = parseInt(season, 10);
    }

    const docs = await (await tournaments()).find(query).toArray();
    return docs.map((doc) => toPlain<TournamentDTO>(doc));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchDFSResults({
  current = false,
  season = "",
}: {
  current?: boolean;
  season?: string | number;
} = {}): Promise<DFSLeague[]> {
  try {
    const query: Filter<DFSResultDoc> = {};
    if (current) query.current = true;
    if (season !== "" && season != null) query.season = Number(season);

    const docs = await (await dfsResults()).find(query).toArray();
    return docs.map((doc) => toPlain<DFSLeague>(doc));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateScore({
  token,
  scorecard_id,
  holeNumber,
  score,
}: {
  token: string | null;
  scorecard_id: number;
  holeNumber: number;
  score: number;
}): Promise<ActionStatusResponse> {
  try {
    if (token !== process.env.SCORE_TOKEN) {
      return { status: 403, error: "Forbidden" };
    }

    const collection = await tournaments();
    const tournament = await collection.findOne({ current: true });
    if (!tournament) {
      return { status: 404, error: "Tournament not found" };
    }

    const scorecard = tournament.scorecards.find(
      (sc) => sc.scorecard_id === scorecard_id,
    );

    if (!scorecard) {
      return { status: 404, error: "Scorecard not found" };
    }

    const holeScore = scorecard.scores.find(
      (hole) => hole.holeNumber === holeNumber,
    );
    if (holeScore) {
      holeScore.score = score;
    } else {
      scorecard.scores.push({ holeNumber, score });
    }

    await collection.replaceOne({ _id: tournament._id }, tournament);
    return { status: 200, error: "Scorecard updated" };
  } catch (error) {
    console.log("Error updating score:", error);
    return { status: 500, error: "Error updating score" };
  }
}

export async function updateDFSLeague({
  league,
}: {
  league: DFSLeague;
}): Promise<ActionStatusResponse> {
  try {
    if (!(await isAdminAuthenticated())) {
      return { status: 401, error: "Unauthorized" };
    }

    if (!league._id || !ObjectId.isValid(league._id)) {
      return { status: 404, error: "League not found" };
    }

    const result = await (
      await dfsResults()
    ).updateOne(
      { _id: ObjectId.createFromHexString(league._id) },
      {
        $set: {
          players: league.players.map((player) => ({
            name: player.name,
            scores: player.scores,
          })),
        },
      },
    );

    if (result.matchedCount === 0) {
      return { status: 404, error: "League not found" };
    }

    return { status: 200, message: "DFS League updated successfully" };
  } catch (error) {
    console.error("Error updating DFS League:", error);
    return { status: 500, error: "Error updating DFS League" };
  }
}

export async function adminLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AdminLoginResult> {
  try {
    const admin = await (await admins()).findOne({ username });
    if (!admin) {
      return { success: false, error: "Invalid username or password" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, error: "Invalid username or password" };
    }

    console.log(`Successful login by ${username}`);

    const cookieStore = await cookies();
    cookieStore.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging in admin:", error);
    return { success: false, error: "Server error" };
  }
}
