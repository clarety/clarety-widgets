import React from 'react';
import { Card } from 'react-bootstrap';

export const TabsPanelContainer = ({ status, className, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card className={className}>
      {children}
    </Card>
  );
};

export const TabsPanelHeader = ({ status, title, subtitle }) => (
  <div className="panel-header">
    <h2 className="title">{title}</h2>
    {subtitle && <p className="subtitle">{subtitle}</p>}
  </div>
);

export const TabsPanelBody = ({ status, isBusy, children }) => (
  <Card.Body>{children}</Card.Body>
);

export const TabsPanelFooter = ({ status, isBusy, children }) => (
  <Card.Footer>{children}</Card.Footer>
);
