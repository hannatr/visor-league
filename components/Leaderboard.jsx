import React, { useState } from "react";
import { FaTrophy, FaMedal, FaThumbsDown } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const Leaderboard = ({ players, results, title }) => {
  // Aggregate all events into a single list
  const events = results.reduce((acc, result) => {
    return [...acc, ...result.events]; // Flatten event lists
  }, []);

  // Function to count positions
  const countPositions = (playerId, points) => {
    return events.reduce((count, event) => {
      const result = event.results.find((result) => result.player === playerId);
      if (result && result.points === points) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  // Aggregate Points and Positions
  const playerStats = players.map((player) => {
    const totalPoints = events.reduce((acc, event) => {
      const result = event.results.find(
        (result) => result.player === player.player_id
      );
      return acc + (result ? result.points : 0);
    }, 0);

    const firsts = countPositions(player.player_id, 10);
    const seconds = countPositions(player.player_id, 9);
    const thirds = countPositions(player.player_id, 8);
    const lasts = events.reduce((count, event) => {
      const lastPlaces = event.results
        .filter((r) => r.points === 1)
        .map((r) => r.player);
      return lastPlaces.includes(player.player_id) ? count + 1 : count;
    }, 0);

    return { ...player, points: totalPoints, firsts, seconds, thirds, lasts };
  });

  // Sort Players by Points
  const [sortConfig, setSortConfig] = useState({
    key: "points",
    direction: "descending",
  });

  const sortedPlayers = [...playerStats].sort((a, b) => {
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
      <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center p-4">{title}</h2>
        <div className="overflow-x-auto md:overflow-hidden">
          <table className="min-w-full mb-6">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-6 py-1 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th
                  className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("points")}
                >
                  Points {getSortIcon("points")}
                </th>
                <th
                  className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("firsts")}
                >
                  <div className="flex flex-row items-center justify-center">
                    <FaTrophy className="text-yellow-500 mr-1" />
                    <span>1st</span> {getSortIcon("firsts")}
                  </div>
                </th>
                <th
                  className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("seconds")}
                >
                  <div className="flex flex-row items-center justify-center">
                    <FaMedal className="text-gray-400 mr-1" />
                    <span>2nd</span> {getSortIcon("seconds")}
                  </div>
                </th>
                <th
                  className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("thirds")}
                >
                  <div className="flex flex-row items-center justify-center">
                    <FaMedal className="text-yellow-700 mr-1" />
                    <span>3rd</span> {getSortIcon("thirds")}
                  </div>
                </th>
                <th
                  className="px-6 py-1 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("lasts")}
                >
                  <div className="flex flex-row items-center justify-center">
                    <FaThumbsDown className="text-red-500 mr-1" />
                    <span>Last</span> {getSortIcon("lasts")}
                  </div>
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
                    {player.name}
                  </td>
                  <td className="px-6 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.points}
                  </td>
                  <td className="px-6 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.firsts}
                  </td>
                  <td className="px-6 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.seconds}
                  </td>
                  <td className="px-6 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.thirds}
                  </td>
                  <td className="px-6 py-1 text-center whitespace-nowrap text-sm text-gray-500">
                    {player.lasts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
