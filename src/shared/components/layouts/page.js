import React from 'react';
import { Card } from 'react-bootstrap';

export const PagePanelContainer = ({ status, className, children }) => (
  <Card className={className}>{children}</Card>
);

export const PagePanelHeader = ({ status, title }) => (
  <div className="panel-header">
    <h2 className="title">{title}</h2>
  </div>
);

export const PagePanelBody = ({ status, isBusy, children }) => (
  <Card.Body>{children}</Card.Body>
);

export const PagePanelFooter = ({ status, isBusy, children }) => (
  <Card.Footer>{children}</Card.Footer>
);
