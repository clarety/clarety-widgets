import React from 'react';
import { Container } from 'react-bootstrap';

export const StackPanelContainer = ({ status, className, children }) => {
  if (status === 'wait') return null;

  return (
    <div className={`stack-panel stack-panel-${status}`}>
      <Container className={className}>
        {children}
      </Container>
    </div>
  );
};

export const StackPanelHeader = ({ status, title }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <h2 className="panel-header panel-header-edit">{title}</h2>;
  if (status === 'done') return <h4 className="panel-header panel-header-done">{title}</h4>;
};

export const StackPanelBody = ({ status, isBusy, children }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <div className="panel-body panel-body-edit">{children}</div>;
  if (status === 'done') return <div className="panel-body panel-body-done">{children}</div>;
};

export const StackPanelFooter = ({ status, isBusy, children }) => (
  <div className="panel-actions">{children}</div>
);
