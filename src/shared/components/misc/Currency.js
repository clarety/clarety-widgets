import React from 'react';
import { connect } from 'react-redux';
import { getSetting, getCurrency } from 'shared/selectors';
import { getCurrencySymbol, formatPrice } from 'shared/utils';

const _CurrencySymbol = ({ currency, hideCurrencyCode }) => {
  return getCurrencySymbol(currency, hideCurrencyCode);
};

const _Currency = ({ currency, amount = 0, hideCurrencyCode = false, hideCents = false }) => {
  return formatPrice(amount, currency, hideCurrencyCode, hideCents);
};

const mapStateToProps = (state, ownProps) => {
  return {
    currency: getCurrency(state),
    hideCurrencyCode: getSetting(state, 'hideCurrencyCode'),
  };
};

export const CurrencySymbol = connect(mapStateToProps)(_CurrencySymbol);
export const Currency = connect(mapStateToProps)(_Currency);
