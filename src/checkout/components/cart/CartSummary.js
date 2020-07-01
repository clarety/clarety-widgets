import React from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { Currency } from 'shared/components';
import { CartItem, PromoCodeForm } from 'checkout/components';
import {getCartShippingRequired} from "shared/selectors";

class _CartSummary extends React.Component {
  render() {
    const { cart, shippingRequired} = this.props;
    if (!cart.items) return null;

    return (
      <div>
        {cart.items.map(item =>
          <CartItem item={item} key={item.itemUid} />
        )}

        <PromoCodeForm />

        <hr />
        
        {cart.summary && <CartTotals summary={cart.summary} shippingRequired={shippingRequired}/>}

        <a href="shop?showCart=true" className="btn btn-link btn-edit-cart">Edit Cart</a>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart,
    shippingRequired: getCartShippingRequired(state)
  };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);

const CartTotals = ({ summary, shippingRequired }) => (
  <div className="cart-totals">
    <TotalLine label="Subtotal" value={summary.subTotal} />
    <TotalLine label="Shipping" value={summary.shipping} hide={!shippingRequired} />
    <TotalLine label="Discount Code" value={summary.discount} />
    <hr />
    <TotalLine label="Total" value={summary.total} />
  </div>
);

const TotalLine = ({ label, value, hide }) => {
  if (value === undefined || value === null || hide) {
    return null;
  }

  return (
    <Row as="dl">
      <dt className="col">{label}</dt>
      <dd className="col text-right">
        <Currency amount={value} />
      </dd>
    </Row>
  );
};
