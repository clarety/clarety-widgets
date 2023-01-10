import React from 'react';
import { t } from 'shared/translations';
import { _PaymentPanel as BasePaymentPanel, injectStripe } from 'shared/components';
import { Currency } from 'shared/components';

export class _PaymentPanel extends BasePaymentPanel {  
  renderCartSummary() {
    const { amount } = this.props;

    return (
      <p className="cart-summary">
        {t('amount', 'Amount')}: <b><Currency amount={amount} /></b>
      </p>
    );
  }
}

export const PaymentPanel = injectStripe(_PaymentPanel);
