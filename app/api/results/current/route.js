import connectDB from "@/config/database";
import Result from "@/models/Result";

// Turn off caching
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";

// GET /api/results/current
export const GET = async () => {
  try {
    await connectDB();

    const results = await Result.findOne({ current: true });

    return new Response(JSON.stringify(results), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
