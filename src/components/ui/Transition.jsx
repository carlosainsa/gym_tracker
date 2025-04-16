import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const Transition = ({
  children,
  show = true,
  type = 'fade',
  duration = 'normal',
  className = '',
  ...props
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  
  // Obtener la duración de la transición del tema
  const transitionDuration = theme.transitions[duration] || theme.transitions.normal;
  
  // Definir las clases para cada tipo de transición
  const transitionClasses = {
    fade: {
      enter: 'opacity-0',
      enterActive: 'opacity-100',
      exit: 'opacity-0',
    },
    scale: {
      enter: 'opacity-0 scale-95',
      enterActive: 'opacity-100 scale-100',
      exit: 'opacity-0 scale-95',
    },
    slideUp: {
      enter: 'opacity-0 translate-y-4',
      enterActive: 'opacity-100 translate-y-0',
      exit: 'opacity-0 translate-y-4',
    },
    slideDown: {
      enter: 'opacity-0 -translate-y-4',
      enterActive: 'opacity-100 translate-y-0',
      exit: 'opacity-0 -translate-y-4',
    },
    slideLeft: {
      enter: 'opacity-0 translate-x-4',
      enterActive: 'opacity-100 translate-x-0',
      exit: 'opacity-0 translate-x-4',
    },
    slideRight: {
      enter: 'opacity-0 -translate-x-4',
      enterActive: 'opacity-100 translate-x-0',
      exit: 'opacity-0 -translate-x-4',
    },
  };
  
  // Obtener las clases para el tipo de transición seleccionado
  const { enter, enterActive, exit } = transitionClasses[type] || transitionClasses.fade;
  
  // Construir las clases base
  const baseClasses = `
    transition-all transform
    duration-${transitionDuration}
    ${className}
  `;
  
  // Efecto para manejar la aparición y desaparición
  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, parseInt(transitionDuration));
      
      return () => clearTimeout(timer);
    }
  }, [show, transitionDuration]);
  
  // Si no se debe renderizar, no renderizar nada
  if (!shouldRender) {
    return null;
  }
  
  // Construir las clases finales
  const classes = `
    ${baseClasses}
    ${show ? enterActive : exit}
  `;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Transition.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
  type: PropTypes.oneOf(['fade', 'scale', 'slideUp', 'slideDown', 'slideLeft', 'slideRight']),
  duration: PropTypes.oneOf(['fast', 'normal', 'slow']),
  className: PropTypes.string,
};

export default Transition;
