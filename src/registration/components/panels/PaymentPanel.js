import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { _PaymentPanel as BasePaymentPanel, injectStripe } from 'shared/components';
import { Currency } from 'shared/components';
import { formatDate } from 'shared/utils';
import { CheckboxInput } from 'form/components';
import { RegoPayPalBtn } from 'registration/components/misc/RegoPayPalBtn';

export class _PaymentPanel extends BasePaymentPanel {
  onEditCartItem = (event, item) => {
    event.preventDefault();

    const panelIndex = this.props.cartItemPanelIndexes[item.appRef];
    if (panelIndex !== -1) {
      this.props.editPanelAtIndex(panelIndex);
    }
  };

  getTitleText() {
    const { settings } = this.props;
    return settings.title || t(['rego-payment-title', 'payment-details'], 'Payment Details');
  }

  getSubmitBtnText() {
    const { settings } = this.props;
    return settings.submitBtnText || t(['rego-payment-submit', 'pay'], 'Pay Now');
  }

  renderCartSummary() {
    const { cart } = this.props;

    return (
      <React.Fragment>
        <div className="cart-summary">
          {cart.items.map((item, index) =>
            <CartItem
              key={index}
              item={item}
              onClickEdit={
                this.props.cartItemPanelIndexes[item.appRef] !== -1
                  ? this.onEditCartItem
                  : undefined
              }
            />
          )}
          
          <CartTotals summary={cart.summary} />
        </div>

        {this.renderShippingOptions()}
      </React.Fragment>
    );
  }

  renderPayPalFields(paymentMethod) {
    return (
      <div className="paypal-btn-container">
        <RegoPayPalBtn />
      </div>
    );
  }

  renderTermsCheckbox() {
    return (
      <React.Fragment>
        {super.renderTermsCheckbox()}
        {this.renderCoverFeesCheckbox()}
      </React.Fragment>
    );
  }

  renderCoverFeesCheckbox() {
    const { coverFeeAmount } = this.props;
    if (!coverFeeAmount) return null;

    return (
      <CheckboxInput
        field="payment.coverFees"
        label={
          <React.Fragment>
            {t('give-additional', 'I choose to give an additional')}
            {' '}
            <Currency amount={coverFeeAmount} />
            {' '}
            {t('to-help-cover-costs', 'to help cover the costs and processing fees associated with my donation')}
          </React.Fragment>
        }
        className="cover-fees-checkbox"
      />
    );
  }

  renderShippingOptions() {
    const { cart } = this.props;
    if (!cart.shippingOptions || !cart.shippingOptions.length) return null;

    return (
      <div className="shipping-options">
        <h3>{t('paymentPanel.shippingTitle', 'Shipping Options')}</h3>
        
        {cart.shippingOptions.map(this.renderShippingOption)}
      </div>
    );
  }

  renderShippingOption = (option) => {
    const { cart, updateShipping } = this.props;

    return (
      <Form.Check type="radio" id={option.key} key={option.key} className="shipping-option">
        <Form.Check.Input
          type="radio"
          name="shippingOption"
          checked={cart.shippingKey === option.key}
          onChange={() => updateShipping(option.key)}
        />

        <Form.Check.Label>
          <span className="shipping-option__name">
            {option.description}
          </span>
          <span className="shipping-option__cost">
            <Currency amount={option.amount} />
          </span>
        </Form.Check.Label>

        {option.expectedDelivery &&
          <p className="shipping-option__date">
            {t('label.estimatedDelivery', 'Estimated Delivery')}: {formatDate(option.expectedDelivery)}
          </p>
        }
      </Form.Check>
    );
  };
}

export const PaymentPanel = injectStripe(_PaymentPanel);

const CartItem = ({ item, onClickEdit }) => (
  <Row as="dl" className="cart-item">
    <Col as="dt">
      {item.description}
      &nbsp;&nbsp;
      {onClickEdit && <a href="#" onClick={(event) => onClickEdit(event, item)}>({t('edit', 'Edit')})</a>}

      {item.discountDescription &&
        <p className="discount-description">{item.discountDescription}</p>
      }
    </Col>
    <Col as="dd" xs={4} md={3} className="text-right">
      <Currency amount={item.total} />
    </Col>
  </Row>
);

const CartTotals = ({ summary }) => (
  <div className="cart-totals">
    <TotalLine label={t('label.subtotal', 'Subtotal')} value={summary.subTotal} />
    <TotalLine label={t('label.promoCode', 'Promo Code')} value={summary.discount} />
    {!!summary.shipping && <TotalLine label={t('label.shipping', 'Shipping')} value={summary.shipping} />}
    {!!summary.tax && <TotalLine label={t('label.tax', 'Tax')} value={summary.tax} />}
    <hr />
    <TotalLine label={t('label.total', 'Total')} value={summary.total} />
  </div>
);

const TotalLine = ({ label, value }) => {
  if (value === undefined || value === null) {
    return null;
  }

  return (
    <Row as="dl">
      <Col as="dt">{label}</Col>
      <Col as="dd" xs={4} md={3} className="text-right">
        <Currency amount={value} />
      </Col>
    </Row>
  );
};
