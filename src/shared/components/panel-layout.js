import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Card, Button } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export const PanelContainer = ({ layout, status, className, children }) => {
  if (layout === 'stack') {
    return <StackPanelContainer status={status} className={className}>{children}</StackPanelContainer>;
  }

  if (layout === 'accordian') {
    return <AccordianPanelContainer status={status} className={className}>{children}</AccordianPanelContainer>;
  }

  if (layout === 'tabs') {
    return <TabsPanelContainer status={status} className={className}>{children}</TabsPanelContainer>;
  }

  if (layout === 'page') {
    return <PagePanelContainer status={status} className={className}>{children}</PagePanelContainer>;
  }

  throw new Error(`PanelContainer not implemented for layout ${layout}`);
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

  if (layout === 'page') {
    return <PagePanelHeader status={status} title={title} subtitle={subtitle} />;
  }

  throw new Error(`PanelHeader not implemented for layout ${layout}`);
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

  if (layout === 'page') {
    return <PagePanelBody status={status} isBusy={isBusy}>{children}</PagePanelBody>;
  }

  throw new Error(`PanelBody not implemented for layout ${layout}`);
};

export const PanelFooter = ({ layout, status, isBusy, children }) => {
  if (layout === 'tabs') {
    return <TabsPanelFooter status={status} isBusy={isBusy}>{children}</TabsPanelFooter>;
  }

  throw new Error(`PanelFooter not implemented for layout ${layout}`);
};


// Stack

const StackPanelContainer = ({ status, className, children }) => {
  if (status === 'wait') return null;

  return (
    <div className={`stack-panel stack-panel-${status}`}>
      <Container className={className}>
        {children}
      </Container>
    </div>
  );
};

const StackPanelHeader = ({ status, intlId, intlValues }) => {
  if (status === 'wait') return null;

  // NOTE: we use an array of values to handle rich text, and we
  // map them to fragments to suppress the 'key' warning.
  if (status === 'edit') {
    return (
      <FormattedMessage id={intlId} values={intlValues}>
        {(...values) => 
          <h2 className="panel-header panel-header-edit">
            {values.map((value, index) =>
              <React.Fragment key={index}>{value}</React.Fragment>
            )}
          </h2>
        }
      </FormattedMessage>
    );
  }

  if (status === 'done') {
    return (
      <FormattedMessage id={intlId} values={intlValues}>
        {text => <h4 className="panel-header panel-header-done">{text}</h4>}
      </FormattedMessage>
    );
  }
};

const StackPanelBody = ({ status, isBusy, children }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <div className="panel-body panel-body-edit">{children}</div>;
  if (status === 'done') return <div className="panel-body panel-body-done">{children}</div>;
};


// Page

const PagePanelContainer = ({ children }) => (
  <div className="panel">
    {children}
  </div>
);

const PagePanelHeader = ({ title }) => (
  <h2 className="panel-header">{title}</h2>
);

const PagePanelBody = ({ children }) => (
  <div className="panel-body">{children}</div>
);


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

const TabsPanelContainer = ({ status, className, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card className={className}>
      {children}
    </Card>
  );
};

const TabsPanelHeader = ({ status, title, subtitle }) => {
  if (status !== 'edit') return null;
  if (!title) return null;

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

const TabsPanelFooter = ({ status, isBusy, children }) => {
  if (status !== 'edit') return null;

  return (
    <Card.Footer>
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        {children}
      </BlockUi>
    </Card.Footer>
  );
};
