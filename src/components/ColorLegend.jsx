import React from 'react';

const ColorLegend = () => {
  return (
    <div className="flex items-center">
      <div className="h-full border-l border-gray-200 mx-3"></div>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-gray-700">En rango (100%+)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-xs text-gray-700">Cerca (80-99%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs text-gray-700">Lejos (&lt;80%)</span>
        </div>
      </div>
    </div>
  );
};

export default ColorLegend;
