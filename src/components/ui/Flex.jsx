import React from 'react';
import PropTypes from 'prop-types';

const Flex = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = 'nowrap',
  gap = 0,
  className = '',
  ...props
}) => {
  // Definir las clases para cada propiedad
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  
  const wrapClasses = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
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
  const flexClasses = `
    flex
    ${directionClasses[direction] || directionClasses.row}
    ${alignClasses[align] || alignClasses.start}
    ${justifyClasses[justify] || justifyClasses.start}
    ${wrapClasses[wrap] || wrapClasses.nowrap}
    ${gapClasses[gap] || gapClasses[0]}
    ${className}
  `;
  
  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
};

Flex.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  wrap: PropTypes.oneOf(['wrap', 'nowrap', 'wrap-reverse']),
  gap: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 8, 10, 12]),
  className: PropTypes.string,
};

export default Flex;
