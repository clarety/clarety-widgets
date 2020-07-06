import React from 'react';
import { Button } from 'react-bootstrap';
import { t } from 'shared/translations';
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
          title={t('reviewPanel.errorTitle', 'We Found Some Problems With Your Registration')}
        />
        <PanelBody layout={layout} status="edit">

          <p>{t('reviewPanel.errorSubtitle', 'Please correct the issues and try again')}</p>

          <ErrorMessages showAll />

          <Button onClick={this.onClickRetry}>
            {t('btn.retry', 'Try Again')}
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}
