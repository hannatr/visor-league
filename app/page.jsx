import React from "react";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch results from database
async function fetchResults() {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/results`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

const Leaderboard = ({ players, events }) => {
  // Aggregate Points
  const playerPoints = players.map((player) => {
    const totalPoints = events.reduce((acc, event) => {
      const result = event.results.find(
        (result) => result.player === player.id
      );
      return acc + (result ? result.points : 0);
    }, 0);
    return { ...player, points: totalPoints };
  });

  // Sort Players by Points
  const sortedPlayers = playerPoints.sort((a, b) => b.points - a.points);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center p-4">
          Pick'em Leaderboard 2024
        </h2>
        <table className="min-w-full mb-6">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Place
              </th>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.name}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                  {player.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EventResults = ({ event, players }) => {
  const findPlayerName = (playerId) => {
    const player = players.find((player) => player.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  return (
    <div className="my-8 flex justify-center">
      <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-center">
            Event {event.id}: {event.name}
          </h2>
          <p className="text-sm text-center text-gray-600">
            {event.description}
          </p>
          <p className="mt-1 text-sm text-center text-gray-600">{event.date}</p>
        </div>
        <table className="min-w-full mb-6">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Place
              </th>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Raw
              </th>
              <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {event.results.map((result, index) => (
              <tr
                key={result.player}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {findPlayerName(result.player)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                  {result.raw}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                  {result.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HomePage = async () => {
  let content;
  const data = await fetchResults();

  if (data.length === 0) {
    content = <div>No results available.</div>;
  } else {
    const currentSeason = data[0];
    content = (
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <Leaderboard
            players={currentSeason.players}
            events={currentSeason.events}
          />
          {currentSeason.events.map((event) => (
            <EventResults
              key={event.id}
              event={event}
              players={currentSeason.players}
            />
          ))}
        </div>
      </div>
    );
  }
  return content;
};

export default HomePage;
