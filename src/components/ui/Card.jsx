import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

export const CardHeader = ({ children, className = '', ...props }) => {
  const headerClasses = `${theme.components.card.header} ${className}`;
  
  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  const bodyClasses = `${theme.components.card.body} ${className}`;
  
  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  const footerClasses = `${theme.components.card.footer} ${className}`;
  
  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

const Card = ({ children, className = '', ...props }) => {
  const cardClasses = `${theme.components.card.base} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
