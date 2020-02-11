import React from 'react';
import { Card } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export const TabsPanelContainer = ({ status, className, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card className={className}>
      {children}
    </Card>
  );
};

export const TabsPanelHeader = ({ status, title, subtitle }) => {
  if (status !== 'edit') return null;
  if (!title) return null;

  return (
    <div className="panel-header">
      <h2 className="title">{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  );
}

export const TabsPanelBody = ({ status, isBusy, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card.Body>
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        {children}
      </BlockUi>
    </Card.Body>
  );
};

export const TabsPanelFooter = ({ status, isBusy, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card.Footer>
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        {children}
      </BlockUi>
    </Card.Footer>
  );
};
