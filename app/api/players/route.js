import connectDB from "@/config/database";
import Player from "@/models/Player";

// GET /api/players
export const GET = async () => {
  try {
    await connectDB();

    const results = await Player.find({});

    return new Response(JSON.stringify(results), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
