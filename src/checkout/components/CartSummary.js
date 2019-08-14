import React from 'react';
import { connect } from 'react-redux';
import { DiscountCodeForm } from 'checkout/components';
import { currency } from 'checkout/utils';

class _CartSummary extends React.Component {
  render() {
    const { cart } = this.props;
    if (!cart || !cart.items) return null;

    return (
      <div>
        {cart.items.map(item =>
          <CartItem item={item} key={item.uid} />
        )}
        <hr />
        <DiscountCodeForm />
        <hr />
        <CartTotals summary={cart.summary} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.checkout.cart,
  };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);


const CartItem = ({ item }) => (
  <p>{item.description}</p>
);

const CartTotals = ({ summary }) => (
  <React.Fragment>
    <dl className="row">
      <TotalLine label="Subtotal" value={summary.subtotal} />
      <TotalLine label="Shipping" value={summary.shipping} fallback="TBD" />
      <TotalLine label="Discount Code" value={summary.discount} />
    </dl>

    <hr />

    <dl className="row">
      <TotalLine label="Total in AUD" value={summary.total} />
    </dl>
  </React.Fragment>
);

const TotalLine = ({ label, value, fallback }) => {
  if (!value && !fallback) return null;

  const displayValue = value ? currency(value) : fallback;

  return (
    <React.Fragment>
      <dt className="col-sm-9">{label}</dt>
      <dd className="col-sm-3 text-right">{displayValue}</dd>
    </React.Fragment>
  );
};
