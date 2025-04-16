import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({
  children,
  columns = 1,
  gap = 4,
  className = '',
  ...props
}) => {
  // Definir las clases para cada propiedad
  const columnsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };
  
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  };
  
  // Construir las clases
  const gridClasses = `
    grid
    ${columnsClasses[columns] || columnsClasses[1]}
    ${gapClasses[gap] || gapClasses[4]}
    ${className}
  `;
  
  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 12]),
  gap: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 8, 10, 12]),
  className: PropTypes.string,
};

export default Grid;
