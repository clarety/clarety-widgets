import React from 'react';
import { connect } from 'react-redux';
import { currency } from 'shared/utils';
import { CartItem, TotalLine } from "cart/components";
import { Row, Col } from "react-bootstrap";


class _CartSummary extends React.Component {
  render() {
    const { cart } = this.props;
    if (!cart || !cart.items) return null;

    return (
      <div className="cart-demo__summary">
          {cart.items.map(item =>
              <CartItem
                  item={item}
                  key={item.id}
              />
          )}
          <CartTotals summary={cart.summary} />
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
    <Row className="cart-demo__summary__subtotal">
        <Col xs={3}>
            &nbsp;
        </Col>
        <Col xs={9}>
            <Row>
                <TotalLine label="Subtotal" value={summary.subtotal} />
            </Row>
        </Col>
    </Row>
);