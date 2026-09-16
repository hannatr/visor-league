import Link from "next/link";
import { fetchDFSResults } from "@/utils/requests";
import FDLeaderboard from "@/components/FDLeaderboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "DFS League - Visor League",
  description: "Current DFS League standings and results",
};

export default async function DFSPage() {
  const results = await fetchDFSResults({ current: true });
  const allResults = await fetchDFSResults();

  const pastLeagues = allResults
    .filter((r) => !r.current)
    .sort((a, b) => b.season - a.season);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <p className="text-muted-foreground">No Current DFS League Results</p>
        ) : (
          <FDLeaderboard results={results} title="DFS League Leaderboard" />
        )}
      </div>

      <div className="flex justify-center px-2 pb-6">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Past League Results</CardTitle>
            <CardDescription className="italic">
              The Visor DFS League is a long-running, competitive league among
              friends. The following is a list of past leagues for the history
              books.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {pastLeagues.map((league, index) => (
              <p key={league._id || index}>
                <Link
                  href={`/dfs/${league.season}`}
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {league.season}
                </Link>
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
