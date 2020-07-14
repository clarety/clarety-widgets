import React from 'react';
import { Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { ErrorMessages } from 'form/components';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';

export class ReviewPanel extends BasePanel {
  onClickNext = () => {
    this.props.submitRegistration();
  };

  onClickRetry = () => {
    this.props.createRegistration();
  };

  onShowPanel() {
    this.props.createRegistration();
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { hasErrors, registration } = this.props;

    if (hasErrors) return this.renderErrors();
    if (registration) return this.renderReview();
    
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

  renderReview() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('reviewPanel.reviewTitle', 'Please Review Your Registration')}
        />

        <PanelBody layout={layout} status="edit">

          <div className="panel-body text-center">
            {this.props.registration.map((registration, index) =>
              <p key={index}>{registration.description}</p>
            )}
          </div>

          <Button onClick={this.onClickNext}>
            {t('btn.submit', 'Submit Registration')}
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}
