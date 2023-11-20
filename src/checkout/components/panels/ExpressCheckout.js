import React from 'react';
import { connect } from 'react-redux';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { t } from 'shared/translations';
import { statuses } from 'shared/actions';
import { CheckoutStripeWalletBtn } from 'checkout/components';

function _ExpressCheckout({ isBusy }) {
  const [hasActiveBtn, setHasActiveBtn] = React.useState(false);

  const buttons = [
    <CheckoutStripeWalletBtn
      key="stripe-wallet-btn"
      onShowBtn={() => setHasActiveBtn(true)}
    />
  ];

  // At first, render buttons without the heading etc.
  // We don't know if any of them will actually display yet.
  if (!hasActiveBtn) {
    return buttons;
  }

  // Once we know that at least one button will display, render the full component.
  return (
    <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
      <div className="express-checkout">
        <h4 className="title">
          {t('express-checkout', 'Express Checkout')}
        </h4>

        <div className="express-checkout-buttons">
          {buttons}
        </div>

        <div className="express-checkout-or">
          <div className="line" />
          <div className="text">{t('or', 'Or')}</div>
          <div className="line" />
        </div>
      </div>
    </BlockUi>
  );
}

const mapStateToProps = (state, ownProps) => ({
  isBusy: state.status !== statuses.ready,
});

const actions = {};

export const ExpressCheckout = connect(mapStateToProps, actions)(_ExpressCheckout);
