import connectDB from "@/config/database";
import Tournament from "@/models/Tournament";

// GET /api/tournaments
export const GET = async () => {
  try {
    await connectDB();

    const results = await Tournament.find({});

    return new Response(JSON.stringify(results), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};

// POST /api/tournaments
export const POST = async (req) => {
  try {
    await connectDB();

    const { scorecard_id, holeNumber, score } = await req.json();

    const tournament = await Tournament.findOne({ current: true });
    if (!tournament) {
      return new Response(JSON.stringify({ error: "Tournament not found" }), {
        status: 404,
      });
    }

    const scorecard = tournament.scorecards.find((scorecard) => {
      return scorecard.scorecard_id === scorecard_id;
    });

    if (!scorecard) {
      return new Response(JSON.stringify({ error: "Scorecard not found" }), {
        status: 404,
      });
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.log("Error updating score:", error);
    return new Response(JSON.stringify({ error: "Error updating score" }), {
      status: 500,
    });
  }
};
