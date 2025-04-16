import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const Input = ({
  id,
  label,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  // Obtener los estilos base del input
  const baseStyles = theme.components.input.base;
  const errorStyles = error ? theme.components.input.error : '';
  const disabledStyles = disabled ? theme.components.input.disabled : '';
  
  // Construir las clases
  const inputClasses = `
    ${baseStyles}
    ${errorStyles}
    ${disabledStyles}
    ${className}
  `;
  
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputClasses}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
