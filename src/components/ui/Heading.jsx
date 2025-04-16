import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({
  level = 1,
  children,
  className = '',
  ...props
}) => {
  // Definir las clases para cada nivel de encabezado
  const headingClasses = {
    1: 'text-3xl font-bold text-gray-900 dark:text-white',
    2: 'text-2xl font-semibold text-gray-800 dark:text-white',
    3: 'text-xl font-semibold text-gray-800 dark:text-white',
    4: 'text-lg font-medium text-gray-800 dark:text-white',
    5: 'text-base font-medium text-gray-800 dark:text-white',
    6: 'text-sm font-medium text-gray-800 dark:text-white',
  };
  
  // Construir las clases
  const classes = `${headingClasses[level] || headingClasses[1]} ${className}`;
  
  // Renderizar el encabezado según el nivel
  const HeadingTag = `h${level}`;
  
  return (
    <HeadingTag className={classes} {...props}>
      {children}
    </HeadingTag>
  );
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Heading;
