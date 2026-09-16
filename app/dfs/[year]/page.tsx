import Link from "next/link";
import { fetchDFSResults } from "@/utils/requests";
import FDLeaderboard from "@/components/FDLeaderboard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return {
    title: `${year} DFS League - Visor League`,
    description: `${year} DFS League standings and historical results`,
  };
}

export default async function DFSYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const results = await fetchDFSResults({ season: year });

  const league = results.find((r) => r.season === parseInt(year, 10)) || null;

  if (!league) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 font-heading text-3xl font-bold">
              DFS League Not Found
            </h1>
            <Link
              href="/dfs"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Back to DFS League
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <FDLeaderboard
          results={[league]}
          title={`${league.season} DFS League Leaderboard`}
        />
      </div>
    </div>
  );
}
