import React from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { Currency } from 'shared/components';
import { CartItem, PromoCodeForm } from 'checkout/components';

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
        
        {cart.summary && <CartTotals cart={cart} />}

        <a href="shop?showCart=true" className="btn btn-link btn-edit-cart">Edit Cart</a>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart
  };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);

const CartTotals = ({ cart }) => (
  <div className="cart-totals">
    <TotalLine label="Subtotal" value={cart.summary.subTotal} />

    {shouldShowShipping(cart) &&
      <TotalLine label="Shipping" value={cart.summary.shipping} />
    }

    <TotalLine label="Discount Code" value={cart.summary.discount} />
    <hr />
    <TotalLine label="Total" value={cart.summary.total} />
  </div>
);

const TotalLine = ({ label, value }) => {
  if (value === undefined || value === null) {
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

// NOTE: A bug in the API causes the cart to return a shipping cost of $0 if shipping has not been calculated yet.
// So we hide the value until an address has been set in the cart, at which point we assume the shipping value is now correct.
function shouldShowShipping(cart) {
  const isRequired = cart.shippingRequired;
  const hasAddress = cart.customer && cart.customer.delivery && cart.customer.delivery.address1;
  return isRequired && hasAddress;
}
