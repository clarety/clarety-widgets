import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Button } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export const PanelContainer = ({ layout, children }) => {
  if (layout === 'stack') {
    return <Container>{children}</Container>;
  }

  if (layout === 'accordian') {
    return <div className="panel">{children}</div>;
  }

  return children;
};

export const PanelHeader = ({ layout, status, title, number, intlId, onPressEdit }) => {
  if (layout === 'stack') {
    return <StackPanelHeader status={status} intlId={intlId} onPressEdit={onPressEdit} />;
  }

  if (layout === 'accordian') {
    return <AccordianPanelHeader status={status} number={number} title={title} onPressEdit={onPressEdit} />;
  }
};

export const PanelBody = ({ layout, status, isBusy, children }) => {
  if (layout === 'stack') {
    return <StackPanelBody status={status} isBusy={isBusy}>{children}</StackPanelBody>;
  }

  if (layout === 'accordian') {
    return <AccordianPanelBody status={status} isBusy={isBusy}>{children}</AccordianPanelBody>;
  }

  return children;
};


// Stack

const StackPanelHeader = ({ status, intlId }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <FormattedMessage id={intlId} tagName="h2" />;
  if (status === 'done') return <FormattedMessage id={intlId} tagName="h4" />;
};

const StackPanelBody = ({ status, isBusy, children }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <div className="panel-body">{children}</div>;
  if (status === 'done') return <div className="panel-body">{children}</div>;
};


// Accordian

const AccordianPanelHeader = ({ status, number, title, onPressEdit }) => {
  if (status === 'wait') return <WaitPanelHeader number={number} title={title} />;
  if (status === 'edit') return <EditPanelHeader number={number} title={title} />;
  if (status === 'done') return <DonePanelHeader number={number} title={title} onPressEdit={onPressEdit} />;
};

const AccordianPanelBody = ({ status, isBusy, children }) => {
  if (status === 'wait') return <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>{children}</BlockUi>;
  if (status === 'edit') return <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>{children}</BlockUi>;
  if (status === 'done') return <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>{children}</BlockUi>;

  throw new Error(`[Clarety] AccordianPanelBody: Unhanlded status ${status}`);
};

export const WaitPanelHeader = ({ number, title }) => (
  <div className="panel-header inactive">
    <span className="circle">{number}</span>
    <h4>{title}</h4>
  </div>
);

export const EditPanelHeader = ({ number, title }) => (
  <div className="panel-header active">
    <span className="circle">{number}</span>
    <h4>{title}</h4>
  </div>
);

export const DonePanelHeader = ({ number, title, onPressEdit }) => (
  <div className="panel-header inactive">
    <span className="circle">{number}</span>
    <p>{title}</p>
    <Button onClick={onPressEdit} variant="edit">Edit</Button>
  </div>
);
