import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';
import { SubmitButton, ErrorMessages } from 'form/components';

export class SubmitPanel extends BasePanel {
  renderWait() {
    return null;
  }

  onPressSubmit = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;

    const paymentPanel = this.getPaymentPanel();
    const paymentData = paymentPanel.getPaymentData();
    
    const didSubmit = await onSubmit(paymentData, { isPageLayout: true });
    if (!didSubmit) return;

    nextPanel();
  };

  getPaymentPanel() {
    return this.props.panelRefs.find(
      panel => panel.constructor.name === '_PaymentPanel'
            || panel.constructor.name === 'PaymentPanel'
    );
  }

  validate() {
    // Validate any panels with a 'validate' function.
    for (const panel of this.props.panelRefs) {
      if (panel === this) continue;
      if (!panel.validate) continue;

      if (!panel.validate()) {
        panel.scrollIntoView();
        return false;
      }
    }

    return true;
  }

  canContinue() {
    return true;
  }

  renderEdit() {
    const { layout, isBusy, settings } = this.props;

    return (
      <form onSubmit={this.onPressSubmit}>
        <PanelContainer layout={layout} status="edit" className="submit-panel">
          <PanelBody layout={layout} status="edit" isBusy={isBusy}>
            {this.renderTermsCheckbox()}

            <Row>
              <Col>
                <ErrorMessages />

                <SubmitButton
                  title={settings.submitBtnText || t('donate', 'Donate')}
                  isDisabled={!this.canContinue()}
                  testId="donate-button"
                  block
                />
              </Col>
            </Row>

            {this.renderFooter()}
          </PanelBody>
        </PanelContainer>
      </form>
    );
  }

  renderTermsCheckbox() {
    return null;
  }

  renderFooter() {
    const { settings } = this.props;

    if (settings.TermsComponent) {
      return <settings.TermsComponent {...this.props} />;
    }

    return null;
  }

  renderDone() {
    return null;
  }
}
