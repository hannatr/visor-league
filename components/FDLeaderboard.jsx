"use client";
import React from "react";
import { FaTrophy, FaMedal, FaThumbsDown, FaGem } from "react-icons/fa";

const FDLeaderboard = ({ results, title }) => {
  const league = results[0];
  const weeks = Object.keys(league.players[0].scores).length;

  // Transform the player data to include name, weekly scores, and total score
  const sortedPlayers = league.players
    .map((player) => {
      const transformed = { name: player.name, total: 0 };

      player.scores.forEach((result, index) => {
        transformed[`week ${index + 1}`] = result;
        transformed.total += result;
      });
      transformed.total = transformed.total.toFixed(2);
      return transformed;
    })
    .sort((a, b) => b.total - a.total); // Sort players by total in descending order

  // Add rank to each player
  sortedPlayers.forEach((player, index) => {
    player.rank = index + 1;
  });

  // Calculate the highest/lowest scores for each week
  const highestScores = Array.from({ length: weeks }).map((_, weekIndex) => {
    return Math.max(
      ...sortedPlayers.map((player) => player[`week ${weekIndex + 1}`])
    );
  });
  const lowestScores = Array.from({ length: weeks }).map((_, weekIndex) => {
    return Math.min(
      ...sortedPlayers.map((player) => player[`week ${weekIndex + 1}`])
    );
  });
  const highestOverallScore = Math.max(...highestScores);

  // Get total scores of the in-the-money players
  const firstPlaceTotal = sortedPlayers[0].total;
  const fourthPlaceTotal = sortedPlayers[3].total;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl bg-white border border-green-700 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center p-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full mb-6">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-3 py-1 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider">
                  Off 1st
                </th>
                <th className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider">
                  Off 4th
                </th>
                {/* Render dynamic headers for weeks */}
                {Array.from({ length: weeks }).map((_, i) => (
                  <th
                    key={i}
                    className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider"
                  >
                    {`Week ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlayers.map((player, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-1 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.rank}
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.name}
                  </td>
                  <td
                    className={`px-3 py-1 text-center whitespace-nowrap text-sm font-bold text-gray-900 ${
                      player.rank <= 4 ? "bg-green-200" : ""
                    }`}
                  >
                    {player.rank === 1 && (
                      <FaTrophy className="text-yellow-500 inline mr-1" />
                    )}
                    {player.rank === 2 && (
                      <FaMedal className="text-gray-400 inline mr-1" />
                    )}
                    {player.rank === 3 && (
                      <FaMedal className="text-yellow-700 inline mr-1" />
                    )}
                    {player.rank === 4 && (
                      <FaMedal className="text-red-500 inline mr-1" />
                    )}
                    {player.total}
                  </td>
                  <td className="px-3 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.total - firstPlaceTotal >= 0
                      ? "-"
                      : (player.total - firstPlaceTotal).toFixed(2)}
                  </td>
                  <td className="px-3 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.total - fourthPlaceTotal >= 0
                      ? "-"
                      : (player.total - fourthPlaceTotal).toFixed(2)}
                  </td>
                  {/* Render each week's score with highest score highlighted */}
                  {Array.from({ length: weeks }).map((_, weekIndex) => {
                    const score = player[`week ${weekIndex + 1}`];
                    const isHighest =
                      score === highestScores[weekIndex] &&
                      score != highestOverallScore;
                    const isLowest = score === lowestScores[weekIndex];
                    const isOverallHigh = score === highestOverallScore;

                    return (
                      <td
                        key={weekIndex}
                        className={`px-3 py-1 text-center whitespace-nowrap text-sm ${
                          isHighest || isOverallHigh
                            ? "bg-green-200 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {isOverallHigh && (
                          <FaGem className="inline-block mr-1 text-blue-500" />
                        )}
                        {isHighest && (
                          <FaTrophy className="inline-block mr-1 text-yellow-500" />
                        )}
                        {isLowest && (
                          <FaThumbsDown className="inline-block mr-1 text-red-500" />
                        )}
                        {score}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FDLeaderboard;
