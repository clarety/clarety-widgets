import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { PaymentPanel } from 'shared/components/panels/PaymentPanel';
import { currency } from 'shared/utils';
import { makePayment } from 'registration/actions';
import { getCart } from 'registration/selectors';

class _RegistrationPaymentPanel extends PaymentPanel {
  renderCartSummary() {
    const { cart } = this.props;

    return (
      <div className="my-5">
        <h4>Registration Summary</h4>

        {cart.items.map((item, index) =>
          <CartItem key={index} item={item} />
        )}

        <CartTotals summary={cart.summary} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isBusy: state.status === 'busy',
    errors: state.errors,
    paymentMethod: { type: 'gatewaycc' },
    submitBtnTitle: 'Submit Registration',
    cart: getCart(state),
  };
};

const actions = {
  onShowPanel: () => ({ type: 'NO_OP' }),
  makePayment: makePayment,
};

export const RegistrationPaymentPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_RegistrationPaymentPanel);


const CartItem = ({ item }) => (
  <Row className="cart-item">
    <Col>
      <Row as="dl">
        <dt className="col">{item.description}</dt>
        <dd className="col text-right">{item.total}</dd>
      </Row>
    </Col>
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
      <dt className="col">{label}</dt>
      <dd className="col text-right">{currency(value)}</dd>
    </Row>
  );
};
