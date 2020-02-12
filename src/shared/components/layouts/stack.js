import React from 'react';
import { FormattedMessage } from 'react-intl';
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

export const StackPanelHeader = ({ status, intlId, intlValues }) => {
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

export const StackPanelBody = ({ status, isBusy, children }) => {
  if (status === 'wait') return null;
  if (status === 'edit') return <div className="panel-body panel-body-edit">{children}</div>;
  if (status === 'done') return <div className="panel-body panel-body-done">{children}</div>;
};
