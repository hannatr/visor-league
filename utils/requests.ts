"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import type { QueryFilter } from "mongoose";
import connectDB from "@/config/database";
import { isAdminAuthenticated } from "@/utils/auth";
import Result from "@/models/Result";
import Player from "@/models/Player";
import Tournament from "@/models/Tournament";
import DFSResult from "@/models/DFSResult";
import Admin from "@/models/Admin";
import type {
  ActionStatusResponse,
  AdminLoginResult,
  DFSLeague,
  Player as PlayerDTO,
  SeasonResult,
  Tournament as TournamentDTO,
} from "@/types/domain";
import type { ResultDoc } from "@/models/Result";
import type { TournamentDoc } from "@/models/Tournament";
import type { DFSResultDoc } from "@/models/DFSResult";

type MongoId = { _id?: { toString(): string } | string };

function convertIdToString<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertIdToString(item)) as T;
  }
  if (obj !== null && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(record, "_id")) {
      const id = record._id as MongoId["_id"];
      if (id != null && typeof id === "object" && "toString" in id) {
        record._id = id.toString();
      }
    }
    for (const key of Object.keys(record)) {
      record[key] = convertIdToString(record[key]);
    }
  }
  return obj;
}

export async function fetchResults({
  current = false,
  season = "",
}: {
  current?: boolean;
  season?: string;
} = {}): Promise<SeasonResult[]> {
  try {
    await connectDB();

    const query: QueryFilter<ResultDoc> = {};
    if (current) query.current = true;
    if (season) query.season = Number(season);

    const results = await Result.find(query).lean();

    if (!results || results.length === 0) {
      return [];
    }

    return convertIdToString(results) as unknown as SeasonResult[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchPlayers(leagueOnly = false): Promise<PlayerDTO[]> {
  try {
    await connectDB();

    const players = await Player.find({}).lean();

    if (leagueOnly) {
      return convertIdToString(
        players.filter((player) => player.in_league),
      ) as unknown as PlayerDTO[];
    }

    return convertIdToString(players) as unknown as PlayerDTO[];
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
    await connectDB();

    const query: QueryFilter<TournamentDoc> = {};
    if (current) {
      query.current = true;
    }
    if (season) {
      query.year = parseInt(season, 10);
    }

    const tournaments = await Tournament.find(query).lean();

    return convertIdToString(tournaments) as unknown as TournamentDTO[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchDFSResults({
  query = {},
}: {
  query?: QueryFilter<DFSResultDoc>;
} = {}): Promise<DFSLeague[]> {
  try {
    await connectDB();
    const results = await DFSResult.find(query).lean();

    return convertIdToString(results) as unknown as DFSLeague[];
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

    await connectDB();

    const tournament = await Tournament.findOne({ current: true });
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

    await tournament.save();
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

    await connectDB();

    const existingLeague = await DFSResult.findById(league._id);
    if (!existingLeague) {
      return { status: 404, error: "League not found" };
    }

    existingLeague.set(
      "players",
      league.players.map((player) => ({
        name: player.name,
        scores: player.scores,
      })),
    );

    await existingLeague.save();

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
    await connectDB();

    const admin = await Admin.findOne({ username }).lean();
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
