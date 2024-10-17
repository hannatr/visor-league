"use client";
import React, { useState } from "react";
import { FaTrophy, FaMedal, FaThumbsDown, FaGem } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const FDLeaderboard = ({ results, title }) => {
  const league = results[0];
  const weeks = Object.keys(league.players[0].scores).length;

  // Transform the player data to include name, weekly scores, and total score
  const players = league.players
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
  players.forEach((player, index) => {
    player.rank = index + 1;
  });

  // Calculate the highest/lowest scores for each week
  const highestScores = Array.from({ length: weeks }).map((_, weekIndex) => {
    return Math.max(
      ...players.map((player) => player[`week ${weekIndex + 1}`])
    );
  });
  const lowestScores = Array.from({ length: weeks }).map((_, weekIndex) => {
    return Math.min(
      ...players.map((player) => player[`week ${weekIndex + 1}`])
    );
  });
  const highestOverallScore = Math.max(...highestScores);

  // Get total scores of the in-the-money players
  const firstPlaceTotal = players[0].total;
  const fourthPlaceTotal = players[3].total;

  // Sort Players by Total Points
  const [sortConfig, setSortConfig] = useState({
    key: "total",
    direction: "descending",
  });

  const sortedPlayers = [...players].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FiArrowUp className="ml-1 inline" />
    ) : (
      <FiArrowDown className="ml-1 inline" />
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl bg-white border border-green-700 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center p-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full mb-6">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="sticky left-0 px-3 py-1 text-center text-xs font-medium uppercase tracking-wider bg-green-700">
                  Rank
                </th>
                <th className="sticky left-[3rem] px-3 py-1 text-left text-xs font-medium uppercase tracking-wider bg-green-700">
                  Name
                </th>
                <th
                  className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider border-r cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  Total {getSortIcon("total")}
                </th>
                <th className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider border-r">
                  Off 1st
                </th>
                <th className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider border-r">
                  Off 4th
                </th>
                {/* Render dynamic headers for weeks */}
                {Array.from({ length: weeks }).map((_, i) => (
                  <th
                    key={i}
                    className="px-3 py-1 text-center text-xs font-medium uppercase tracking-wider border-r cursor-pointer"
                    onClick={() => handleSort(`week ${i + 1}`)}
                  >
                    {`Week ${i + 1}`} {getSortIcon(`week ${i + 1}`)}
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
                  <td className="sticky left-0 px-3 py-1 text-center whitespace-nowrap text-sm font-medium text-gray-900 bg-white">
                    {player.rank}
                  </td>
                  <td className="sticky left-[3rem] px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900 bg-white">
                    {player.name}
                  </td>
                  <td
                    className={`px-3 py-1 text-center whitespace-nowrap text-sm font-bold text-gray-900 border-r ${
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
                  <td className="px-3 py-1 text-center whitespace-nowrap text-sm text-gray-500 border-r">
                    {player.total - firstPlaceTotal >= 0
                      ? "-"
                      : (player.total - firstPlaceTotal).toFixed(2)}
                  </td>
                  <td className="px-3 py-1 text-center whitespace-nowrap text-sm text-gray-500 border-r">
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
                        className={`px-3 py-1 text-center whitespace-nowrap text-sm border-r ${
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
