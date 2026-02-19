import React from 'react';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { DonationList } from 'update-payment-details/components';

export class SuccessPanel extends BasePanel {
  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="success-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    return this.renderContent();
  }

  renderContent() {
    const { layout, isBusy, index, settings, selectedDonations } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="success-panel">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title || t('thankyou', 'Thankyou!')}
          />
        }

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <p className="sub-title">{t('update-payment-details-success.subtitle', 'Your payment details have been updated and will be applied to the donations listed below.')}</p>
          <p>{t('update-payment-details-success.description', '')}</p>

          <DonationList
            recurringDonations={selectedDonations}
          />
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="success-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
