import React from 'react';
import { PaymentPanel as BasePaymentPanel } from 'shared/components/panels/PaymentPanel';

export class PaymentPanel extends BasePaymentPanel {
  renderCartSummary() {
    return (
      <p className="donation-summary">
        Donation Amount: <b>{this.props.amount}</b>
      </p>
    );
  }
}
