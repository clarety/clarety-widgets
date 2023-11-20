import React from 'react';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { ErrorMessages } from 'form/components';
import { ExpressDonation } from 'donate/components';

export class ExpressDonationPanel extends BasePanel {
  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="express-checkout-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title || t('expressDonationPanel.waitTitle', 'Express Donation')}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, isBusy, settings, hasExpressPaymentMethods } = this.props;

    // Don't display if there's no express payment methods.
    if (!hasExpressPaymentMethods) return null;

    return (
      <PanelContainer layout={layout} status="edit" className="express-checkout-panel">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title || t('expressDonationPanel.editTitle', 'Express Donation')}
          />
        }

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages />

          <ExpressDonation
            hideTitle
            orTitle={settings.orTitle}
            hideOrTitle={settings.hideOrTitle}
          />
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="express-checkout-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title || t('expressDonationPanel.doneTitle', 'Express Donation')}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}

/**
 * @deprecated
 * Use "ExpressDonationPanel" instead, this is just an alias for backwards compatibility.
 * The name "ExpressCheckoutPanel" was misleading, as the component is only for donations.
 */
export const ExpressCheckoutPanel = ExpressDonationPanel;
