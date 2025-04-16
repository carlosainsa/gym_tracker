import React from 'react';

const HorizontalColorLegend = () => {
  return (
    <div className="flex flex-col">
      <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Evaluación</h4>
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2.5 shadow-sm"></div>
          <span className="text-xs font-medium text-gray-700">En rango (≥100%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2.5 shadow-sm"></div>
          <span className="text-xs font-medium text-gray-700">Cerca (80-99%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2.5 shadow-sm"></div>
          <span className="text-xs font-medium text-gray-700">Lejos (&lt;80%)</span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalColorLegend;
