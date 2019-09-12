import React from 'react';
import BlockUi from 'react-block-ui';
import { statuses } from 'shared/actions';
import { _DonateWidget, connectDonateWidget } from 'donate/components';
import { PageAmountPanel, PageDetailsPanel, PagePaymentPanel } from 'donate/components';

export class _DonatePage extends _DonateWidget {
  render() {
    const { status, variant } = this.props;

    const AmountPanelComponent  = this.context.AmountPanel  || PageAmountPanel;
    const DetailsPanelComponent = this.context.DetailsPanel || PageDetailsPanel;
    const PaymentPanelComponent = this.context.PaymentPanel || PagePaymentPanel;

    // Show a loading indicator while we init.
    if (status === statuses.uninitialized) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-donate-widget h-100">
        <BlockUi tag="div" blocking={status !== statuses.ready} loader={<span></span>}>
          <AmountPanelComponent  variant={variant} />
          <DetailsPanelComponent variant={variant} />
          <PaymentPanelComponent variant={variant} />
        </BlockUi>
      </div>
    );
  }
}

export const DonatePage = connectDonateWidget(_DonatePage);
