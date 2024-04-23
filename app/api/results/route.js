import connectDB from "@/config/database";
import Result from "@/models/Result";

// GET /api/results
export const GET = async () => {
  try {
    await connectDB();

    const results = await Result.find({});

    return new Response(JSON.stringify(results), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
