import React from 'react';

export const PagePanelContainer = ({ children }) => (
  <div className="panel">{children}</div>
);

export const PagePanelHeader = ({ title }) => (
  <h2 className="panel-header">{title}</h2>
);

export const PagePanelBody = ({ children }) => (
  <div className="panel-body">{children}</div>
);
