import React from 'react';
import PropTypes from 'prop-types';

const Text = ({
  variant = 'body',
  children,
  className = '',
  ...props
}) => {
  // Definir las clases para cada variante de texto
  const textClasses = {
    body: 'text-base text-gray-700 dark:text-gray-300',
    lead: 'text-lg text-gray-600 dark:text-gray-400',
    small: 'text-sm text-gray-600 dark:text-gray-400',
    muted: 'text-sm text-gray-500 dark:text-gray-500',
    caption: 'text-xs text-gray-500 dark:text-gray-500',
  };
  
  // Construir las clases
  const classes = `${textClasses[variant] || textClasses.body} ${className}`;
  
  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

Text.propTypes = {
  variant: PropTypes.oneOf(['body', 'lead', 'small', 'muted', 'caption']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Text;
