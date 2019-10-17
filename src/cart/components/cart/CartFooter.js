import React from 'react';
import { connect } from 'react-redux';
import { getPath } from 'shared/utils';
import { getIsEmpty } from 'cart/selectors';

const _CartFooter = ({ isEmpty }) => {
  if (isEmpty) return null;

  const checkoutUrl = getPath('checkout');

  return (
      <div className="cart-widget__footer text-center">
          <p>Shipping, taxes, and discounts are calculated at checkout.</p>
          <a href={checkoutUrl} className="btn btn-secondary checkout">Checkout</a>
      </div>
  );
};

const mapStateToProps = (state) => {
  return {
      isEmpty: getIsEmpty(state),
  };
};

export const CartFooter = connect(mapStateToProps)(_CartFooter);
