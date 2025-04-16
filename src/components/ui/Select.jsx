import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const Select = ({
  id,
  label,
  options,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  // Obtener los estilos base del input (usamos los mismos que para los inputs)
  const baseStyles = theme.components.input.base;
  const errorStyles = error ? theme.components.input.error : '';
  const disabledStyles = disabled ? theme.components.input.disabled : '';
  
  // Construir las clases
  const selectClasses = `
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
      <select
        id={id}
        className={selectClasses}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;
