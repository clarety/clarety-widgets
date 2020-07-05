import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { ErrorMessages } from 'form/components';

export class ValidatePanel extends BasePanel {
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
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={<FormattedMessage id="reviewPanel.errorTitle" defaultMessage="An Error Occured" />}
        />

        <PanelBody layout={layout} status="edit">

          <FormattedMessage id="reviewPanel.errorSubtitle" tagName="p" />

          <ErrorMessages showAll />

          <Button onClick={this.onClickRetry}>
            <FormattedMessage id="btn.retry" />
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}
