import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  // Obtener los estilos base del botón
  const baseStyles = theme.components.button.base;
  const variantStyles = theme.components.button[variant] || theme.components.button.primary;
  const sizeStyles = theme.components.button.sizes[size] || theme.components.button.sizes.md;
  
  // Construir las clases
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles}
    ${sizeStyles}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
