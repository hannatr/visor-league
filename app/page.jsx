import React from "react";
import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";
import connectDB from "@/config/database";
import { fetchResults, fetchPlayers } from "@/utils/requests";

export default async function HomePage() {
  await connectDB();
  const results = await fetchResults({ current: true });
  const players = await fetchPlayers(true);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <p>No Results</p>
        ) : (
          <>
            <Leaderboard
              players={players}
              results={[results]}
              title="Pick'em Leaderboard"
            />
            {results.events.map((event) => (
              <EventResults key={event.id} event={event} players={players} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
