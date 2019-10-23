import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { PaymentPanel as SharedPaymentPanel } from 'shared/components/panels/PaymentPanel';
import { currency } from 'shared/utils';

export class PaymentPanel extends SharedPaymentPanel {
  renderCartSummary() {
    const { cart } = this.props;

    return (
      <div className="my-5 text-left">
        {cart.items.map((item, index) =>
          <CartItem key={index} item={item} />
        )}

        <CartTotals summary={cart.summary} />
      </div>
    );
  }
}

const CartItem = ({ item }) => (
  <Row as="dl" className="cart-item">
    <Col as="dt">{item.description}</Col>
    <Col as="dd" xs={3} className="text-right">{item.total}</Col>
  </Row>
);

const CartTotals = ({ summary }) => (
  <div className="cart-totals">
    <TotalLine label="Subtotal" value={summary.subTotal} />
    <TotalLine label="Discount Code" value={summary.discount} />
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
      <Col as="dd" xs={3} className="text-right">{currency(value)}</Col>
    </Row>
  );
};
