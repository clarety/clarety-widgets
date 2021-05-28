import React from 'react';
import { connect } from 'react-redux';
import { t } from 'shared/translations';
import { getPath } from 'shared/utils';
import { getIsEmpty } from 'cart/selectors';

const _CartFooter = ({ isEmpty }) => {
  if (isEmpty) return null;

  const checkoutUrl = getPath('checkout');

  return (
      <div className="cart-widget__footer text-center">
          <p>{t('cart-footer', 'Shipping, taxes, and discounts are calculated at checkout.')}</p>
          <a href={checkoutUrl} className="btn btn-primary">{t('checkout', 'Checkout')}</a>
      </div>
  );
};

const mapStateToProps = (state) => {
  return {
      isEmpty: getIsEmpty(state),
  };
};

export const CartFooter = connect(mapStateToProps)(_CartFooter);
