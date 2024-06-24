import connectDB from "@/config/database";
import Tournament from "@/models/Tournament";

// GET /api/tournaments/current
export const GET = async () => {
  try {
    await connectDB();

    const results = await Tournament.findOne({ current: true });

    return new Response(JSON.stringify(results), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
