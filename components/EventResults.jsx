const EventResults = ({ event, players }) => {
  const findPlayerName = (playerId) => {
    const player = players.find((player) => player.player_id === playerId);
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
export default EventResults;
