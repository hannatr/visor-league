import React from "react";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";

export const dynamic = "force-dynamic";

export default async function SeasonHistoryPage({ params }) {
  const { season } = await params;
  const results = await fetchResults({ season: `${season}` });
  const allPlayers = await fetchPlayers(true);

  // Filter players based on start_year
  const players = allPlayers.filter(
    (player) => !player.start_year || player.start_year <= parseInt(season)
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <Leaderboard
          players={players}
          results={results}
          title={`Pick'em Leaderboard ${season}`}
        />
        {results[0].events.map((event) => (
          <EventResults key={event.id} event={event} players={players} />
        ))}
      </div>
    </div>
  );
}
