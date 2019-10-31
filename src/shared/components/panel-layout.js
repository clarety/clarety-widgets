import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Card, Button } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export const PanelContainer = ({ layout, status, className, children }) => {
  if (layout === 'stack') {
    return (<StackPanelContainer status={status} className={className}>{children}</StackPanelContainer>);
  }

  if (layout === 'accordian') {
    return (<AccordianPanelContainer>{children}</AccordianPanelContainer>);
  }

  if (layout === 'tabs') {
    return (<TabsPanelContainer status={status}>{children}</TabsPanelContainer>);
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
    return <TabsPanelHeader status={status} title={title} subtitle={subtitle} />;
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
    return <TabsPanelBody status={status} isBusy={isBusy}>{children}</TabsPanelBody>;
  }

  return children;
};


// Stack

const StackPanelContainer = ({ status, className, children }) => {
  if (status === 'wait') return null;

  return (
    <div className="stack-panel">
      <Container className={className}>
        {children}
      </Container>
    </div>
  );
};

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

const AccordianPanelContainer = ({ children }) => (
  <div className="panel">
    {children}
  </div>
);

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

const TabsPanelContainer = ({ status, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card>
      {children}
    </Card>
  );
};

const TabsPanelHeader = ({ status, title, subtitle }) => {
  if (status !== 'edit') return null;

  return (
    <div className="panel-header">
      <h2 className="title">{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  );
}

const TabsPanelBody = ({ status, isBusy, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card.Body>
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        {children}
      </BlockUi>
    </Card.Body>
  );
};
