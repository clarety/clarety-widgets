import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { _PaymentPanel as BasePaymentPanel } from 'shared/components';
import { Currency } from 'shared/components';
import { formatDate } from 'shared/utils';

export class PaymentPanel extends BasePaymentPanel {
  renderCartSummary() {
    const { cart } = this.props;

    return (
      <React.Fragment>
        <div className="cart-summary">
          {cart.items.map((item, index) =>
            <CartItem key={index} item={item} />
          )}
          
          <CartTotals summary={cart.summary} />
        </div>

        {this.renderShippingOptions()}
      </React.Fragment>
    );
  }

  renderShippingOptions() {
    const { cart } = this.props;
    if (!cart.shippingOptions || !cart.shippingOptions.length) return null;

    return (
      <div className="shipping-options">
        <h3>Shipping Options</h3>
        
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
            Estimated Delivery: {formatDate(option.expectedDelivery)}
          </p>
        }
      </Form.Check>
    );
  };
}

const CartItem = ({ item }) => (
  <Row as="dl" className="cart-item">
    <Col as="dt">
      {item.description}
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
    <TotalLine label="Subtotal" value={summary.subTotal} />
    <TotalLine label="Discount Code" value={summary.discount} />
    <TotalLine label="Shipping" value={summary.shipping} />
    <hr />
    <TotalLine label="Total" value={summary.total} />
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
