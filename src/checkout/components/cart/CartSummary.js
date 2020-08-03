import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Currency } from 'shared/components';
import { getCart } from 'shared/selectors';
import { getCartSummaryMode } from 'checkout/selectors';
import { CartItem, PromoCodeForm } from 'checkout/components';

class _CartSummary extends React.Component {
  render() {
    const { cart, mode } = this.props;
    if (!cart.items) return null;

    return (
      <div>
        {mode === 'incomplete' &&
          <PromoCodeForm />
        }

        {cart.items.map(item =>
          <CartItem item={item} key={item.itemUid} />
        )}
        
        <CartTotals cart={cart} mode={mode} />

        {mode === 'incomplete' &&
          <a href="shop?showCart=true" className="btn btn-link btn-edit-cart">Edit Cart</a>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: getCart(state),
    mode: getCartSummaryMode(state),
  };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);

const CartTotals = ({ cart, mode }) => (
  <div className="cart-totals">
    <TotalLine label="Subtotal" value={cart.summary.subTotal} />

    {mode === 'complete' &&
      <React.Fragment>
        <TotalLine label="Shipping" value={cart.summary.shipping} />

        {cart.summary.taxType !== "Inclusive" &&
          <TotalLine label="Tax" value={cart.summary.tax} />
        }

        <hr />
        <TotalLine label="Total" value={cart.summary.total} className="grand-total" />
      </React.Fragment>
    }
  </div>
);

const TotalLine = ({ label, value, className }) => {
  if (value === undefined || value === null) {
    return null;
  }

  return (
    <Row className={className}>
      <Col className="total-label">{label}</Col>
      <Col className="total-amount">
        <Currency amount={value} />
      </Col>
    </Row>
  );
};
