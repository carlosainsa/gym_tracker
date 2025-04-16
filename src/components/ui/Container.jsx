import React from 'react';
import PropTypes from 'prop-types';

const Container = ({
  children,
  maxWidth = 'lg',
  className = '',
  ...props
}) => {
  // Definir las clases de ancho máximo
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };
  
  // Construir las clases
  const containerClasses = `
    container mx-auto px-4 py-6
    ${maxWidthClasses[maxWidth] || maxWidthClasses.lg}
    ${className}
  `;
  
  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full']),
  className: PropTypes.string,
};

export default Container;
