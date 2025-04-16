import React from 'react';
import PropTypes from 'prop-types';

const Divider = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  // Definir las clases para cada orientación
  const orientationClasses = {
    horizontal: 'w-full h-px my-4',
    vertical: 'h-full w-px mx-4',
  };
  
  // Construir las clases
  const dividerClasses = `
    ${orientationClasses[orientation] || orientationClasses.horizontal}
    bg-gray-200 dark:bg-gray-700
    ${className}
  `;
  
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={dividerClasses}
      {...props}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
};

export default Divider;
