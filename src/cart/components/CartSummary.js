import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from "react-bootstrap";
import { CartItem, TotalLine } from "cart/components";

class _CartSummary extends React.Component {
  render() {
    const { cart, isBusy } = this.props;

    if (!cart.items && isBusy) {
      return null;
    }

    if (!cart.items || !cart.items.length) {
        return (
            <div className="cart-widget__empty">
                Your cart is empty.
            </div>
        );
    }

    return (
      <div className="cart-widget__summary">
          {cart.items.map(item =>
              <CartItem
                  item={item}
                  key={item.itemUid}
              />
          )}

          <CartTotals summary={cart.summary} />
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        isBusy: state.isBusy,
        cart: state.cart,
    };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);

const CartTotals = ({ summary }) => (
    <Row className="cart-widget__summary__subtotal">
        <Col xs={3}>
            &nbsp;
        </Col>
        <Col xs={9}>
            <Row>
                <TotalLine label="Subtotal" value={summary.subTotal} />
            </Row>
        </Col>
    </Row>
);
