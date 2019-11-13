import React from 'react';
import BlockUi from 'react-block-ui';
import { statuses } from 'shared/actions';
import { Recaptcha } from 'form/components';
import { _DonateWidget, connectDonateWidget } from 'donate/components';
import { PageAmountPanel, PageFundraisingPanel, PageDetailsPanel, PagePaymentPanel } from 'donate/components';

export class _DonatePage extends _DonateWidget {
  render() {
    const { status, variant, showFundraising, reCaptchaKey } = this.props;

    const AmountPanelComponent      = this.context.AmountPanel      || PageAmountPanel;
    const DetailsPanelComponent     = this.context.DetailsPanel     || PageDetailsPanel;
    const FundraisingPanelComponent = this.context.FundraisingPanel || PageFundraisingPanel;
    const PaymentPanelComponent     = this.context.PaymentPanel     || PagePaymentPanel;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-donate-page">
        <BlockUi tag="div" blocking={status !== statuses.ready} loader={<span></span>}>
          <AmountPanelComponent  variant={variant} />
          <DetailsPanelComponent variant={variant} />
          {showFundraising && <FundraisingPanelComponent variant={variant} />}
          <PaymentPanelComponent variant={variant} />
        </BlockUi>

        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

export const DonatePage = connectDonateWidget(_DonatePage);
