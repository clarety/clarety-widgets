import React from 'react';
import BlockUi from 'react-block-ui';
import { statuses } from 'shared/actions';
import { Recaptcha } from 'form/components';
import { _DonateWidgetRoot, connectDonateWidgetRoot } from 'donate/components';
import { PageAmountPanel, PageFundraisingPanel, PageDetailsPanel, PagePaymentPanel } from 'donate/components';

export class DonatePage extends React.Component {
  render() {
    return <DonatePageRoot {...this.props} />
  }
}

export class _DonatePageRoot extends _DonateWidgetRoot {
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

const DonatePageRoot = connectDonateWidgetRoot(_DonatePageRoot);
