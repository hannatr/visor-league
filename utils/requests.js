"use server";
import connectDB from "@/config/database";
import Result from "@/models/Result";
import Player from "@/models/Player";
import Tournament from "@/models/Tournament";
import DFSResult from "@/models/DFSResult";

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
      players = players.filter(
        (player) => player.player_id >= 1 && player.player_id <= 10
      );
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
      query.season = season;
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

export {
  fetchResults,
  fetchPlayers,
  fetchTournaments,
  fetchDFSResults,
  updateScore,
};
