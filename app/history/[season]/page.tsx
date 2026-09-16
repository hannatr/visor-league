import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";

export const dynamic = "force-dynamic";

export default async function SeasonHistoryPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const results = await fetchResults({ season: `${season}` });
  const allPlayers = await fetchPlayers(true);

  const players = allPlayers.filter(
    (player) => !player.start_year || player.start_year <= parseInt(season, 10),
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <Leaderboard
          players={players}
          results={results}
          title={`Pick'em Leaderboard ${season}`}
        />
        {results[0]?.events.map((event) => (
          <EventResults key={event.id} event={event} players={players} />
        ))}
      </div>
    </div>
  );
}
