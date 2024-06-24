import React, { useState, useEffect } from "react";

const ScoreEntry = ({ show, onClose, hole, score, onSave }) => {
  //  TODO fix the state after a save
  const [holeScore, setHoleScore] = useState(score);

  useEffect(() => {
    setHoleScore(score);
  }, [score]);

  const handleSave = () => {
    onSave(holeScore);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Hole {hole.holeNumber}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Par: {hole.par}</p>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Score
                </label>
                <input
                  type="number"
                  value={holeScore}
                  onChange={(e) => setHoleScore(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreEntry;
