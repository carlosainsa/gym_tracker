import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  // Obtener los estilos base del badge
  const baseStyles = theme.components.badge.base;
  const variantStyles = theme.components.badge[variant] || theme.components.badge.primary;
  
  // Construir las clases
  const badgeClasses = `
    ${baseStyles}
    ${variantStyles}
    ${className}
  `;
  
  return (
    <span
      className={badgeClasses}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error']),
  className: PropTypes.string,
};

export default Badge;
