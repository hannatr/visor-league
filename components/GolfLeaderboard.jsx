import React from "react";

const GolfLeaderboard = ({ tournament, players }) => {
  // Calculate the total score for each team
  const calculateTotalScore = (scores) => {
    return scores.reduce(
      (total, score) => total + (score.score !== 0 ? score.score : 0),
      0
    );
  };

  // Calculate the total par for holes played
  const calculateTotalPar = (scores, holes) => {
    return scores.reduce(
      (total, score, index) =>
        total + (score.score !== 0 ? holes[index].par : 0),
      0
    );
  };

  // Get player names from player IDs
  const getPlayerNames = (playerIds) => {
    return playerIds
      .map((id) => {
        const player = players.find((player) => player.player_id === id);
        return player ? player.name : "Unknown";
      })
      .join(", ");
  };

  const sortedScorecards = [...tournament.scorecards].sort((a, b) => {
    const totalScoreA = calculateTotalScore(a.scores);
    const totalScoreB = calculateTotalScore(b.scores);
    const totalParA = calculateTotalPar(a.scores, tournament.holes);
    const totalParB = calculateTotalPar(b.scores, tournament.holes);
    return totalScoreA - totalParA - (totalScoreB - totalParB);
  });

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mt-8">
          {tournament.title}
        </h2>
        <p className="text-sm text-center text-gray-600">{tournament.date}</p>
        <p className="text-sm text-center text-gray-600">{tournament.course}</p>
        <div className="overflow-x-auto md:overflow-hidden">
          <table className="min-w-full mb-6 mt-4">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                  Players
                </th>
                <th className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider">
                  Thru
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedScorecards.map((scorecard, index) => {
                const totalScore = calculateTotalScore(scorecard.scores);
                const totalPar = calculateTotalPar(
                  scorecard.scores,
                  tournament.holes
                );
                const relativeScore = totalScore - totalPar;
                const relativeScoreString =
                  relativeScore === 0
                    ? "E"
                    : relativeScore > 0
                    ? `+${relativeScore}`
                    : `${relativeScore}`;
                const holesPlayed = scorecard.scores.filter(
                  (score) => score.score !== 0
                ).length;
                return (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-medium text-gray-900">
                      {scorecard.team}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs font-medium text-gray-500">
                      {getPlayerNames(scorecard.playerIds)}
                    </td>
                    <td className="px-6 py-1 text-center whitespace-nowrap text-xs font-medium text-gray-500">
                      {relativeScoreString}
                    </td>
                    <td className="px-6 py-1 text-center whitespace-nowrap text-xs font-medium text-gray-500">
                      {holesPlayed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GolfLeaderboard;
