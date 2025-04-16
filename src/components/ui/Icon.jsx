import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({
  icon,
  size = 'md',
  color = 'default',
  className = '',
  ...props
}) => {
  // Definir las clases para cada tamaño
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  
  // Definir las clases para cada color
  const colorClasses = {
    default: 'text-gray-500 dark:text-gray-400',
    primary: 'text-primary-500 dark:text-primary-400',
    secondary: 'text-secondary-500 dark:text-secondary-400',
    success: 'text-success-500 dark:text-success-400',
    warning: 'text-warning-500 dark:text-warning-400',
    error: 'text-error-500 dark:text-error-400',
    white: 'text-white',
    black: 'text-black',
  };
  
  // Construir las clases
  const iconClasses = `
    ${sizeClasses[size] || sizeClasses.md}
    ${colorClasses[color] || colorClasses.default}
    ${className}
  `;
  
  return (
    <span className={iconClasses} aria-hidden="true" {...props}>
      {icon}
    </span>
  );
};

Icon.propTypes = {
  icon: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'white', 'black']),
  className: PropTypes.string,
};

export default Icon;
