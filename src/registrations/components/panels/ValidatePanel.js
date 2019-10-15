import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button } from 'react-bootstrap';
import { BasePanel } from 'registrations/components';
import { createRegistration } from 'registrations/actions';

class _ValidatePanel extends BasePanel {
  async onShowPanel() {
    const { createRegistration, nextPanel } = this.props;

    const didCreate = await createRegistration();
    if (didCreate) nextPanel();
  }

  onClickRetry = () => {
    this.onShowPanel();
  };

  renderWait() {
    return null;
  }

  renderEdit() {
    if (this.props.hasErrors) {
      return this.renderErrors();
    }
    
    return null;
  }

  renderDone() {
    return null;
  }
  
  renderErrors() {
    return (
      <Container>
        <FormattedMessage id="reviewPanel.errorTitle" tagName="h2" />
        <FormattedMessage id="reviewPanel.errorSubtitle" tagName="p" />

        <Button onClick={this.onClickRetry}>
          <FormattedMessage id="btn.retry" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    hasErrors: state.errors.length > 0,
  };
};

const actions = {
  createRegistration: createRegistration,
};

export const ValidatePanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ValidatePanel);
