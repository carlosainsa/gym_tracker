import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaInfoCircle } from 'react-icons/fa';

/**
 * Componente para la sección de configuración avanzada
 */
const AdvancedConfigSection = ({ 
  title, 
  icon, 
  bgColor, 
  borderColor, 
  iconColor,
  children,
  defaultExpanded = false,
  tooltip = null
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 flex items-center justify-between ${bgColor} border-b ${borderColor} transition-colors`}
      >
        <div className="flex items-center">
          {icon && (
            <span className={`mr-2 ${iconColor}`}>
              {icon}
            </span>
          )}
          <h2 className="font-semibold text-gray-800 dark:text-white">{title}</h2>
          {tooltip && (
            <div className="relative ml-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FaInfoCircle size={14} />
              </button>
              {showTooltip && (
                <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 left-0 top-full">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        <span>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      
      {expanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default AdvancedConfigSection;
