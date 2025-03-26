import React from "react";

const RulesPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl mb-4 overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-bold">Rules</h2>
              <p className="text-sm text-gray-600 italic">
                Last Updated: April 24, 2024
              </p>
              <p className="mt-2 text-md">
                There will be 14 events throughout the season. Each event will
                have a clear scoring system. Points are awarded 10 through 1 for
                places 1 through 10. The last event will likely revolve around
                the Super Bowl. There will be no playoffs. Everyone will be
                eligible for the season long prizes throughout the entire
                season.
              </p>
              <p className="mt-2 text-md">Tiebreaker Rules:</p>
              <ul className="mt-1 list-disc pl-5">
                <li className="mb-1">
                  Tie for places 1 to 3: Tie goes to whoever has more points in
                  the current season long competition. If that is a tie, tie
                  goes to whoever had more points in previous season.
                </li>
                <li className="mb-1">
                  Tie for last place: Acts as a tie, all in tie get last place
                  (and last place points).
                </li>
                <li className="mb-1">
                  Tie for any other place: Acts as a tie, all in tie get higher
                  place (and higher place points).
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-bold">Dues and Payouts</h2>
              <p className="mt-1 text-md">Dues: $125</p>
              <p className="mt-1 text-md">Payouts:</p>
              <ul className="mt-1 list-disc pl-5">
                <li className="mb-1">Season Long 1st Place: $500</li>
                <li className="mb-1">Season Long 2nd Place: $300</li>
                <li className="mb-1">Season Long 3rd Place: $125</li>
                <li className="mb-1">Individual Event Win: $50</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
