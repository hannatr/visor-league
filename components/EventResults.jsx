"use client";
import React, { useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { FaTrophy, FaMedal } from "react-icons/fa";

const EventResults = ({ event, players }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const findPlayerName = (playerId) => {
    const player = players.find((player) => player.player_id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const areAllPointsZero = () => {
    return event.results.every((result) => result.points === 0);
  };

  const renderTopThree = () => {
    const topThreeResults = event.results.slice(0, 3);
    const placeIcons = [
      { icon: <FaTrophy key={1} className="text-yellow-500" />, color: "gold" },
      { icon: <FaMedal key={2} className="text-gray-400" />, color: "silver" },
      {
        icon: <FaMedal key={3} className="text-yellow-700" />,
        color: "bronze",
      },
    ];

    return (
      <div className="p-4 bg-green-700 text-white flex justify-between">
        {topThreeResults.map((result, index) => (
          <div key={result.player} className="flex items-center">
            {placeIcons[index].icon}
            <span className="ml-2">
              {findPlayerName(result.player)} ({result.points})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-8 flex justify-center">
      <div className="relative w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
        <div className="p-4 relative">
          <h2 className="text-xl font-bold text-center">
            Event {event.id}: {event.name}
          </h2>
          <p className="text-sm text-center text-gray-600">
            {event.description}
          </p>
          <p className="mt-1 text-sm text-center text-gray-600">{event.date}</p>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-600"
          >
            {isCollapsed ? <FiArrowDown size={24} /> : <FiArrowUp size={24} />}
          </button>
        </div>
        {isCollapsed ? (
          areAllPointsZero() ? (
            <div className="p-4 bg-green-700 text-white text-center">
              Event in Progress...
            </div>
          ) : (
            renderTopThree()
          )
        ) : (
          <table className="min-w-full mb-6">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">
                  Place
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">
                  Raw
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">
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
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {findPlayerName(result.player)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {result.raw}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                    {result.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventResults;
