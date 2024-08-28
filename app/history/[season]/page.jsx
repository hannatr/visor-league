import React from "react";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";
import connectDB from "@/config/database";

export default async function SeasonHistoryPage({ params }) {
  await connectDB();
  const { season } = params;
  const results = await fetchResults({ season: `${season}` });
  const players = await fetchPlayers(true);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <Leaderboard
          players={players}
          results={[results]}
          title={`Pick'em Leaderboard ${season}`}
        />
        {results.events.map((event) => (
          <EventResults key={event.id} event={event} players={players} />
        ))}
      </div>
    </div>
  );
}
