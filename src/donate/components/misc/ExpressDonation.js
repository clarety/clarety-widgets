import React from 'react';
import { t } from 'shared/translations';
import { DonatePayPalBtn, DonateStripeWalletBtn } from 'donate/components';

export function ExpressDonation({ hideTitle, orTitle, hideOrTitle }) {
  const [hasActiveBtn, setHasActiveBtn] = React.useState(false);

  const buttons = [
    <DonateStripeWalletBtn
      key="stripe-wallet-btn"
      onShowBtn={() => setHasActiveBtn(true)}
    />,
    <DonatePayPalBtn
      key="pay-pal-btn"
      onShowBtn={() => setHasActiveBtn(true)}
    />,
  ];

  // At first, render buttons without the heading etc.
  // We don't know if any of them will actually display yet.
  if (!hasActiveBtn) {
    return buttons;
  }

  // Once we know that at least one button will display, render the full component.
  return (
    <div className="express-checkout">
      {!hideTitle &&
        <h4 className="title">
          {t('express-donation', 'Express Donation')}
        </h4>
      }

      <div className="express-checkout-buttons"> 
        {buttons}
      </div>

      {!hideOrTitle &&
        <div className="express-checkout-or">
          <div className="line" />
          <div className="text">{orTitle || t('or', 'Or')}</div>
          <div className="line" />
        </div>
      }
    </div>
  );
}
