const Leaderboard = ({ players, results, title }) => {
  // Aggregate all events into a single list
  const events = results.reduce((acc, result) => {
    return [...acc, ...result.events]; // Flatten event lists
  }, []);

  // Aggregate Points
  const playerPoints = players.map((player) => {
    const totalPoints = events.reduce((acc, event) => {
      const result = event.results.find(
        (result) => result.player === player.player_id
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
        <h2 className="text-xl font-bold text-center p-4">{title}</h2>
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
                key={player.player_id}
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

export default Leaderboard;
