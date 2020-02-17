import React from 'react';
import { Button } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export const AccordianPanelContainer = ({ children }) => (
  <div className="panel">{children}</div>
);

export const AccordianPanelHeader = ({ status, number, title, onPressEdit }) => {
  if (status === 'wait') return <WaitPanelHeader number={number} title={title} />;
  if (status === 'edit') return <EditPanelHeader number={number} title={title} />;
  if (status === 'done') return <DonePanelHeader number={number} title={title} onPressEdit={onPressEdit} />;
};

export const AccordianPanelBody = ({ status, isBusy, children }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>{children}</BlockUi>;
  if (status === 'done') return null;
};

export const AccordianPanelFooter = ({ status, isBusy, children }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <div className="panel-actions">{children}</div>;
  if (status === 'done') return null;
};

const WaitPanelHeader = ({ number, title }) => (
  <div className="panel-header inactive">
    <span className="circle">{number}</span>
    <h4>{title}</h4>
  </div>
);

const EditPanelHeader = ({ number, title }) => (
  <div className="panel-header active">
    <span className="circle">{number}</span>
    <h4>{title}</h4>
  </div>
);

const DonePanelHeader = ({ number, title, onPressEdit }) => (
  <div className="panel-header inactive">
    <span className="circle">{number}</span>
    <p>{title}</p>
    <Button onClick={onPressEdit} variant="edit">Edit</Button>
  </div>
);
