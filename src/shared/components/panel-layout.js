import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Card, Button } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export const PanelContainer = ({ layout, name, children }) => {
  if (layout === 'stack') {
    return (
      <div className="stack-panel">
        <Container className={name}>
          {children}
        </Container>
      </div>
    );
  }

  if (layout === 'accordian') {
    return <div className="panel">{children}</div>;
  }

  if (layout === 'tabs') {
    return <Card>{children}</Card>;
  }

  return children;
};

export const PanelHeader = ({ layout, status, title, subtitle, number, intlId, intlValues, onPressEdit }) => {
  if (layout === 'stack') {
    return <StackPanelHeader status={status} intlId={intlId} intlValues={intlValues} onPressEdit={onPressEdit} />;
  }

  if (layout === 'accordian') {
    return <AccordianPanelHeader status={status} number={number} title={title} onPressEdit={onPressEdit} />;
  }

  if (layout === 'tabs') {
    return <TabsPanelHeader title={title} subtitle={subtitle} />;
  }
};

export const PanelBody = ({ layout, status, isBusy, children }) => {
  if (layout === 'stack') {
    return <StackPanelBody status={status} isBusy={isBusy}>{children}</StackPanelBody>;
  }

  if (layout === 'accordian') {
    return <AccordianPanelBody status={status} isBusy={isBusy}>{children}</AccordianPanelBody>;
  }

  if (layout === 'tabs') {
    return <TabsPanelBody isBusy={isBusy}>{children}</TabsPanelBody>;
  }

  return children;
};


// Stack

const StackPanelHeader = ({ status, intlId, intlValues }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <FormattedMessage tagName="h2" id={intlId} values={intlValues} />;
  if (status === 'done') return <FormattedMessage tagName="h4" id={intlId} values={intlValues} />;
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
  if (status === 'wait') return null;
  if (status === 'edit') return <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>{children}</BlockUi>;
  if (status === 'done') return null;

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


// Tabs

const TabsPanelHeader = ({ title, subtitle }) => (
  <div className="panel-header">
    <h2 className="title">{title}</h2>
    <p className="subtitle">{subtitle}</p>
  </div>
);

const TabsPanelBody = ({ isBusy, children }) => (
  <Card.Body>
    <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
      {children}
    </BlockUi>
  </Card.Body>
);
