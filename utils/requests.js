"use server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import connectDB from "@/config/database";
import Result from "@/models/Result";
import Player from "@/models/Player";
import Tournament from "@/models/Tournament";
import DFSResult from "@/models/DFSResult";
import Admin from "@/models/Admin";

const convertIdToString = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertIdToString);
  } else if (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("_id")
  ) {
    obj._id = obj._id.toString();
  }
  return obj;
};

async function fetchResults({ current = false, season = "" } = {}) {
  try {
    await connectDB();

    const query = {};
    if (current) query.current = true;
    if (season) query.season = season;

    const results = await Result.find(query).lean();

    if (!results || results.length === 0) {
      return [];
    }

    return convertIdToString(results);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchPlayers(leagueOnly = false) {
  try {
    await connectDB();

    let players = await Player.find({}).lean();

    if (leagueOnly) {
      players = players.filter((player) => player.in_league);
    }

    return convertIdToString(players);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchTournaments({ current = false, season = "" } = {}) {
  try {
    await connectDB();

    const query = {};
    if (current) {
      query.current = true;
    }
    if (season) {
      query.year = parseInt(season);
    }

    const tournaments = await Tournament.find(query).lean();

    return convertIdToString(tournaments);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchDFSResults({ query = {} } = {}) {
  try {
    await connectDB();
    const results = await DFSResult.find(query).lean();

    return convertIdToString(results);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateScore({ token, scorecard_id, holeNumber, score }) {
  try {
    if (token !== process.env.SCORE_TOKEN) {
      return { status: 403, error: "Forbidden" };
    }

    await connectDB();

    const tournament = await Tournament.findOne({ current: true });
    if (!tournament) {
      return { status: 404, error: "Tournament not found" };
    }

    const scorecard = tournament.scorecards.find((scorecard) => {
      return scorecard.scorecard_id === scorecard_id;
    });

    if (!scorecard) {
      return { status: 404, error: "Scorecard not found" };
    }

    const holeScore = scorecard.scores.find(
      (hole) => hole.holeNumber === holeNumber
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

async function updateDFSLeague({ league }) {
  try {
    await connectDB();

    // Find the league document in the database by _id (or another unique field)
    const existingLeague = await DFSResult.findById(league._id);

    if (!existingLeague) {
      return { status: 404, error: "League not found" };
    }

    // Update the players and their scores
    existingLeague.players = league.players.map((player) => ({
      name: player.name,
      scores: player.scores,
    }));

    // Save the updated document
    await existingLeague.save();

    return { status: 200, message: "DFS League updated successfully" };
  } catch (error) {
    console.error("Error updating DFS League:", error);
    return { status: 500, error: "Error updating DFS League" };
  }
}

async function adminLogin({ username, password }) {
  try {
    await connectDB();

    // Find the admin by username
    const admin = await Admin.findOne({ username }).lean();
    if (!admin) {
      return { success: false, error: "Invalid username or password" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, error: "Invalid username or password" };
    }

    console.log(`Successful login by ${username}`);

    // If login is successful, set a cookie
    const cookieStore = await cookies();
    cookieStore.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging in admin:", error);
    return { success: false, error: "Server error" };
  }
}

export {
  fetchResults,
  fetchPlayers,
  fetchTournaments,
  fetchDFSResults,
  updateScore,
  updateDFSLeague,
  adminLogin,
};
