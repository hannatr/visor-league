import Link from "next/link";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const results = await fetchResults();
  const players = await fetchPlayers(true);

  const pastSeasons = results
    .filter((event) => !event.current)
    .sort((a, b) => b.season - a.season);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <p className="text-muted-foreground">No Results</p>
        ) : (
          <>
            <Leaderboard
              players={players}
              results={results}
              title="History Leaderboard"
              showFirstSeason
            />
            <div className="flex justify-center py-6">
              <Card className="w-full max-w-4xl">
                <CardHeader>
                  <CardTitle className="text-center">Past Seasons</CardTitle>
                </CardHeader>
                <CardContent className="mb-2 flex flex-col items-center gap-2">
                  {pastSeasons.map((event) => (
                    <Link
                      className="text-lg font-bold text-primary hover:text-primary/80"
                      key={event.season}
                      href={`/history/${event.season}`}
                    >
                      {event.season}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
