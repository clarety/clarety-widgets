import React from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { CartItem, PromoCodeForm } from 'checkout/components';
import { currency } from 'shared/utils';

class _CartSummary extends React.Component {
  render() {
    const { cart } = this.props;
    if (!cart.items) return null;

    return (
      <div>
        {cart.items.map(item =>
          <CartItem item={item} key={item.itemUid} />
        )}

        <PromoCodeForm />

        <hr />
        
        {cart.summary && <CartTotals summary={cart.summary} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart,
  };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);

const CartTotals = ({ summary }) => (
  <div className="cart-totals">
    <TotalLine label="Subtotal" value={summary.subTotal} />
    <TotalLine label="Shipping" value={summary.shipping} />
    <TotalLine label="Discount Code" value={summary.discount} />
    <hr />
    <TotalLine label="Total" value={summary.total} />
  </div>
);

const TotalLine = ({ label, value, fallback }) => {
  if (!value && !fallback) return null;

  const displayValue = value ? currency(value) : fallback;

  return (
    <Row as="dl">
      <dt className="col">{label}</dt>
      <dd className="col text-right">{displayValue}</dd>
    </Row>
  );
};
