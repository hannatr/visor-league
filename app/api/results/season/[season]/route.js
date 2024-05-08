import connectDB from "@/config/database";
import Result from "@/models/Result";

// GET /api/results/season/:season
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const results = await Result.findOne({ season: params.season });

    return new Response(JSON.stringify(results), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
