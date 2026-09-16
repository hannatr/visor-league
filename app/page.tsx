import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";
import { fetchResults, fetchPlayers } from "@/utils/requests";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const results = await fetchResults({ current: true });
  const players = await fetchPlayers(true);

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
              title="Pick'em Leaderboard"
            />
            {results[0].events.map((event) => (
              <EventResults key={event.id} event={event} players={players} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
