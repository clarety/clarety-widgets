import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
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
          intlId="reviewPanel.errorTitle"
        />

        <PanelBody layout={layout} status="edit">

          <FormattedMessage id="reviewPanel.errorSubtitle" tagName="p" />

          <Button onClick={this.onClickRetry}>
            <FormattedMessage id="btn.retry" />
          </Button>
          
        </PanelBody>
      </PanelContainer>
    );
  }

  renderReview() {
    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="reviewPanel.reviewTitle"
        />

        <PanelBody layout={layout} status="edit">

          <div className="panel-body text-center">
            {this.props.registration.map((registration, index) =>
              <p key={index} className="lead">{registration.description}</p>
            )}
          </div>

          <Button onClick={this.onClickNext}>
            <FormattedMessage id="btn.submit" />
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}
